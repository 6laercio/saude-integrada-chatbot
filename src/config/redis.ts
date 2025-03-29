import { createClient } from 'redis';
import { logger } from './logger.js';

// Carrega a URL do Redis do .env
const { REDIS_URL } = process.env;

if (!REDIS_URL) {
  logger.error('REDIS_URL não definida no arquivo .env');
  process.exit(1);
}

// Cria o cliente Redis
export const redisClient = createClient({
  url: REDIS_URL,
});

// Eventos de conexão do Redis
redisClient.on('connect', () => {
  logger.info('Conectando ao Redis...');
});

redisClient.on('ready', () => {
  logger.info('Conexão com Redis estabelecida com sucesso');
});

redisClient.on('error', (err) => {
  logger.error('Erro na conexão com Redis', err);
});

// Função para conectar ao Redis
export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

// Função para desconectar do Redis
export async function disconnectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
}
