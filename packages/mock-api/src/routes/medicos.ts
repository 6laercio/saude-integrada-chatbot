import { FastifyInstance } from 'fastify';
import {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico,
} from '../controllers/medicosController.js';

export async function medicosRoutes(fastify: FastifyInstance) {
  // Swagger schemas
  const medicoSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      nome: { type: 'string' },
      crm: { type: 'string' },
      especialidade: {
        type: 'string',
        enum: [
          'Clínica Geral',
          'Pediatria',
          'Ginecologia',
          'Dermatologia',
          'Ortopedia',
          'Cardiologia',
          'Nutrição',
        ],
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  };

  const createMedicoSchema = {
    type: 'object',
    properties: {
      nome: { type: 'string' },
      crm: { type: 'string' },
      especialidade: {
        type: 'string',
        enum: [
          'Clínica Geral',
          'Pediatria',
          'Ginecologia',
          'Dermatologia',
          'Ortopedia',
          'Cardiologia',
          'Nutrição',
        ],
      },
    },
    required: ['nome', 'crm', 'especialidade'],
  };

  fastify.get(
    '/',
    {
      schema: {
        tags: ['Médicos'],
        summary: 'Buscar todos os médicos',
        querystring: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            especialidade: {
              type: 'string',
              enum: [
                'Clínica Geral',
                'Pediatria',
                'Ginecologia',
                'Dermatologia',
                'Ortopedia',
                'Cardiologia',
                'Nutrição',
              ],
            },
          },
        },
        response: {
          200: {
            type: 'array',
            items: medicoSchema,
          },
        },
      },
    },
    getMedicos
  );

  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Médicos'],
        summary: 'Buscar médico por ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        response: {
          200: medicoSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    getMedicoById
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Médicos'],
        summary: 'Criar um novo médico',
        body: createMedicoSchema,
        response: {
          201: medicoSchema,
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    createMedico
  );

  fastify.put(
    '/:id',
    {
      schema: {
        tags: ['Médicos'],
        summary: 'Atualizar um médico existente',
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
            nome: { type: 'string' },
            crm: { type: 'string' },
            especialidade: {
              type: 'string',
              enum: [
                'Clínica Geral',
                'Pediatria',
                'Ginecologia',
                'Dermatologia',
                'Ortopedia',
                'Cardiologia',
                'Nutrição',
              ],
            },
          },
        },
        response: {
          200: medicoSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    updateMedico
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Médicos'],
        summary: 'Excluir um médico',
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
    deleteMedico
  );
}
