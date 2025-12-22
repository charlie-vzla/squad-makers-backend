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

export type CreateJokeInput = z.infer<typeof createJokeSchema>;
export type JokeSourceParams = z.infer<typeof jokeSourceSchema>;
