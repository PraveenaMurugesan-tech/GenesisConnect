import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Automatically inject Bearer JWT authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("genesis_access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthenticated and token expiration centrally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      if (!isLoginRequest) {
        // Clear expired or invalidated credentials
        localStorage.removeItem("genesis_access_token");
        localStorage.removeItem("genesis_admin_user");
        window.dispatchEvent(new Event("auth-state-changed"));

        // Redirect to admin login if currently on a protected admin page
        if (
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin/login"
        ) {
          window.location.href = "/admin/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
