import apiClient from "./client";
import { ApiResponse } from "./courses";
import { User } from "./auth";

export type SessionStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";

export interface SessionCourse {
  _id: string;
  title: string;
  price?: number;
  category?: string;
  thumbnail?: string;
}

export interface SessionAttendee {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Session {
  _id: string;
  title: string;
  description?: string;
  course?: SessionCourse | string;
  instructor: User | { _id: string; name: string; email: string; role: string } | string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  status: SessionStatus;
  attendees?: (SessionAttendee | string)[];
  maxAttendees?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionFilterParams {
  search?: string;
  course?: string;
  instructor?: string;
  status?: SessionStatus | string;
}

export interface CreateSessionPayload {
  title: string;
  description?: string;
  course?: string;
  instructor?: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  status?: SessionStatus;
  attendees?: string[];
  maxAttendees?: number;
}

export interface UpdateSessionPayload {
  title?: string;
  description?: string;
  course?: string;
  instructor?: string;
  startTime?: string;
  endTime?: string;
  meetingLink?: string;
  status?: SessionStatus;
  attendees?: string[];
  maxAttendees?: number;
}

export const sessionsApi = {
  getAll: async (params?: SessionFilterParams): Promise<Session[]> => {
    const res = await apiClient.get<ApiResponse<Session[]>>("/sessions", {
      params,
    });
    return res.data.data || [];
  },

  getById: async (id: string): Promise<Session> => {
    const res = await apiClient.get<ApiResponse<Session>>(`/sessions/${id}`);
    return res.data.data;
  },

  getByInstructor: async (): Promise<Session[]> => {
    const res = await apiClient.get<ApiResponse<Session[]>>(`/sessions/instructor`);
    return res.data.data;
  },

  getByMyCourses: async (): Promise<Session[]> => {
    const res = await apiClient.get<ApiResponse<Session[]>>(`/sessions/my-courses`);
    return res.data.data;
  },

  create: async (payload: CreateSessionPayload): Promise<Session> => {
    const res = await apiClient.post<ApiResponse<Session>>("/sessions", payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateSessionPayload): Promise<Session> => {
    const res = await apiClient.put<ApiResponse<Session>>(`/sessions/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sessions/${id}`);
  },
};

export default sessionsApi;
