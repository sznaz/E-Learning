import Responses from "../../config/responses";
import {
  ICreateSessionPayload,
  IUpdateSessionPayload,
  IResponse,
} from "../../types";
import { ISession } from "../models/session.model";
import SessionQueries, {
  ISessionFilterOptions,
} from "../queries/session.queries";
import UserQueries from "../queries/user.queries";
import CourseQueries from "../queries/course.queries";
import EnrollmentQueries from "../queries/enrollment.queries";
import { IEnrollment } from "../models/enrollment.model";

const sessionQueries = new SessionQueries();
const enrollmentQueries = new EnrollmentQueries();
const userQueries = new UserQueries();
const courseQueries = new CourseQueries();

class SessionService {
  public createSession = async (
    payload: ICreateSessionPayload,
  ): Promise<IResponse<ISession | null>> => {
    const instructorExists = await userQueries.findById(payload.instructor);
    if (!instructorExists) {
      return Responses.badRequest("Instructor not found with provided ID");
    }

    if (payload.course) {
      const courseExists = await courseQueries.findById(payload.course);
      if (!courseExists) {
        return Responses.badRequest("Course not found with provided ID");
      }
    }

    const session = await sessionQueries.create(payload);
    return Responses.created(session, "Session created successfully");
  };

  public getSessions = async (
    options: ISessionFilterOptions = {},
  ): Promise<IResponse<ISession[]>> => {
    const result = await sessionQueries.getAll(options);
    return Responses.ok(result);
  };

  public getSessionsByCourse = async (
    userId: string,
  ): Promise<IResponse<ISession[] | null>> => {
    const enrollments: IEnrollment[] | null =
      await enrollmentQueries.findByStudent(userId);
    if (!enrollments) {
      return Responses.notFound("No enrollments found for this student");
    }
    const courseIds = enrollments.map((e) => e.course);
    const result = await sessionQueries.getAllByCourse(courseIds);
    return Responses.ok(result);
  };

  public getSessionById = async (
    id: string,
  ): Promise<IResponse<ISession | null>> => {
    const session = await sessionQueries.findById(id);
    if (!session) {
      return Responses.notFound("Session not found");
    }
    return Responses.ok(session);
  };

  public updateSession = async (
    id: string,
    payload: IUpdateSessionPayload,
  ): Promise<IResponse<ISession | null>> => {
    if (payload.instructor) {
      const instructorExists = await userQueries.findById(payload.instructor);
      if (!instructorExists) {
        return Responses.badRequest("Instructor not found with provided ID");
      }
    }

    if (payload.course) {
      const courseExists = await courseQueries.findById(payload.course);
      if (!courseExists) {
        return Responses.badRequest("Course not found with provided ID");
      }
    }

    const updatedSession = await sessionQueries.update(id, payload);
    if (!updatedSession) {
      return Responses.notFound("Session not found");
    }
    return Responses.ok(updatedSession, "Session updated successfully");
  };

  public deleteSession = async (
    id: string,
  ): Promise<IResponse<ISession | null>> => {
    const deletedSession = await sessionQueries.delete(id);
    if (!deletedSession) {
      return Responses.notFound("Session not found");
    }
    return Responses.ok(deletedSession, "Session deleted successfully");
  };
}

export default SessionService;
