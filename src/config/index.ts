// Arquivo central que exporta todas as configurações

export * from './database.js';
export * from './redis.js';
export * from './logger.js';
export * from './whatsapp.js';
export * from './openai.js';

// Configurações globais da aplicação
export const appConfig = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  corsOrigins: process.env.CORS_ORIGINS || '*',
  sessionTTL: parseInt(process.env.SESSION_TTL || '3600', 10), // TTL da sessão em segundos
};

// Utilitário para verificar todas as configurações
export async function validateAllConfigs(): Promise<boolean> {
  const { logger } = await import('./logger.js');
  const { validateWhatsAppConfig } = await import('./whatsapp.js');
  const { checkDatabaseConnection } = await import('./database.js');

  // Verifica as configurações do WhatsApp
  const isWhatsAppConfigValid = validateWhatsAppConfig();
  if (!isWhatsAppConfigValid) {
    logger.warn('Configuração do WhatsApp inválida ou incompleta');
  }

  // Verifica a conexão com o banco de dados
  const isDatabaseConnected = await checkDatabaseConnection();
  if (!isDatabaseConnected) {
    logger.warn('Não foi possível conectar ao banco de dados');
  }

  return isWhatsAppConfigValid && isDatabaseConnected;
}
