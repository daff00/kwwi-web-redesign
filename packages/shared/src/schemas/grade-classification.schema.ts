import { z } from "zod";

export const gradeClassificationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  type: z.enum(["one-sided", "two-sided"]),
  face: z.array(z.string().trim().min(1)).default([]),
  back: z.array(z.string().trim().min(1)).default([]),
  not_allowed: z.string().trim().min(1),
  image: z.string().trim().min(1),
  sort_order: z.coerce.number().int().min(0),
});

export const gradeClassificationsSchema = z.array(gradeClassificationSchema);

export type GradeClassificationRow = z.infer<typeof gradeClassificationSchema>;