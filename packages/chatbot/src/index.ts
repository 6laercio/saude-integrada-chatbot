import fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env.js';
// import { initReminderWorker } from './services/queue.js';

async function bootstrap() {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  // plugins
  await app.register(cors);

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  // inicializa worker, descomentar na implementação dos lembretes
  // const reminderWorker = initReminderWorker();

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 Chatbot rodando em http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  const shutdown = async () => {
    console.log('Encerrando aplicação...');
    await app.close();
    // await reminderWorker.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap();
