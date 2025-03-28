import { FastifyInstance } from 'fastify';

export default function routes(fastify: FastifyInstance) {
  fastify.get('/', () => {
    return { message: 'Bem-vindo ao chatbot da Clínica Saúde Integrada!' };
  });
}
