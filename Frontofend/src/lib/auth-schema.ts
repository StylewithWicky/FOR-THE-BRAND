import { z } from "zod";

/**
 * Base Auth Schema
 * Used for Login and as the foundation for Registration
 */
export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Full Registration Schema
 * Extends the base schema with username and confirmation logic
 */
export const registerSchema = authSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types for your forms
export type AuthValues = z.infer<typeof authSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;