import { logger } from './logger.js';

// Carrega as variáveis de ambiente do WhatsApp
const { WHATSAPP_TOKEN } = process.env;
const { WHATSAPP_PHONE_NUMBER_ID } = process.env;
const { WHATSAPP_VERIFY_TOKEN } = process.env;

// Verifica se as variáveis necessárias estão definidas
if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_VERIFY_TOKEN) {
  logger.error(
    'Variáveis de ambiente do WhatsApp não definidas. Verifique WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID e WHATSAPP_VERIFY_TOKEN no arquivo .env'
  );
  process.exit(1);
}

// URL base da API do WhatsApp (Meta Cloud API)
const API_VERSION = 'v17.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

// Configuração exportada
export const whatsappConfig = {
  token: WHATSAPP_TOKEN,
  phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
  verifyToken: WHATSAPP_VERIFY_TOKEN,
  apiUrl: `${BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
  version: API_VERSION,
};

// Função para verificar se a configuração é válida
export function validateWhatsAppConfig(): boolean {
  if (!WHATSAPP_TOKEN || WHATSAPP_TOKEN === 'your_whatsapp_token') {
    logger.warn('WhatsApp token não configurado ou com valor padrão');
    return false;
  }

  if (!WHATSAPP_PHONE_NUMBER_ID || WHATSAPP_PHONE_NUMBER_ID === 'your_phone_number_id') {
    logger.warn('WhatsApp phone number ID não configurado ou com valor padrão');
    return false;
  }

  return true;
}
