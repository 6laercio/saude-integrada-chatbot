import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env.js';

export const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient);
