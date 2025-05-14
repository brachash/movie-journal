// src/config.ts
import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env variables into process.env
dotenv.config();

// Define schema for required env vars
const envSchema = z.object({
  PORT: z.string().optional().default('5000'),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string(),
  TMDB_API_KEY: z.string(),
});

// Validate
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

// Export typed, parsed config
export const config = {
  port: Number(parsed.data.PORT),
  mongoUri: parsed.data.MONGO_URI,
  jwtSecret: parsed.data.JWT_SECRET,
  tmdbApiKey: parsed.data.TMDB_API_KEY,
};