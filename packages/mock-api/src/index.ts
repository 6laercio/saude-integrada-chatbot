import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './config/env.js';
import { registerRoutes } from './routes/index.js';

async function bootstrap() {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  await app.register(cors);

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Clínica Saúde Integrada - API',
        description: 'API para o chatbot da Clínica Saúde Integrada',
        version: '1.0.0',
        contact: {
          name: 'Suporte',
          email: 'suporte@saudeintegrada.com',
        },
      },
      tags: [
        { name: 'Médicos', description: 'Operações relacionadas a médicos' },
        { name: 'Pacientes', description: 'Operações relacionadas a pacientes' },
        { name: 'Agendamentos', description: 'Operações relacionadas a agendamentos' },
        { name: 'Exames', description: 'Operações relacionadas a exames' },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'api_key',
            in: 'header',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  });

  await registerRoutes(app);

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 API rodando em http://localhost:${env.PORT}`);
    console.log(`📚 Documentação disponível em http://localhost:${env.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
