import {
  ICreateEnrollmentPayload,
  IUpdateEnrollmentPayload,
} from "../../types";
import { Enrollment, IEnrollment } from "../models/enrollment.model";

export interface IEnrollmentFilterOptions {
  student?: string;
  course?: string;
  status?: string;
}

class EnrollmentQueries {
  public create = async (
    payload: ICreateEnrollmentPayload,
  ): Promise<IEnrollment> => {
    const enrollment = await Enrollment.create(payload);
    return enrollment.populate([
      { path: "student", select: "name email role" },
      {
        path: "course",
        select: "title price category thumbnail description level language",
      },
    ]);
  };

  public findById = async (id: string): Promise<IEnrollment | null> => {
    return Enrollment.findById(id)
      .populate("student", "name email role")
      .populate(
        "course",
        "title price category thumbnail description level language",
      )
      .exec();
  };

  public findByStudentAndCourse = async (
    student: string,
    course: string,
  ): Promise<IEnrollment | null> => {
    return Enrollment.findOne({ student, course }).exec();
  };

  public findByStudent = async (
    student: string,
  ): Promise<IEnrollment[] | null> => {
    return Enrollment.find({ student }).exec();
  };

  public getAll = async (
    options: IEnrollmentFilterOptions = {},
  ): Promise<IEnrollment[]> => {
    const filter: Record<string, any> = {};

    if (options.student) {
      filter.student = options.student;
    }

    if (options.course) {
      filter.course = options.course;
    }

    if (options.status) {
      filter.status = options.status;
    }

    return Enrollment.find(filter)
      .populate("student", "name email role")
      .populate(
        "course",
        "title price category thumbnail description level language",
      )
      .sort({ createdAt: -1 })
      .lean<IEnrollment[]>()
      .exec();
  };

  public update = async (
    id: string,
    payload: IUpdateEnrollmentPayload,
  ): Promise<IEnrollment | null> => {
    return Enrollment.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .populate("student", "name email role")
      .populate(
        "course",
        "title price category thumbnail description level language",
      )
      .exec();
  };

  public delete = async (id: string): Promise<IEnrollment | null> => {
    return Enrollment.findByIdAndDelete(id).exec();
  };
}

export default EnrollmentQueries;
