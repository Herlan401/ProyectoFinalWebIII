// services/AuthService.ts
import apiClient from "./interceptors";
import { LoginResponse } from "../models/dto/LoginResponse";
import { RefreshTokenResponse } from "../models/dto/RefreshTokenResponse";
import { RegisterResponse } from "../models/dto/RegisterResponse";
import { UserInfoResponse } from "../models/dto/UserInfoResponse";
import { Role } from "../models/Role";
import { User } from "../models/User";

export class AuthService {
  // Login: usuario + contraseña -> tokens + usuario (con rol)
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("api/login/", {
      username,
      password,
    });

    const { access, refresh, usuario } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(usuario));

    return response.data;
  }

  // Refresh token: usa token refresh para obtener uno nuevo
  async refreshToken(refresh: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>("token/refresh/", {
      refresh,
    });
    return response.data;
  }

  // Registro (si usas endpoint para registrar)
  async register(
    nombre_completo: string,
    ci: string,
    username: string,
    password: string
  ): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>("usuarios/auth/register/", {
      nombre_completo,
      ci,
      username,
      password,
    });
    return response.data;
  }

  // Obtener info usuario actual (me)
  async me(): Promise<UserInfoResponse> {
    const response = await apiClient.get<UserInfoResponse>("api/auth/me/");
    return response.data;
  }

  // Cerrar sesión local
  logout(): void {
    localStorage.clear();
    window.location.href = "/login";
  }

  // --- CRUD Usuarios ---

  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>("api/usuarios/");
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`api/usuarios/${id}/`);
    return response.data;
  }

  async createUser(data: Partial<User>): Promise<User> {
    const response = await apiClient.post<User>("api/usuarios/", data);
    return response.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
  const response = await apiClient.patch<User>(`api/usuarios/${id}/`, data);
  return response.data;
}

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`api/usuarios/${id}/`);
  }


  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>("api/roles/");
    return response.data;
  }
}
