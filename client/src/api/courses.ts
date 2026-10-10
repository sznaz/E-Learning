import apiClient from "./client";

export interface Course {
  _id: string;
  title: string;
  description: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price: number;
  category: string;
  thumbnail?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFilterParams {
  search?: string;
  category?: string;
  level?: string;
  language?: string;
  isPublished?: boolean;
}

export interface ApiResponse<T> {
  error: boolean;
  statusCode: number;
  data: T;
  message: string;
}

export const coursesApi = {
  getAll: async (params?: CourseFilterParams): Promise<Course[]> => {
    const res = await apiClient.get<ApiResponse<Course[]>>("/courses", {
      params,
    });
    return res.data.data || [];
  },

  getById: async (id: string): Promise<Course> => {
    const res = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`);
    return res.data.data;
  },

  create: async (payload: Partial<Course>): Promise<Course> => {
    const res = await apiClient.post<ApiResponse<Course>>("/courses", payload);
    return res.data.data;
  },

  update: async (id: string, payload: Partial<Course>): Promise<Course> => {
    const res = await apiClient.put<ApiResponse<Course>>(`/courses/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },
};
