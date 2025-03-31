import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  MOCK_API_URL: z.string().default('http://localhost:3001'),
  REDIS_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  WHATSAPP_VERIFY_TOKEN: z.string(),
  WHATSAPP_ACCESS_TOKEN: z.string(),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export const env = validateEnv();
