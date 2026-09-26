// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — GenesisConnect
// Administrative Authentication Service Module
// ==============================================================================

import { apiClient } from "../services/api";
import { User, LoginCredentials, AuthResponse } from "../types";

export const TOKEN_STORAGE_KEY = "genesis_access_token";
export const USER_STORAGE_KEY = "genesis_admin_user";

export const authService = {
  /**
   * Authenticate administrator credentials against FastAPI backend
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    const { access_token, user } = response.data;

    if (access_token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event("auth-state-changed"));
    }

    return response.data;
  },

  /**
   * Fetch currently authenticated admin profile
   */
  async getCurrentAdmin(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    if (response.data) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data));
    }
    return response.data;
  },

  /**
   * Clears all administrative tokens and session storage
   */
  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    window.dispatchEvent(new Event("auth-state-changed"));
  },

  /**
   * Returns currently stored access token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Returns currently cached user profile
   */
  getCachedUser(): User | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Quick synchronous authentication check
   */
  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_STORAGE_KEY));
  },
};

export default authService;
