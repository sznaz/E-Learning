import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z
  .string()
  .regex(objectIdRegex, "Invalid ObjectId format");

export const createEnrollmentSchema = z.object({
  student: objectIdSchema.optional(),
  course: objectIdSchema,
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const updateEnrollmentSchema = z.object({
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  completedAt: z
    .string()
    .datetime()
    .or(z.coerce.date())
    .nullable()
    .optional(),
});

export type CreateEnrollmentDto = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentDto = z.infer<typeof updateEnrollmentSchema>;
