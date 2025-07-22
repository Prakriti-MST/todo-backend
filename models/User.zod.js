// schemas/user.schema.js
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string({ required_error: "Name is required" }).trim(),
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }),
});
