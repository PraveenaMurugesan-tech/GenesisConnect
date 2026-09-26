import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, LoginCredentials, AuthResponse } from "../types";
import { apiClient } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TOKEN_STORAGE_KEY = "genesis_access_token";
export const USER_STORAGE_KEY = "genesis_admin_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-state-changed"));
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<User>("/auth/me");
      setUser(response.data);
      setToken(currentToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data));
    } catch (err: any) {
      // If unauthorized or token invalid, purge state
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    const { access_token, user: loggedInUser } = response.data;

    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));

    setToken(access_token);
    setUser(loggedInUser);
    window.dispatchEvent(new Event("auth-state-changed"));
  };

  useEffect(() => {
    refreshUser();

    const handleAuthChange = () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken && token) {
        setToken(null);
        setUser(null);
      }
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [refreshUser, token]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
