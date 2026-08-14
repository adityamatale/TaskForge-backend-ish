import {z} from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional()
})

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional()
})

export const taskIdSchema = z.object({
    id: z.coerce.number().int().positive()  // .coerce.number() => converts string to number [from url] | .int().positive() => makes sure its a positive number
})
