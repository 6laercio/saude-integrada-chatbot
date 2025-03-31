import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '../config/env.js';

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

const runMigrations = async () => {
  const db = drizzle(migrationClient);

  console.log('🔄 Iniciando migração de banco de dados...');

  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migrações aplicadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao aplicar migrações:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
};

runMigrations();
