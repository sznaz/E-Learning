import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z
  .string()
  .regex(objectIdRegex, "Invalid ObjectId format");

export const createSessionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: z.string().optional(),
  instructor: objectIdSchema.optional(),
  course: objectIdSchema.optional(),
  attendees: z.array(objectIdSchema).optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  meetingLink: z.string().min(1, "Meeting link is required"),
  status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export const updateSessionSchema = createSessionSchema.partial();

export type CreateSessionDto = z.infer<typeof createSessionSchema>;
export type UpdateSessionDto = z.infer<typeof updateSessionSchema>;
