import Responses from "../../config/responses";
import {
  ICreateCoursePayload,
  IUpdateCoursePayload,
  IResponse,
} from "../../types";
import { ICourse } from "../models/course.model";
import CourseQueries, { ICourseFilterOptions } from "../queries/course.queries";

const courseQueries = new CourseQueries();

class CourseService {
  public createCourse = async (
    payload: ICreateCoursePayload
  ): Promise<IResponse<ICourse>> => {
    const course = await courseQueries.create(payload);
    return Responses.created(course, "Course created successfully");
  };

  public getCourses = async (
    options: ICourseFilterOptions = {}
  ): Promise<IResponse<ICourse[]>> => {
    const result = await courseQueries.getAll(options);
    return Responses.ok(result);
  };

  public getCourseById = async (
    id: string
  ): Promise<IResponse<ICourse | null>> => {
    const course = await courseQueries.findById(id);
    if (!course) {
      return Responses.notFound("Course not found");
    }
    return Responses.ok(course);
  };

  public updateCourse = async (
    id: string,
    payload: IUpdateCoursePayload
  ): Promise<IResponse<ICourse | null>> => {
    const updatedCourse = await courseQueries.update(id, payload);
    if (!updatedCourse) {
      return Responses.notFound("Course not found");
    }
    return Responses.ok(updatedCourse, "Course updated successfully");
  };

  public deleteCourse = async (
    id: string
  ): Promise<IResponse<ICourse | null>> => {
    const deletedCourse = await courseQueries.delete(id);
    if (!deletedCourse) {
      return Responses.notFound("Course not found");
    }
    return Responses.ok(deletedCourse, "Course deleted successfully");
  };
}

export default CourseService;
