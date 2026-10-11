import {
  ICreateTeacherStudentPayload,
  ITeacherStudentFilterOptions,
} from "../../types";
import {
  TeacherStudent,
  ITeacherStudent,
} from "../models/teacher-student.model";

class TeacherStudentQueries {
  public create = async (
    payload: ICreateTeacherStudentPayload
  ): Promise<ITeacherStudent> => {
    const record = await TeacherStudent.create(payload);
    return record.populate([
      { path: "teacher", select: "name email role" },
      { path: "student", select: "name email role" },
    ]);
  };

  public findById = async (id: string): Promise<ITeacherStudent | null> => {
    return TeacherStudent.findById(id)
      .populate("teacher", "name email role")
      .populate("student", "name email role")
      .exec();
  };

  public findByTeacherAndStudent = async (
    teacher: string,
    student: string
  ): Promise<ITeacherStudent | null> => {
    return TeacherStudent.findOne({ teacher, student }).exec();
  };

  public findByStudent = async (
    student: string
  ): Promise<ITeacherStudent | null> => {
    return TeacherStudent.findOne({ student }).exec();
  };

  public findByStudentAndTeacher = async (
    student: string,
    teacher: string
  ): Promise<ITeacherStudent | null> => {
    return TeacherStudent.findOne({ student, teacher }).exec();
  };

  public getAll = async (
    options: ITeacherStudentFilterOptions = {}
  ): Promise<ITeacherStudent[]> => {
    const filter: Record<string, any> = {};

    if (options.teacher) {
      filter.teacher = options.teacher;
    }

    if (options.student) {
      filter.student = options.student;
    }

    return TeacherStudent.find(filter)
      .populate("teacher", "name email role")
      .populate("student", "name email role")
      .sort({ createdAt: -1 })
      .lean<ITeacherStudent[]>()
      .exec();
  };

  public delete = async (id: string): Promise<ITeacherStudent | null> => {
    return TeacherStudent.findByIdAndDelete(id).exec();
  };
}

export default TeacherStudentQueries;
