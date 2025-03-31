import { z } from 'zod';

// Status possíveis para agendamentos
const statusEnum = ['agendado', 'confirmado', 'cancelado', 'realizado', 'ausente'] as const;

// Validação para criar agendamento
export const createAgendamentoSchema = z.object({
  pacienteId: z.number().int().positive(),
  medicoId: z.number().int().positive(),
  data: z.string().datetime(),
  status: z.enum(statusEnum).default('agendado'),
  observacoes: z.string().optional(),
});

// Validação para atualizar agendamento
export const updateAgendamentoSchema = createAgendamentoSchema.partial();

// Validação para parâmetros de busca
export const getAgendamentoParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Validação para parâmetros de query (filtros)
export const getAgendamentosQuerySchema = z
  .object({
    pacienteId: z.coerce.number().int().positive().optional(),
    medicoId: z.coerce.number().int().positive().optional(),
    status: z.enum(statusEnum).optional(),
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
  })
  .optional();

// Tipos inferidos
export type CreateAgendamentoDTO = z.infer<typeof createAgendamentoSchema>;
export type UpdateAgendamentoDTO = z.infer<typeof updateAgendamentoSchema>;
export type GetAgendamentoParamsDTO = z.infer<typeof getAgendamentoParamsSchema>;
export type GetAgendamentosQueryDTO = z.infer<typeof getAgendamentosQuerySchema>;
