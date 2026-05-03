import { z } from "zod";

const contactFormTypeSchema = z.enum(["general_inquiry", "get_quote"]);

const optionalText = z
  .union([z.string().trim().min(1).max(500), z.literal("")])
  .optional()
  .transform((value) => {
    if (value === undefined || value === "") return undefined;
    return value;
  });

export const contactSchema = z
  .object({
    formType: contactFormTypeSchema.optional(),
    tab: z.enum(["inquiry", "quote"]).optional(),

    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be under 100 characters"),

    company: optionalText,
    email: z.string().trim().email("Invalid email address"),
    phone: optionalText,
    country: optionalText,
    port: optionalText,

    productTypes: z.array(z.string().trim().min(1)).default([]),
    customSpec: optionalText,

    thickness: optionalText,
    width: optionalText,
    length: optionalText,
    quantity: optionalText,
    delivery: optionalText,
    incoterm: optionalText,

    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be under 1000 characters"),
  })
  .transform(({ tab, formType, ...data }) => ({
    ...data,
    formType: formType ?? (tab === "quote" ? "get_quote" : "general_inquiry"),
  }));

export type ContactFormInput = z.infer<typeof contactSchema>;
