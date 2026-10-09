import Responses from "../../config/responses";
import {
  ICreateSessionPayload,
  IUpdateSessionPayload,
  IResponse,
} from "../../types";
import { ISession } from "../models/session.model";
import SessionQueries, { ISessionFilterOptions } from "../queries/session.queries";
import { User } from "../models/user.model";
import { Course } from "../models/course.model";

const sessionQueries = new SessionQueries();

class SessionService {
  public createSession = async (
    payload: ICreateSessionPayload
  ): Promise<IResponse<ISession | null>> => {
    const instructorExists = await User.findById(payload.instructor);
    if (!instructorExists) {
      return Responses.badRequest("Instructor not found with provided ID");
    }

    if (payload.course) {
      const courseExists = await Course.findById(payload.course);
      if (!courseExists) {
        return Responses.badRequest("Course not found with provided ID");
      }
    }

    const session = await sessionQueries.create(payload);
    return Responses.created(session, "Session created successfully");
  };

  public getSessions = async (
    options: ISessionFilterOptions = {}
  ): Promise<IResponse<ISession[]>> => {
    const result = await sessionQueries.getAll(options);
    return Responses.ok(result);
  };

  public getSessionById = async (
    id: string
  ): Promise<IResponse<ISession | null>> => {
    const session = await sessionQueries.findById(id);
    if (!session) {
      return Responses.notFound("Session not found");
    }
    return Responses.ok(session);
  };

  public updateSession = async (
    id: string,
    payload: IUpdateSessionPayload
  ): Promise<IResponse<ISession | null>> => {
    if (payload.instructor) {
      const instructorExists = await User.findById(payload.instructor);
      if (!instructorExists) {
        return Responses.badRequest("Instructor not found with provided ID");
      }
    }

    if (payload.course) {
      const courseExists = await Course.findById(payload.course);
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
    id: string
  ): Promise<IResponse<ISession | null>> => {
    const deletedSession = await sessionQueries.delete(id);
    if (!deletedSession) {
      return Responses.notFound("Session not found");
    }
    return Responses.ok(deletedSession, "Session deleted successfully");
  };
}

export default SessionService;
