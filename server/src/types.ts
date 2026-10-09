import { UserRole } from "./api/models/user.model";
import { SessionStatus } from "./api/models/session.model";
import { EnrollmentStatus } from "./api/models/enrollment.model";

export interface IResponse<T = unknown> {
  error: boolean;
  statusCode: number;
  data?: T;
  message: string;
}

export interface IAuthUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

// User Payloads
export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IUpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

// Course Payloads
export interface ICreateCoursePayload {
  title: string;
  description: string;
  language?: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price?: number;
  category?: string;
  thumbnail?: string;
  isPublished?: boolean;
}

export interface IUpdateCoursePayload {
  title?: string;
  description?: string;
  language?: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price?: number;
  category?: string;
  thumbnail?: string;
  isPublished?: boolean;
}

// Session Payloads
export interface ICreateSessionPayload {
  title: string;
  description?: string;
  course?: string;
  instructor: string;
  startTime: Date | string;
  endTime: Date | string;
  meetingLink: string;
  status?: SessionStatus;
  attendees?: string[];
  maxAttendees?: number;
}

export interface IUpdateSessionPayload {
  title?: string;
  description?: string;
  course?: string;
  instructor?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  meetingLink?: string;
  status?: SessionStatus;
  attendees?: string[];
  maxAttendees?: number;
}

// Enrollment Payloads
export interface ICreateEnrollmentPayload {
  student: string;
  course: string;
  status?: EnrollmentStatus;
  progress?: number;
}

export interface IUpdateEnrollmentPayload {
  status?: EnrollmentStatus;
  progress?: number;
  completedAt?: Date | string | null;
}
