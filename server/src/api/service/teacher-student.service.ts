import Responses from "../../config/responses";
import {
  ICreateTeacherStudentPayload,
  ITeacherStudentFilterOptions,
  IResponse,
} from "../../types";
import { ITeacherStudent } from "../models/teacher-student.model";
import TeacherStudentQueries from "../queries/teacher-student.queries";

const teacherStudentQueries = new TeacherStudentQueries();

class TeacherStudentService {
  public createTeacherStudent = async (
    payload: ICreateTeacherStudentPayload
  ): Promise<IResponse<ITeacherStudent | null>> => {
    const existing = await teacherStudentQueries.findByStudent(payload.student);
    if (existing) {
      const existingTeacherId = (
        (existing.teacher as any)?._id || existing.teacher
      ).toString();
      if (existingTeacherId === payload.teacher) {
        return Responses.conflict("This student is already assigned with a teacher");
      }
    }

    const created = await teacherStudentQueries.create(payload);
    return Responses.created(created, "Teacher assigned to student successfully");
  };

  public getTeacherStudents = async (
    options: ITeacherStudentFilterOptions = {}
  ): Promise<IResponse<ITeacherStudent[]>> => {
    const result = await teacherStudentQueries.getAll(options);
    return Responses.ok(result);
  };

  public getTeacherStudentById = async (
    id: string
  ): Promise<IResponse<ITeacherStudent | null>> => {
    const record = await teacherStudentQueries.findById(id);
    if (!record) {
      return Responses.notFound("Assignment not found");
    }
    return Responses.ok(record);
  };

  public deleteTeacherStudent = async (
    id: string
  ): Promise<IResponse<ITeacherStudent | null>> => {
    const deleted = await teacherStudentQueries.delete(id);
    if (!deleted) {
      return Responses.notFound("Assignment not found");
    }
    return Responses.ok(deleted, "Assignment removed successfully");
  };
}

export default TeacherStudentService;
