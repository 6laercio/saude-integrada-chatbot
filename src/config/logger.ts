import pino from 'pino';
import type { Logger } from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuração do logger com importação ESM
// Usando uma asserção de tipo para resolver o problema de call signature
export const logger = (pino as unknown as (options?: pino.LoggerOptions) => Logger)({
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

// Para casos onde precisamos de um logger associado a um contexto específico
export function createContextLogger(context: string): Logger {
  return logger.child({ context });
}
