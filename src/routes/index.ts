import { FastifyInstance } from 'fastify';

export default async function routes(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    return { message: 'Bem-vindo ao chatbot da Clínica Saúde Integrada!' };
  });
}
