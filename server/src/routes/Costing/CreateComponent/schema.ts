import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f0-9]{24}$/, {
    message: "Invalid MongoDB ObjectId format"
});

// Define at the top-level so it stays in memory and the adapter can be cached
export const schema = z.object({
    code: z.string().trim().min(1,'Code is a required field'),
    name: z.string().trim().min(1,'Name is a required field'),
    qty: z.number().gte(1, "Quantity should be greater than 0").default(1),
    material: objectIdSchema,
    description: z.string().optional(),
    procurement: z.enum([ 'bought', 'manufactured' ]),
    processes: z.array(objectIdSchema),
    cost: z.number().positive().optional(),
    
}).superRefine((data, ctx) => {
    if (data.procurement === "manufactured" && data.processes.length === 0) {
        ctx.addIssue({
            path: ["processes"],
            message: "Processes must have at least one item when procurement is 'manufactured'",
            code: "custom"
        });
    }

    else if (data.procurement === "bought" && (data.cost === undefined || data.cost <= 0)) {
        ctx.addIssue({
            path: ["cost"],
            message: "Cost must be greater than 0 when procurement is 'bought'",
            code: "custom"
        });
    }
});

