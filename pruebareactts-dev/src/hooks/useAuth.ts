import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, logoutUser } from "../redux/slices/authSlice";
import { AuthService } from "../services/AuthService";

type LoginParams = {
  access_token: string;
  refresh_token: string;
  user: any; // Ajusta el tipo si tienes uno más estricto
};

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    if (!payload.exp) return false;
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const doLogin = useCallback((params: LoginParams) => {
    dispatch(loginUser(params.user));
    localStorage.setItem("access_token", params.access_token);
    localStorage.setItem("refresh_token", params.refresh_token);
    setIsAuthenticated(true);
  }, [dispatch]);

  const doLogout = useCallback(() => {
    dispatch(logoutUser());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  }, [dispatch]);

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    if (access && refresh && isTokenValid(access)) {
      new AuthService()
        .me()
        .then((responseUser) => {
          if (responseUser && responseUser.username) {
            dispatch(loginUser(responseUser));
            setIsAuthenticated(true);
          } else {
            doLogout();
          }
        })
        .catch(() => {
          doLogout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      doLogout();
      setLoading(false);
    }
  }, [dispatch, doLogout]);

  return { user, isAuthenticated, doLogin, doLogout, loading };
};
