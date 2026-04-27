import { z } from "zod";

export const createProductSchema = z.object({
    name: z
        .string()
        .min(2, 'Product name must be at least 2 characters')
        .max(200, 'Product name must be under 200 characters'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must be under 200 characters'),
});

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;