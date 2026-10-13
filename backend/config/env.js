import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().optional(),
  })
  .transform((data) => {
    if (!data.CORS_ORIGIN && data.NODE_ENV === 'development') {
      data.CORS_ORIGIN = 'http://localhost:3000';
    }
    return data;
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(' Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
