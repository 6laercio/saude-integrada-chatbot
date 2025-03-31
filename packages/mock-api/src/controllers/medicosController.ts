import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { medicos } from '../db/schema.js';
import { eq, ilike, and, ne } from 'drizzle-orm';
import {
  CreateMedicoDTO,
  UpdateMedicoDTO,
  GetMedicoParamsDTO,
  GetMedicosQueryDTO,
  createMedicoSchema,
  updateMedicoSchema,
  getMedicoParamsSchema,
  getMedicosQuerySchema,
} from '../validations/medicos.js';

export async function getMedicos(
  request: FastifyRequest<{ Querystring: GetMedicosQueryDTO }>,
  reply: FastifyReply
) {
  try {
    const query = getMedicosQuerySchema.parse(request.query);

    let conditions = [];

    if (query?.nome) {
      conditions.push(ilike(medicos.nome, `%${query.nome}%`));
    }

    if (query?.especialidade) {
      conditions.push(eq(medicos.especialidade, query.especialidade));
    }

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(medicos)
            .where(and(...conditions))
        : await db.select().from(medicos);

    return reply.code(200).send(result);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao buscar médicos' });
  }
}

export async function getMedicoById(
  request: FastifyRequest<{ Params: GetMedicoParamsDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getMedicoParamsSchema.parse(request.params);

    const result = await db.select().from(medicos).where(eq(medicos.id, id));

    if (result.length === 0) {
      return reply.code(404).send({ error: 'Médico não encontrado' });
    }

    return reply.code(200).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao buscar médico' });
  }
}

export async function createMedico(
  request: FastifyRequest<{ Body: CreateMedicoDTO }>,
  reply: FastifyReply
) {
  try {
    const newMedico = createMedicoSchema.parse(request.body);

    const existingMedico = await db.select().from(medicos).where(eq(medicos.crm, newMedico.crm));

    if (existingMedico.length > 0) {
      return reply.code(400).send({ error: 'Já existe um médico com este CRM' });
    }

    const result = await db.insert(medicos).values(newMedico).returning();

    return reply.code(201).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao criar médico' });
  }
}

export async function updateMedico(
  request: FastifyRequest<{ Params: GetMedicoParamsDTO; Body: UpdateMedicoDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getMedicoParamsSchema.parse(request.params);
    const updateData = updateMedicoSchema.parse(request.body);

    const existingMedico = await db.select().from(medicos).where(eq(medicos.id, id));

    if (existingMedico.length === 0) {
      return reply.code(404).send({ error: 'Médico não encontrado' });
    }

    // verificar se o CRM está sendo atualizado e se já existe outro médico com o mesmo CRM
    if (updateData.crm) {
      const medicoByCrm = await db
        .select()
        .from(medicos)
        .where(and(eq(medicos.crm, updateData.crm), ne(medicos.id, id)));

      if (medicoByCrm.length > 0) {
        return reply.code(400).send({ error: 'Já existe um médico com este CRM' });
      }
    }

    const result = await db.update(medicos).set(updateData).where(eq(medicos.id, id)).returning();

    return reply.code(200).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao atualizar médico' });
  }
}

export async function deleteMedico(
  request: FastifyRequest<{ Params: GetMedicoParamsDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getMedicoParamsSchema.parse(request.params);

    const existingMedico = await db.select().from(medicos).where(eq(medicos.id, id));

    if (existingMedico.length === 0) {
      return reply.code(404).send({ error: 'Médico não encontrado' });
    }

    await db.delete(medicos).where(eq(medicos.id, id));

    return reply.code(204).send();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao deletar médico' });
  }
}
