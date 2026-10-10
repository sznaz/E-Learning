import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear invalid auth
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/admin")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Dispatch custom event or redirect if on protected route
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
