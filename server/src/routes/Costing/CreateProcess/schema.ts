import { z } from 'zod';

// Define at the top-level so it stays in memory and the adapter can be cached
export const schema = z.object({
    name: z.string()
    .min(1, "Name cannot be empty") // Ensure it's not empty
    .refine((val) => /\D/.test(val), {
      message: "Field cannot be only numbers"
    }),
    type: z.string()
});