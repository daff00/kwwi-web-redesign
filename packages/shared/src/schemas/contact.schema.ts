import { z } from "zod";

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be under 100 characters"),
    email: z
        .string()
        .email('Invalid email address'),
    message: z
        .string()
        .min(10, "Message must be atleast 10 characters")
        .max(1000, 'Message must be under 1000 characters'),
});

export type ContactFormInput = z.infer<typeof contactSchema>;