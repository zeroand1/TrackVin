import { z } from 'zod';

// Define at the top-level so it stays in memory and the adapter can be cached
export const schema = z.object({
	code: z.string().trim().min(1,'Code is a required field'),
	name: z.string().trim().min(1,'Name is a required field'),
    cost: z.number().gte(1, "Cost should be greater than 0").default(NaN),
});