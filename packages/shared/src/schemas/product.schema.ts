import { z } from "zod";

const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be under 200 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be under 2000 characters"),

  imageUrl: z.string().trim().url().nullable().optional(),
  imagePath: z.string().trim().min(1).max(500).nullable().optional(),

  sortOrder: z.coerce.number().int().min(0).optional(),
  isFeatured: z.coerce.boolean().optional(),
});

export const createProductSchema = productBaseSchema;
export const updateProductSchema = productBaseSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
