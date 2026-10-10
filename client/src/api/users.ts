import apiClient from "./client";
import { User, UserRole } from "./auth";
import { ApiResponse } from "./courses";

export interface UserFilterParams {
  search?: string;
  role?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export const usersApi = {
  getAll: async (params?: UserFilterParams): Promise<User[]> => {
    const res = await apiClient.get<ApiResponse<User[]>>("/users", {
      params,
    });
    return res.data.data || [];
  },

  getTeachers: async (search?: string): Promise<User[]> => {
    const res = await apiClient.get<ApiResponse<User[]>>("/users/teachers", {
      params: { search },
    });
    return res.data.data || [];
  },

  getById: async (id: string): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const res = await apiClient.post<ApiResponse<User>>("/users", payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const res = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
