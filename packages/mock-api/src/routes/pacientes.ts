import { FastifyInstance } from 'fastify';
import {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from '../controllers/pacientesController.js';

export async function pacientesRoutes(fastify: FastifyInstance) {
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
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  };

  const createPacienteSchema = {
    type: 'object',
    properties: {
      nome: { type: 'string' },
      telefone: { type: 'string' },
      email: { type: 'string' },
      dataNascimento: { type: 'string', format: 'date-time' },
      convenio: {
        type: 'string',
        enum: ['Saúde Total', 'MediCare', 'VidaPlena', 'BemEstar Seguros', 'Particular'],
      },
      numeroConvenio: { type: 'string' },
    },
    required: ['nome', 'telefone'],
  };

  fastify.get(
    '/',
    {
      schema: {
        tags: ['Pacientes'],
        summary: 'Buscar todos os pacientes',
        querystring: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            telefone: { type: 'string' },
            convenio: {
              type: 'string',
              enum: ['Saúde Total', 'MediCare', 'VidaPlena', 'BemEstar Seguros', 'Particular'],
            },
          },
        },
        response: {
          200: {
            type: 'array',
            items: pacienteSchema,
          },
        },
      },
    },
    getPacientes
  );

  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Pacientes'],
        summary: 'Buscar paciente por ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        response: {
          200: pacienteSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    getPacienteById
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Pacientes'],
        summary: 'Criar um novo paciente',
        body: createPacienteSchema,
        response: {
          201: pacienteSchema,
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    createPaciente
  );

  fastify.put(
    '/:id',
    {
      schema: {
        tags: ['Pacientes'],
        summary: 'Atualizar um paciente existente',
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
            telefone: { type: 'string' },
            email: { type: 'string' },
            dataNascimento: { type: 'string', format: 'date-time' },
            convenio: {
              type: 'string',
              enum: ['Saúde Total', 'MediCare', 'VidaPlena', 'BemEstar Seguros', 'Particular'],
            },
            numeroConvenio: { type: 'string' },
          },
        },
        response: {
          200: pacienteSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    updatePaciente
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Pacientes'],
        summary: 'Excluir um paciente',
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
    deletePaciente
  );
}
