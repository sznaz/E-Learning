import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z
  .string()
  .regex(objectIdRegex, "Invalid ObjectId format");

export const createTeacherStudentSchema = z.object({
  teacher: objectIdSchema,
  student: objectIdSchema,
});

export type CreateTeacherStudentDto = z.infer<typeof createTeacherStudentSchema>;
