import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3001'),
  ALLOWED_ORIGINS: z.string().min(1, 'ALLOWED_ORIGINS required'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, 'REFRESH_TOKEN_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET required'),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default('http://localhost:3001/api/v1/auth/google/callback'),

  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET required'),
  GITHUB_CALLBACK_URL: z
    .string()
    .url()
    .default('http://localhost:3001/api/v1/auth/github/callback'),

  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  UPSTASH_REDIS_HOST: z.string().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),

  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY required'),
  FROM_EMAIL: z.string().default('Cronix <onboarding@resend.dev>'),
});

export type EnvSchema = z.infer<typeof envSchema>;
