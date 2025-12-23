import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z.string().optional().transform((val) => (val ? Number.parseInt(val, 10) : 10)),
});
