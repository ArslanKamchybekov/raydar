import z from "zod";

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  image_url: z.string().url("Must be a valid URL").optional(),
  location: z.string(),
  weather: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  user_id: z.string(),
  category: z.string(),
  is_available: z.boolean().default(true),
});

export type Item = z.infer<typeof itemSchema>;
