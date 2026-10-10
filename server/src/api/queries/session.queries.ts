import { ICreateSessionPayload, IUpdateSessionPayload } from "../../types";
import { Session, ISession } from "../models/session.model";

export interface ISessionFilterOptions {
  search?: string;
  course?: string;
  instructor?: string;
  status?: string;
}

class SessionQueries {
  public create = async (payload: ICreateSessionPayload): Promise<ISession> => {
    const session = await Session.create(payload);
    return session.populate([
      { path: "instructor", select: "name email role" },
    ]);
  };

  public findById = async (id: string): Promise<ISession | null> => {
    return Session.findById(id)
      .populate("instructor", "name email role")
      .exec();
  };

  public getAll = async (
    options: ISessionFilterOptions = {}
  ): Promise<ISession[]> => {
    const filter: Record<string, any> = {};

    if (options.instructor) {
      filter.instructor = options.instructor;
    }

    if (options.status) {
      filter.status = options.status;
    }

    if (options.search) {
      filter.$or = [
        { title: { $regex: options.search, $options: "i" } },
        { description: { $regex: options.search, $options: "i" } },
      ];
    }

    return Session.find(filter)
      .populate("instructor", "name email role")
      .sort({ startTime: 1 })
      .lean<ISession[]>()
      .exec();
  };

  public update = async (
    id: string,
    payload: IUpdateSessionPayload
  ): Promise<ISession | null> => {
    return Session.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .populate("instructor", "name email role")
      .exec();
  };

  public delete = async (id: string): Promise<ISession | null> => {
    return Session.findByIdAndDelete(id).exec();
  };
}

export default SessionQueries;
