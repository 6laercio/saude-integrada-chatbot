import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { exames, pacientes } from '../db/schema.js';
import { eq, and, ilike } from 'drizzle-orm';
import {
  CreateExameDTO,
  UpdateExameDTO,
  GetExameParamsDTO,
  GetExamesQueryDTO,
  createExameSchema,
  updateExameSchema,
  getExameParamsSchema,
  getExamesQuerySchema,
} from '../validations/exames.js';

export async function getExames(
  request: FastifyRequest<{ Querystring: GetExamesQueryDTO }>,
  reply: FastifyReply
) {
  try {
    const query = getExamesQuerySchema.parse(request.query);

    let conditions = [];

    if (query?.pacienteId) {
      conditions.push(eq(exames.pacienteId, query.pacienteId));
    }

    if (query?.tipo) {
      conditions.push(ilike(exames.tipo, `%${query.tipo}%`));
    }

    if (query?.disponivel) {
      conditions.push(eq(exames.disponivel, query.disponivel));
    }

    const result = await db
      .select({
        id: exames.id,
        tipo: exames.tipo,
        data: exames.data,
        resultado: exames.resultado,
        disponivel: exames.disponivel,
        paciente: pacientes,
      })
      .from(exames)
      .leftJoin(pacientes, eq(exames.pacienteId, pacientes.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return reply.code(200).send(result);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao buscar exames' });
  }
}

export async function getExameById(
  request: FastifyRequest<{ Params: GetExameParamsDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getExameParamsSchema.parse(request.params);

    const result = await db
      .select({
        id: exames.id,
        tipo: exames.tipo,
        data: exames.data,
        resultado: exames.resultado,
        disponivel: exames.disponivel,
        paciente: pacientes,
      })
      .from(exames)
      .leftJoin(pacientes, eq(exames.pacienteId, pacientes.id))
      .where(eq(exames.id, id));

    if (result.length === 0) {
      return reply.code(404).send({ error: 'Exame não encontrado' });
    }

    return reply.code(200).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao buscar exame' });
  }
}

export async function createExame(
  request: FastifyRequest<{ Body: CreateExameDTO }>,
  reply: FastifyReply
) {
  try {
    const newExame = createExameSchema.parse(request.body);

    const pacienteExiste = await db
      .select()
      .from(pacientes)
      .where(eq(pacientes.id, newExame.pacienteId));

    if (pacienteExiste.length === 0) {
      return reply.code(400).send({ error: 'Paciente não encontrado' });
    }

    const result = await db
      .insert(exames)
      .values({
        ...newExame,
        data: new Date(newExame.data),
      })
      .returning();

    return reply.code(201).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao criar exame' });
  }
}

export async function updateExame(
  request: FastifyRequest<{ Params: GetExameParamsDTO; Body: UpdateExameDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getExameParamsSchema.parse(request.params);
    const updateData = updateExameSchema.parse(request.body);

    const existingExame = await db.select().from(exames).where(eq(exames.id, id));

    if (existingExame.length === 0) {
      return reply.code(404).send({ error: 'Exame não encontrado' });
    }

    if (updateData.pacienteId) {
      const pacienteExiste = await db
        .select()
        .from(pacientes)
        .where(eq(pacientes.id, updateData.pacienteId));

      if (pacienteExiste.length === 0) {
        return reply.code(400).send({ error: 'Paciente não encontrado' });
      }
    }

    // Converter a data se necessário
    // if (updateData.data) {
    //   updateData.data = new Date(updateData.data);
    // }

    // const result = await db.update(exames).set(updateData).where(eq(exames.id, id)).returning();

    // return reply.code(200).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao atualizar exame' });
  }
}

export async function deleteExame(
  request: FastifyRequest<{ Params: GetExameParamsDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getExameParamsSchema.parse(request.params);

    const existingExame = await db.select().from(exames).where(eq(exames.id, id));

    if (existingExame.length === 0) {
      return reply.code(404).send({ error: 'Exame não encontrado' });
    }

    await db.delete(exames).where(eq(exames.id, id));

    return reply.code(204).send();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao deletar exame' });
  }
}
