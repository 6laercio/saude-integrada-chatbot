import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { pacientes } from '../db/schema.js';
import { eq, ilike, and, ne } from 'drizzle-orm';
import {
  CreatePacienteDTO,
  UpdatePacienteDTO,
  GetPacienteParamsDTO,
  GetPacientesQueryDTO,
  createPacienteSchema,
  updatePacienteSchema,
  getPacienteParamsSchema,
  getPacientesQuerySchema,
} from '../validations/pacientes.js';

export async function getPacientes(
  request: FastifyRequest<{ Querystring: GetPacientesQueryDTO }>,
  reply: FastifyReply
) {
  try {
    const query = getPacientesQuerySchema.parse(request.query);

    let conditions = [];

    if (query?.nome) {
      conditions.push(ilike(pacientes.nome, `%${query.nome}%`));
    }

    if (query?.telefone) {
      conditions.push(eq(pacientes.telefone, query.telefone));
    }

    if (query?.convenio) {
      conditions.push(eq(pacientes.convenio, query.convenio));
    }

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(pacientes)
            .where(and(...conditions))
        : await db.select().from(pacientes);

    return reply.code(200).send(result);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao buscar pacientes' });
  }
}

export async function getPacienteById(
  request: FastifyRequest<{ Params: GetPacienteParamsDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getPacienteParamsSchema.parse(request.params);

    const result = await db.select().from(pacientes).where(eq(pacientes.id, id));

    if (result.length === 0) {
      return reply.code(404).send({ error: 'Paciente não encontrado' });
    }

    return reply.code(200).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao buscar paciente' });
  }
}

export async function createPaciente(
  request: FastifyRequest<{ Body: CreatePacienteDTO }>,
  reply: FastifyReply
) {
  try {
    const newPaciente = createPacienteSchema.parse(request.body);

    const existingPaciente = await db
      .select()
      .from(pacientes)
      .where(eq(pacientes.telefone, newPaciente.telefone));

    if (existingPaciente.length > 0) {
      return reply.code(400).send({ error: 'Já existe um paciente com este telefone' });
    }

    const result = await db.insert(pacientes).values(newPaciente).returning();

    return reply.code(201).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao criar paciente' });
  }
}

export async function updatePaciente(
  request: FastifyRequest<{ Params: GetPacienteParamsDTO; Body: UpdatePacienteDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getPacienteParamsSchema.parse(request.params);
    const updateData = updatePacienteSchema.parse(request.body);

    const existingPaciente = await db.select().from(pacientes).where(eq(pacientes.id, id));

    if (existingPaciente.length === 0) {
      return reply.code(404).send({ error: 'Paciente não encontrado' });
    }

    if (updateData.telefone) {
      const pacienteByTelefone = await db
        .select()
        .from(pacientes)
        .where(and(eq(pacientes.telefone, updateData.telefone), ne(pacientes.id, id)));

      if (pacienteByTelefone.length > 0) {
        return reply.code(400).send({ error: 'Já existe um paciente com este telefone' });
      }
    }

    const result = await db
      .update(pacientes)
      .set(updateData)
      .where(eq(pacientes.id, id))
      .returning();

    return reply.code(200).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao atualizar paciente' });
  }
}

export async function deletePaciente(
  request: FastifyRequest<{ Params: GetPacienteParamsDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getPacienteParamsSchema.parse(request.params);

    const existingPaciente = await db.select().from(pacientes).where(eq(pacientes.id, id));

    if (existingPaciente.length === 0) {
      return reply.code(404).send({ error: 'Paciente não encontrado' });
    }

    await db.delete(pacientes).where(eq(pacientes.id, id));

    return reply.code(204).send();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao deletar paciente' });
  }
}
