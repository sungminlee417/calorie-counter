import z from "zod/v4";

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  first_name: z.string(),
  last_name: z.string(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
