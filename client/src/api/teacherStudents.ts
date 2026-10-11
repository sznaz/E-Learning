import apiClient from "./client";
import { ApiResponse } from "./courses";
import { User } from "./auth";

export interface TeacherStudent {
  _id: string;
  teacher:
    | User
    | { _id: string; name: string; email: string; role?: string }
    | string;
  student:
    | User
    | { _id: string; name: string; email: string; role?: string }
    | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeacherStudentPayload {
  teacher: string;
  student: string;
}

export interface TeacherStudentFilterParams {
  teacher?: string;
  student?: string;
}

export const teacherStudentsApi = {
  getAll: async (
    params?: TeacherStudentFilterParams
  ): Promise<TeacherStudent[]> => {
    const res = await apiClient.get<ApiResponse<TeacherStudent[]>>(
      "/teacher-students",
      {
        params,
      }
    );
    return res.data.data || [];
  },

  create: async (
    payload: CreateTeacherStudentPayload
  ): Promise<TeacherStudent> => {
    const res = await apiClient.post<ApiResponse<TeacherStudent>>(
      "/teacher-students",
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teacher-students/${id}`);
  },
};

export default teacherStudentsApi;
