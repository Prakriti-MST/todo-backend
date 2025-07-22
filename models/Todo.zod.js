import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),

  description: z.string().max(500, "Description is too long").optional(),

  status: z.enum(["completed", "pending"]).default("pending"),

  priority: z.enum(["high", "mid", "low"]).default("mid"),

  owner: z.string({
    required_error: "Owner ID is required",
  }), // should be a valid ObjectId format
});
