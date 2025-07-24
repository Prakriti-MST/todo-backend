import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTodoSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title must be at most 100 characters." }),

  description: z
    .string()
    .trim()
    .max(500, { message: "Description must be at most 500 characters." })
    .optional(),

  status: z
    .enum(["completed", "pending"])
    .default("pending"),

  priority: z
    .enum(["high", "mid", "low"])
    .default("mid"),

  owner: z
    .string({ required_error: "Owner ID is required" })
    .regex(objectIdRegex, { message: "Owner must be a valid ObjectId." }),
});
