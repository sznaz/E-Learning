import { ICreateCoursePayload, IUpdateCoursePayload } from "../../types";
import { Course, ICourse } from "../models/course.model";

export interface ICourseFilterOptions {
  search?: string;
  level?: string;
  language?: string;
}

class CourseQueries {
  public create = async (payload: ICreateCoursePayload): Promise<ICourse> => {
    return Course.create(payload);
  };

  public findById = async (id: string): Promise<ICourse | null> => {
    return Course.findById(id).exec();
  };

  public getAll = async (
    options: ICourseFilterOptions = {}
  ): Promise<ICourse[]> => {
    const filter: Record<string, any> = {};

    if (options.level) {
      filter.level = options.level;
    }

    if (options.language) {
      filter.language = options.language;
    }

    if (options.search) {
      filter.$or = [
        { title: { $regex: options.search, $options: "i" } },
        { description: { $regex: options.search, $options: "i" } },
      ];
    }

    return Course.find(filter)
      .sort({ createdAt: -1 })
      .lean<ICourse[]>()
      .exec();
  };

  public update = async (
    id: string,
    payload: IUpdateCoursePayload
  ): Promise<ICourse | null> => {
    return Course.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).exec();
  };

  public delete = async (id: string): Promise<ICourse | null> => {
    return Course.findByIdAndDelete(id).exec();
  };
}

export default CourseQueries;
