import { z } from 'zod';

export const createJokeSchema = z.object({
  text: z.string().min(1, 'Text is required').trim(),
  userName: z.string().optional(),
  topicName: z.string().optional(),
});

export const jokeSourceSchema = z.object({
  source: z.enum(['Chuck', 'Dad'], {
    errorMap: () => ({ message: 'Invalid source. Allowed values: Chuck, Dad' }),
  }),
});

export const jokeNumberSchema = z.object({
  number: z.string().regex(/^\d+$/, 'Number must be a valid positive integer').transform(Number),
});

export const getJokesQuerySchema = z.object({
  userName: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    }),
  topicName: z
    .string()
    .optional()
    .transform((val) => (val ? val.toLowerCase() : undefined)),
});

export type CreateJokeInput = z.infer<typeof createJokeSchema>;
export type JokeSourceParams = z.infer<typeof jokeSourceSchema>;
export type JokeNumberParams = z.infer<typeof jokeNumberSchema>;
export type GetJokesQuery = z.infer<typeof getJokesQuerySchema>;
