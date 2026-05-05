import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3001'),
  ALLOWED_ORIGINS: z.string().min(1, 'ALLOWED_ORIGINS required'),
});

export type EnvSchema = z.infer<typeof envSchema>;
