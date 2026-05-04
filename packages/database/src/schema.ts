import { z } from 'zod';

const numberFromEnv = (defaultValue: number) =>
  z.coerce.number().int().positive().default(defaultValue);

export const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .trim()
    .min(1, 'DATABASE_URL is required')
    .url('DATABASE_URL must be a valid PostgreSQL connection URL')
    .refine(
      (value) =>
        value.startsWith('postgresql://') || value.startsWith('postgres://'),
      'DATABASE_URL must use the postgres:// or postgresql:// protocol',
    ),
  DATABASE_POOL_MIN: z.coerce.number().int().min(0).default(0),
  DATABASE_POOL_MAX: numberFromEnv(10),
  DATABASE_IDLE_TIMEOUT_MS: numberFromEnv(30_000),
  DATABASE_CONNECTION_TIMEOUT_MS: numberFromEnv(10_000),
  DATABASE_STATEMENT_TIMEOUT_MS: numberFromEnv(30_000),
  DATABASE_QUERY_TIMEOUT_MS: numberFromEnv(30_000),
  DATABASE_TRANSACTION_MAX_WAIT_MS: numberFromEnv(5_000),
  DATABASE_TRANSACTION_TIMEOUT_MS: numberFromEnv(10_000),
  DATABASE_LOG_QUERIES: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});
