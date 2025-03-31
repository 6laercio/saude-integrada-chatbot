import { FastifyInstance } from 'fastify';
import {
  getExames,
  getExameById,
  createExame,
  updateExame,
  deleteExame,
} from '../controllers/examesController.js';

export async function examesRoutes(fastify: FastifyInstance) {
  // Swagger schemas
  const pacienteSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      nome: { type: 'string' },
      telefone: { type: 'string' },
      email: { type: ['string', 'null'] },
      dataNascimento: { type: ['string', 'null'], format: 'date-time' },
      convenio: {
        type: ['string', 'null'],
        enum: ['Saúde Total', 'MediCare', 'VidaPlena', 'BemEstar Seguros', 'Particular', null],
      },
      numeroConvenio: { type: ['string', 'null'] },
    },
  };

  const exameSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      tipo: { type: 'string' },
      data: { type: 'string', format: 'date-time' },
      resultado: { type: ['string', 'null'] },
      disponivel: { type: 'string', enum: ['true', 'false'] },
      paciente: pacienteSchema,
    },
  };

  const createExameSchema = {
    type: 'object',
    properties: {
      pacienteId: { type: 'integer' },
      tipo: { type: 'string' },
      data: { type: 'string', format: 'date-time' },
      resultado: { type: 'string' },
      disponivel: { type: 'string', enum: ['true', 'false'] },
    },
    required: ['pacienteId', 'tipo', 'data'],
  };

  fastify.get(
    '/',
    {
      schema: {
        tags: ['Exames'],
        summary: 'Buscar todos os exames',
        querystring: {
          type: 'object',
          properties: {
            pacienteId: { type: 'integer' },
            tipo: { type: 'string' },
            disponivel: { type: 'string', enum: ['true', 'false'] },
          },
        },
        response: {
          200: {
            type: 'array',
            items: exameSchema,
          },
        },
      },
    },
    getExames
  );

  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Exames'],
        summary: 'Buscar exame por ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        response: {
          200: exameSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    getExameById
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Exames'],
        summary: 'Criar um novo exame',
        body: createExameSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              pacienteId: { type: 'integer' },
              tipo: { type: 'string' },
              data: { type: 'string', format: 'date-time' },
              resultado: { type: ['string', 'null'] },
              disponivel: { type: 'string', enum: ['true', 'false'] },
            },
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    createExame
  );

  fastify.put(
    '/:id',
    {
      schema: {
        tags: ['Exames'],
        summary: 'Atualizar um exame existente',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            pacienteId: { type: 'integer' },
            tipo: { type: 'string' },
            data: { type: 'string', format: 'date-time' },
            resultado: { type: 'string' },
            disponivel: { type: 'string', enum: ['true', 'false'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              pacienteId: { type: 'integer' },
              tipo: { type: 'string' },
              data: { type: 'string', format: 'date-time' },
              resultado: { type: ['string', 'null'] },
              disponivel: { type: 'string', enum: ['true', 'false'] },
            },
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    updateExame
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Exames'],
        summary: 'Excluir um exame',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        response: {
          204: {
            type: 'null',
            description: 'Sem conteúdo',
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    deleteExame
  );
}
