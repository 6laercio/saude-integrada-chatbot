import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

export const especialidadeEnum = pgEnum('especialidade', [
  'Clínica Geral',
  'Pediatria',
  'Ginecologia',
  'Dermatologia',
  'Ortopedia',
  'Cardiologia',
  'Nutrição',
]);

export const convenioEnum = pgEnum('convenio', [
  'Saúde Total',
  'MediCare',
  'VidaPlena',
  'BemEstar Seguros',
  'Particular',
]);

export const medicos = pgTable('medicos', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  crm: text('crm').notNull().unique(),
  especialidade: especialidadeEnum('especialidade').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const pacientes = pgTable('pacientes', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  telefone: text('telefone').notNull().unique(),
  email: text('email'),
  dataNascimento: timestamp('data_nascimento'),
  convenio: convenioEnum('convenio'),
  numeroConvenio: text('numero_convenio'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const agendamentos = pgTable('agendamentos', {
  id: serial('id').primaryKey(),
  pacienteId: integer('paciente_id')
    .references(() => pacientes.id)
    .notNull(),
  medicoId: integer('medico_id')
    .references(() => medicos.id)
    .notNull(),
  data: timestamp('data').notNull(),
  status: text('status').notNull().default('agendado'),
  observacoes: text('observacoes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const exames = pgTable('exames', {
  id: serial('id').primaryKey(),
  pacienteId: integer('paciente_id')
    .references(() => pacientes.id)
    .notNull(),
  tipo: text('tipo').notNull(),
  data: timestamp('data').notNull(),
  resultado: text('resultado'),
  disponivel: text('disponivel').default('false'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
