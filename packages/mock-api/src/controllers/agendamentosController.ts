import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { agendamentos, medicos, pacientes } from '../db/schema.js';
import { eq, and, gte, lte, sql, ne } from 'drizzle-orm';
import {
  CreateAgendamentoDTO,
  UpdateAgendamentoDTO,
  GetAgendamentoParamsDTO,
  GetAgendamentosQueryDTO,
  createAgendamentoSchema,
  updateAgendamentoSchema,
  getAgendamentoParamsSchema,
  getAgendamentosQuerySchema,
} from '../validations/agendamentos.js';

export async function getAgendamentos(
  request: FastifyRequest<{ Querystring: GetAgendamentosQueryDTO }>,
  reply: FastifyReply
) {
  try {
    const query = getAgendamentosQuerySchema.parse(request.query);

    let conditions = [];

    if (query?.pacienteId) {
      conditions.push(eq(agendamentos.pacienteId, query.pacienteId));
    }

    if (query?.medicoId) {
      conditions.push(eq(agendamentos.medicoId, query.medicoId));
    }

    if (query?.status) {
      conditions.push(eq(agendamentos.status, query.status));
    }

    if (query?.dataInicio) {
      conditions.push(gte(agendamentos.data, new Date(query.dataInicio)));
    }

    if (query?.dataFim) {
      conditions.push(lte(agendamentos.data, new Date(query.dataFim)));
    }

    const result = await db
      .select({
        id: agendamentos.id,
        data: agendamentos.data,
        status: agendamentos.status,
        observacoes: agendamentos.observacoes,
        paciente: pacientes,
        medico: medicos,
      })
      .from(agendamentos)
      .leftJoin(pacientes, eq(agendamentos.pacienteId, pacientes.id))
      .leftJoin(medicos, eq(agendamentos.medicoId, medicos.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${agendamentos.data} DESC`);

    return reply.code(200).send(result);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao buscar agendamentos' });
  }
}

export async function getAgendamentoById(
  request: FastifyRequest<{ Params: GetAgendamentoParamsDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getAgendamentoParamsSchema.parse(request.params);

    const result = await db
      .select({
        id: agendamentos.id,
        data: agendamentos.data,
        status: agendamentos.status,
        observacoes: agendamentos.observacoes,
        paciente: pacientes,
        medico: medicos,
      })
      .from(agendamentos)
      .leftJoin(pacientes, eq(agendamentos.pacienteId, pacientes.id))
      .leftJoin(medicos, eq(agendamentos.medicoId, medicos.id))
      .where(eq(agendamentos.id, id));

    if (result.length === 0) {
      return reply.code(404).send({ error: 'Agendamento não encontrado' });
    }

    return reply.code(200).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao buscar agendamento' });
  }
}

export async function createAgendamento(
  request: FastifyRequest<{ Body: CreateAgendamentoDTO }>,
  reply: FastifyReply
) {
  try {
    const newAgendamento = createAgendamentoSchema.parse(request.body);

    // Verificar se o paciente existe
    const pacienteExiste = await db
      .select()
      .from(pacientes)
      .where(eq(pacientes.id, newAgendamento.pacienteId));

    if (pacienteExiste.length === 0) {
      return reply.code(400).send({ error: 'Paciente não encontrado' });
    }

    // Verificar se o médico existe
    const medicoExiste = await db
      .select()
      .from(medicos)
      .where(eq(medicos.id, newAgendamento.medicoId));

    if (medicoExiste.length === 0) {
      return reply.code(400).send({ error: 'Médico não encontrado' });
    }

    // Verificar se já existe um agendamento no mesmo horário para o mesmo médico
    const agendaData = new Date(newAgendamento.data);
    const agendaDataFim = new Date(agendaData);
    agendaDataFim.setMinutes(agendaDataFim.getMinutes() + 30); // Consulta típica de 30 minutos

    const agendamentosConflitantes = await db
      .select()
      .from(agendamentos)
      .where(
        and(
          eq(agendamentos.medicoId, newAgendamento.medicoId),
          gte(agendamentos.data, agendaData),
          lte(agendamentos.data, agendaDataFim),
          eq(agendamentos.status, 'agendado')
        )
      );

    if (agendamentosConflitantes.length > 0) {
      return reply.code(400).send({
        error: 'Já existe um agendamento neste horário para este médico',
      });
    }

    const result = await db
      .insert(agendamentos)
      .values({
        ...newAgendamento,
        data: agendaData,
      })
      .returning();

    return reply.code(201).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao criar agendamento' });
  }
}

export async function updateAgendamento(
  request: FastifyRequest<{ Params: GetAgendamentoParamsDTO; Body: UpdateAgendamentoDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getAgendamentoParamsSchema.parse(request.params);
    const updateData = updateAgendamentoSchema.parse(request.body);

    // Verificar se o agendamento existe
    const existingAgendamento = await db.select().from(agendamentos).where(eq(agendamentos.id, id));

    if (existingAgendamento.length === 0) {
      return reply.code(404).send({ error: 'Agendamento não encontrado' });
    }

    // Se estiver atualizando o paciente, verificar se existe
    if (updateData.pacienteId) {
      const pacienteExiste = await db
        .select()
        .from(pacientes)
        .where(eq(pacientes.id, updateData.pacienteId));

      if (pacienteExiste.length === 0) {
        return reply.code(400).send({ error: 'Paciente não encontrado' });
      }
    }

    // Se estiver atualizando o médico, verificar se existe
    if (updateData.medicoId) {
      const medicoExiste = await db
        .select()
        .from(medicos)
        .where(eq(medicos.id, updateData.medicoId));

      if (medicoExiste.length === 0) {
        return reply.code(400).send({ error: 'Médico não encontrado' });
      }
    }

    // Se estiver atualizando a data, verificar conflitos
    if (updateData.data) {
      const agendaData = new Date(updateData.data);
      const agendaDataFim = new Date(agendaData);
      agendaDataFim.setMinutes(agendaDataFim.getMinutes() + 30);

      const medicoId = updateData.medicoId || existingAgendamento[0].medicoId;

      const agendamentosConflitantes = await db
        .select()
        .from(agendamentos)
        .where(
          and(
            eq(agendamentos.medicoId, medicoId),
            gte(agendamentos.data, agendaData),
            lte(agendamentos.data, agendaDataFim),
            eq(agendamentos.status, 'agendado'),
            ne(agendamentos.id, id)
          )
        );

      if (agendamentosConflitantes.length > 0) {
        return reply.code(400).send({
          error: 'Já existe um agendamento neste horário para este médico',
        });
      }

      updateData.data = agendaData;
    }

    const result = await db
      .update(agendamentos)
      .set(updateData)
      .where(eq(agendamentos.id, id))
      .returning();

    return reply.code(200).send(result[0]);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao atualizar agendamento' });
  }
}

export async function deleteAgendamento(
  request: FastifyRequest<{ Params: GetAgendamentoParamsDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = getAgendamentoParamsSchema.parse(request.params);

    // Verificar se o agendamento existe
    const existingAgendamento = await db.select().from(agendamentos).where(eq(agendamentos.id, id));

    if (existingAgendamento.length === 0) {
      return reply.code(404).send({ error: 'Agendamento não encontrado' });
    }

    await db.delete(agendamentos).where(eq(agendamentos.id, id));

    return reply.code(204).send();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao deletar agendamento' });
  }
}
