// src/services/interceptors.ts
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { AuthService } from "./AuthService";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/", // Ajusta a tu backend real
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Flag para evitar múltiples refresh simultáneos
let isRefreshing = false;
// Cola para guardar requests mientras se refresca token
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      if (token && prom.config.headers) {
        prom.config.headers["Authorization"] = `Bearer ${token}`;
      }
      prom.resolve(apiClient(prom.config));
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Mientras se refresca token, encolar la request y esperar
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const authService = new AuthService();
        const tokenResponse = await authService.refreshToken(refresh);

        localStorage.setItem("access_token", tokenResponse.access);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${tokenResponse.access}`;
        }

        processQueue(null, tokenResponse.access);
        return apiClient(originalRequest);
      } catch (authError) {
        processQueue(authError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(authError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
