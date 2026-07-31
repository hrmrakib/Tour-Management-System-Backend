import { z } from "zod";

export const createDivisionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

export const updateDivisionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
