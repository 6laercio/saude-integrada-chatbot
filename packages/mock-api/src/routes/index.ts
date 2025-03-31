import { FastifyInstance } from 'fastify';
import { medicosRoutes } from './medicos.js';
import { pacientesRoutes } from './pacientes.js';
import { agendamentosRoutes } from './agendamentos.js';
import { examesRoutes } from './exames.js';

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  app.register(medicosRoutes, { prefix: '/api/medicos' });
  app.register(pacientesRoutes, { prefix: '/api/pacientes' });
  app.register(agendamentosRoutes, { prefix: '/api/agendamentos' });
  app.register(examesRoutes, { prefix: '/api/exames' });
}
