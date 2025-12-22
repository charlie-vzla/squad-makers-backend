import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  ELASTICSEARCH_URL: z.string().url().default('http://localhost:9200'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'debug'])
    .default('info'),
  CHUCK_NORRIS_API_URL: z.string().url().default('https://api.chucknorris.io'),
  DAD_JOKE_API_URL: z.string().url().default('https://icanhazdadjoke.com'),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

export const env = validateEnv();
