import Responses from "../../config/responses";
import {
  ICreateEnrollmentPayload,
  IUpdateEnrollmentPayload,
  IResponse,
} from "../../types";
import { IEnrollment } from "../models/enrollment.model";
import EnrollmentQueries, {
  IEnrollmentFilterOptions,
} from "../queries/enrollment.queries";
import { User } from "../models/user.model";
import { Course } from "../models/course.model";

const enrollmentQueries = new EnrollmentQueries();

class EnrollmentService {
  public createEnrollment = async (
    payload: ICreateEnrollmentPayload
  ): Promise<IResponse<IEnrollment | null>> => {
    const student = await User.findById(payload.student);
    if (!student) {
      return Responses.badRequest("Student not found with provided ID");
    }

    const course = await Course.findById(payload.course);
    if (!course) {
      return Responses.badRequest("Course not found with provided ID");
    }

    const existing = await enrollmentQueries.findByStudentAndCourse(
      payload.student,
      payload.course
    );
    if (existing) {
      return Responses.conflict("Student is already enrolled in this course");
    }

    const enrollment = await enrollmentQueries.create(payload);
    return Responses.created(enrollment, "Enrolled successfully");
  };

  public getEnrollments = async (
    options: IEnrollmentFilterOptions = {}
  ): Promise<IResponse<IEnrollment[]>> => {
    const result = await enrollmentQueries.getAll(options);
    return Responses.ok(result);
  };

  public getEnrollmentById = async (
    id: string
  ): Promise<IResponse<IEnrollment | null>> => {
    const enrollment = await enrollmentQueries.findById(id);
    if (!enrollment) {
      return Responses.notFound("Enrollment not found");
    }
    return Responses.ok(enrollment);
  };

  public updateEnrollment = async (
    id: string,
    payload: IUpdateEnrollmentPayload
  ): Promise<IResponse<IEnrollment | null>> => {
    const updateData: IUpdateEnrollmentPayload = { ...payload };

    if (updateData.progress === 100 && !updateData.status) {
      updateData.status = "COMPLETED";
      if (!updateData.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    const updatedEnrollment = await enrollmentQueries.update(id, updateData);
    if (!updatedEnrollment) {
      return Responses.notFound("Enrollment not found");
    }
    return Responses.ok(updatedEnrollment, "Enrollment updated successfully");
  };

  public deleteEnrollment = async (
    id: string
  ): Promise<IResponse<IEnrollment | null>> => {
    const deletedEnrollment = await enrollmentQueries.delete(id);
    if (!deletedEnrollment) {
      return Responses.notFound("Enrollment not found");
    }
    return Responses.ok(deletedEnrollment, "Enrollment deleted successfully");
  };
}

export default EnrollmentService;
