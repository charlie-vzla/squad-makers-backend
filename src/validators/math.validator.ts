import { z } from 'zod';

export const lcmQuerySchema = z.object({
  numbers: z
    .string()
    .regex(/^\d+(,\s*\d+)*$/, 'Numbers must be comma-separated positive integers')
    .transform((str) => str.split(',').map((num) => Number.parseInt(num.trim(), 10))),
});

export const incrementQuerySchema = z.object({
  number: z
    .string()
    .regex(/^-?\d+$/, 'Number must be a valid integer')
    .transform((val) => Number.parseInt(val, 10)),
});

export type LCMQuery = z.infer<typeof lcmQuerySchema>;
export type IncrementQuery = z.infer<typeof incrementQuerySchema>;
