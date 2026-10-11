import { create } from "zustand";
import type { User } from "../api/auth";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  logout: () => void;
}

export const computeRoles = (user: User | null, token: string | null) => {
  const isAdmin = user?.role === "SUPER_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT" || Boolean(user && !isAdmin && !isTeacher);
  const isAuthenticated = Boolean(user && token);

  return {
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  isTeacher: false,
  isStudent: false,

  setAuth: (user: User, token: string) => {
    set({
      user,
      token,
      ...computeRoles(user, token),
    });
  },

  setUser: (user: User | null) => {
    const currentToken = get().token;
    set({
      user,
      ...computeRoles(user, currentToken),
    });
  },

  setToken: (token: string | null) => {
    const currentUser = get().user;
    set({
      token,
      ...computeRoles(currentUser, token),
    });
  },

  clearAuth: () => {
    set({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      isTeacher: false,
      isStudent: false,
    });
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      isTeacher: false,
      isStudent: false,
    });
  },
}));

export const useAuth = useAuthStore;
export default useAuthStore;
