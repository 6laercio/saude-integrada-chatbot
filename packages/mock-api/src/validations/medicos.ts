import { z } from 'zod';
import { especialidadeEnum } from '../db/schema.js';

// Validação para criar médico
export const createMedicoSchema = z.object({
  nome: z.string().min(3).max(100),
  crm: z.string().min(4).max(20),
  especialidade: z.enum(especialidadeEnum.enumValues),
});

// Validação para atualizar mdico
export const updateMedicoSchema = createMedicoSchema.partial();

// Validação para parâmetros de busca
export const getMedicoParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// validação para parâmetros de query (filtros)
export const getMedicosQuerySchema = z
  .object({
    especialidade: z.enum(especialidadeEnum.enumValues).optional(),
    nome: z.string().optional(),
  })
  .optional();

export type CreateMedicoDTO = z.infer<typeof createMedicoSchema>;
export type UpdateMedicoDTO = z.infer<typeof updateMedicoSchema>;
export type GetMedicoParamsDTO = z.infer<typeof getMedicoParamsSchema>;
export type GetMedicosQueryDTO = z.infer<typeof getMedicosQuerySchema>;
