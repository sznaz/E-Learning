import React, { createContext, useContext, useState, useEffect } from "react";
import { User, authApi, LoginPayload, RegisterPayload } from "../api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(payload);
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(payload);
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === "SUPER_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isTeacher,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
