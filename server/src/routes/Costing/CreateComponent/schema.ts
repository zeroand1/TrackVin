import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f0-9]{24}$/, {
    message: "Invalid MongoDB ObjectId format"
});

const processSchema = z.object({
    cost: z.number().nonnegative("Cost must be 0 or greater"),
    batchSize: z.number().positive("Batch size must be greater than 0")
});

// Define at the top-level so it stays in memory and the adapter can be cached
export const schema = z.object({
    code: z.string().trim().min(1,'Code is a required field'),
    name: z.string().trim().min(1,'Name is a required field'),
    qty: z.number().gte(1, "Quantity should be greater than 0").default(1),
    material: objectIdSchema,
    description: z.string().optional(),
    procurement: z.enum([ 'manufactured', 'bought']),
    processes: z.record(objectIdSchema, processSchema),
    cost: z.number().positive().optional(),
});

