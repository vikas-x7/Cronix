import 'dotenv/config';
import { envSchema } from './schema.js';

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const message = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`Invalid database environment configuration:\n${message}`);
}

if (parsedEnv.data.DATABASE_POOL_MIN > parsedEnv.data.DATABASE_POOL_MAX) {
  throw new Error('DATABASE_POOL_MIN cannot be greater than DATABASE_POOL_MAX');
}

export const env = parsedEnv.data;
export type DatabaseEnv = typeof env;
