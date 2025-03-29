import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { logger } from './logger.js';

// Carrega a URL do banco de dados do .env
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  logger.error('DATABASE_URL não definida no arquivo .env');
  process.exit(1);
}

// Cliente postgres para consultas SQL diretas
const queryClient = postgres(DATABASE_URL);

// Cliente do Drizzle ORM usando o cliente postgres
export const db = drizzle(queryClient);

// Função de utilitário para verificar a conexão com o banco
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Executa uma consulta simples para verificar a conexão
    await queryClient`SELECT 1`;
    logger.info('Conexão com o banco de dados estabelecida com sucesso');
    return true;
  } catch (error) {
    logger.error('Erro ao conectar com o banco de dados', error);
    return false;
  }
}
