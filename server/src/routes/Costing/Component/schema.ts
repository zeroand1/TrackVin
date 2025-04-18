import { object, z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f0-9]{24}$/, {
    message: "Valid process not selected"
});

export const processSchema = z.object({
    cost: z.number().nonnegative("Cost must be 0 or greater"),
    batchSize: z.number().positive("Batch size must be greater than 0")
});

// Define at the top-level so it stays in memory and the adapter can be cached
export const schema = z.object({
    _id: z.string().optional(),
    code: z.string().trim().min(1,'Code is a required field'),
    name: z.string().trim().min(1,'Name is a required field'),
    image: z.any().optional(),
    qty: z.number().gte(1, "Quantity should be greater than 0").default(1),
    material: z.string().optional(),
    materialSupplied : z.boolean(),
    yield: z.number().gt(0,"Yield should be greater than 0").default(1),
    materialPerYield: z.number().gt(0,"Yield should be greater than 0").default(1),
    description: z.string().optional().nullable(),
    procurement: z.enum([ 'manufactured', 'bought']),
    processes: z.record(objectIdSchema, processSchema), 
    cost: z.number().gte(1, "Cost should be greater than 0").optional().nullable().default(null).transform(value => value ?? 0),
}).superRefine((data, ctx) => {
    console.log(data.procurement)
    if (data.procurement === "manufactured") {
        console.log("Reached here")
        if (!data.material?.match(/^[a-f0-9]{24}$/)) {
            ctx.addIssue({
                path: ["material"],
                message: "Valid material not selected",  
                code: "custom"
            });
        }
        Object.keys(data.processes).forEach((key) => {
            console.log(data.processes[key])
            console.log(data.processes[key].cost)
            if (data.processes[key].cost === undefined || data.processes[key].cost < 0) {
                console.log("Reached")
                ctx.addIssue({
                    path: ["processes"],
                    message: "Cost cannot be less than 0",
                    code: "custom"
                })
            }
            if (data.processes[key].batchSize === undefined || data.processes[key].batchSize <= 0) {
                ctx.addIssue({
                    path: ["processes"],
                    message: "Batch size must be greater than 0",
                    code: "custom"
                });
            }
        })
}
    else if (data.procurement === "bought" && (data.cost === undefined || data.cost <= 0)) {
        ctx.addIssue({
            path: ["cost"],
            message: "Cost must be greater than 0 when item is bought",
            code: "custom"
        });
    }
});

