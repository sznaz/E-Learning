import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),
  language: z.string().optional(),
  level: z
    .enum(["Beginner", "Intermediate", "Advanced", "All Levels"])
    .optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseDto = z.infer<typeof createCourseSchema>;
export type UpdateCourseDto = z.infer<typeof updateCourseSchema>;
