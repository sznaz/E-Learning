import apiClient from "./client";
import { ApiResponse, Course } from "./courses";
import { User } from "./auth";

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Enrollment {
  _id: string;
  student:
    | User
    | { _id: string; name: string; email: string; role?: string }
    | string;
  course:
    | Course
    | {
        _id: string;
        title: string;
        price?: number;
        category?: string;
        thumbnail?: string;
        description?: string;
        level?: string;
        language?: string;
      };
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEnrollmentPayload {
  course: string;
  student?: string;
  status?: EnrollmentStatus;
  progress?: number;
}

export interface UpdateEnrollmentPayload {
  status?: EnrollmentStatus;
  progress?: number;
  completedAt?: string | null;
}

export interface EnrollmentFilterParams {
  student?: string;
  course?: string;
  status?: string;
}

export const enrollmentsApi = {
  getAll: async (params?: EnrollmentFilterParams): Promise<Enrollment[]> => {
    const res = await apiClient.get<ApiResponse<Enrollment[]>>("/enrollments", {
      params,
    });
    return res.data.data || [];
  },

  getById: async (id: string): Promise<Enrollment> => {
    const res = await apiClient.get<ApiResponse<Enrollment>>(`/enrollments/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateEnrollmentPayload): Promise<Enrollment> => {
    const res = await apiClient.post<ApiResponse<Enrollment>>("/enrollments", payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateEnrollmentPayload): Promise<Enrollment> => {
    const res = await apiClient.put<ApiResponse<Enrollment>>(`/enrollments/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/enrollments/${id}`);
  },
};

export default enrollmentsApi;
