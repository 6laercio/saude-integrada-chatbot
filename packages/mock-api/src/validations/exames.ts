import { z } from 'zod';

// Validação para criar exame
export const createExameSchema = z.object({
  pacienteId: z.number().int().positive(),
  tipo: z.string().min(2).max(100),
  data: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
  resultado: z.string().optional(),
  disponivel: z.enum(['true', 'false']).default('false'),
});

// Validação para atualizar exame
export const updateExameSchema = createExameSchema.partial();

// Validação para parâmetros de busca
export const getExameParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Validação para parâmetros de query (filtros)
export const getExamesQuerySchema = z
  .object({
    pacienteId: z.coerce.number().int().positive().optional(),
    tipo: z.string().optional(),
    disponivel: z.enum(['true', 'false']).optional(),
  })
  .optional();

export type CreateExameDTO = z.infer<typeof createExameSchema>;
export type UpdateExameDTO = z.infer<typeof updateExameSchema>;
export type GetExameParamsDTO = z.infer<typeof getExameParamsSchema>;
export type GetExamesQueryDTO = z.infer<typeof getExamesQuerySchema>;
