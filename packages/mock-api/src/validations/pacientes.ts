import { z } from 'zod';
import { convenioEnum } from '../db/schema.js';

// Validação para criar paciente
export const createPacienteSchema = z.object({
  nome: z.string().min(3).max(100),
  telefone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  dataNascimento: z.string().datetime().optional(),
  convenio: z.enum(convenioEnum.enumValues).optional(),
  numeroConvenio: z.string().optional(),
});

// Validação para atualizar paciente
export const updatePacienteSchema = createPacienteSchema.partial();

// Validação para parâmetros de busca
export const getPacienteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Validação para parâmetros de query
export const getPacientesQuerySchema = z
  .object({
    nome: z.string().optional(),
    telefone: z.string().optional(),
    convenio: z.enum(convenioEnum.enumValues).optional(),
  })
  .optional();

export type CreatePacienteDTO = z.infer<typeof createPacienteSchema>;
export type UpdatePacienteDTO = z.infer<typeof updatePacienteSchema>;
export type GetPacienteParamsDTO = z.infer<typeof getPacienteParamsSchema>;
export type GetPacientesQueryDTO = z.infer<typeof getPacientesQuerySchema>;
