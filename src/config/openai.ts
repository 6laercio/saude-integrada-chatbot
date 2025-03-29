import OpenAI from 'openai';
import { logger } from './logger.js';

// Carrega a chave da API da OpenAI do .env
const { OPENAI_API_KEY } = process.env;

if (!OPENAI_API_KEY) {
  logger.error('OPENAI_API_KEY não definida no arquivo .env');
  process.exit(1);
}

// Configuração da OpenAI para a versão 4.90.0
export const openaiConfig = {
  apiKey: OPENAI_API_KEY,
  models: {
    completion: 'gpt-4-turbo-preview', // Para a maioria das interações
    embedding: 'text-embedding-ada-002', // Para embeddings
    whisper: 'whisper-1', // Para transcrição de áudio
  },
  // Configuração padrão para a API
  defaultOptions: {
    temperature: 0.7,
    max_tokens: 500,
  },
};

// Função para criar uma instância do cliente OpenAI
export function createOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: openaiConfig.apiKey,
  });
}
