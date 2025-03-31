import { FastifyInstance } from 'fastify';
import {
  getAgendamentos,
  getAgendamentoById,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento,
} from '../controllers/agendamentosController.js';

export async function agendamentosRoutes(fastify: FastifyInstance) {
  // Swagger schemas
  const statusEnum = ['agendado', 'confirmado', 'cancelado', 'realizado', 'ausente'];

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

  const agendamentoSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      data: { type: 'string', format: 'date-time' },
      status: { type: 'string', enum: statusEnum },
      observacoes: { type: ['string', 'null'] },
      paciente: pacienteSchema,
      medico: medicoSchema,
    },
  };

  const createAgendamentoSchema = {
    type: 'object',
    properties: {
      pacienteId: { type: 'integer' },
      medicoId: { type: 'integer' },
      data: { type: 'string', format: 'date-time' },
      status: { type: 'string', enum: statusEnum },
      observacoes: { type: 'string' },
    },
    required: ['pacienteId', 'medicoId', 'data'],
  };

  fastify.get(
    '/',
    {
      schema: {
        tags: ['Agendamentos'],
        summary: 'Buscar todos os agendamentos',
        querystring: {
          type: 'object',
          properties: {
            pacienteId: { type: 'integer' },
            medicoId: { type: 'integer' },
            status: { type: 'string', enum: statusEnum },
            dataInicio: { type: 'string', format: 'date-time' },
            dataFim: { type: 'string', format: 'date-time' },
          },
        },
        response: {
          200: {
            type: 'array',
            items: agendamentoSchema,
          },
        },
      },
    },
    getAgendamentos
  );

  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Agendamentos'],
        summary: 'Buscar agendamento por ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        response: {
          200: agendamentoSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    getAgendamentoById
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Agendamentos'],
        summary: 'Criar um novo agendamento',
        body: createAgendamentoSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              pacienteId: { type: 'integer' },
              medicoId: { type: 'integer' },
              data: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: statusEnum },
              observacoes: { type: ['string', 'null'] },
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
    createAgendamento
  );

  fastify.put(
    '/:id',
    {
      schema: {
        tags: ['Agendamentos'],
        summary: 'Atualizar um agendamento existente',
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
            medicoId: { type: 'integer' },
            data: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: statusEnum },
            observacoes: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              pacienteId: { type: 'integer' },
              medicoId: { type: 'integer' },
              data: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: statusEnum },
              observacoes: { type: ['string', 'null'] },
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
    updateAgendamento
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Agendamentos'],
        summary: 'Excluir um agendamento',
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
    deleteAgendamento
  );
}
