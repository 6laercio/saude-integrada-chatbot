import { sql } from 'drizzle-orm';
import { db } from './index.js';
import {
  medicos,
  pacientes,
  agendamentos,
  exames,
  especialidadeEnum,
  convenioEnum,
} from './schema.js';
import { faker } from '@faker-js/faker/locale/pt_BR';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Verifica se já existem dados
    const medicosCount = await db.select({ count: sql`count(*)`.as('count') }).from(medicos);

    if (Number(medicosCount[0].count) > 0) {
      console.log('⚠️ O banco já possui dados, pulando seed...');
      process.exit(0);
    }

    // Define o tipo correto para os dados a serem inseridos
    type MedicoInsert = typeof medicos.$inferInsert;
    type PacienteInsert = typeof pacientes.$inferInsert;

    // Usando diretamente os valores do enum para médicos
    const medicosDados: MedicoInsert[] = [
      {
        nome: 'Dra. Márcia Santos',
        crm: '12345',
        especialidade: especialidadeEnum.enumValues[0], // Clínica Geral
      },
      {
        nome: 'Dr. Roberto Oliveira',
        crm: '23456',
        especialidade: especialidadeEnum.enumValues[1], // Pediatria
      },
      {
        nome: 'Dra. Carolina Lima',
        crm: '34567',
        especialidade: especialidadeEnum.enumValues[2], // Ginecologia
      },
      {
        nome: 'Dr. Henrique Mendes',
        crm: '45678',
        especialidade: especialidadeEnum.enumValues[3], // Dermatologia
      },
      {
        nome: 'Dra. Juliana Costa',
        crm: '56789',
        especialidade: especialidadeEnum.enumValues[4], // Ortopedia
      },
    ];

    console.log('🧑‍⚕️ Inserindo médicos...');
    const medicosInseridos = await db.insert(medicos).values(medicosDados).returning();
    console.log(`✅ ${medicosInseridos.length} médicos inseridos`);

    // Criar 50 pacientes fictícios
    console.log('🧑‍⚕️ Gerando pacientes fictícios...');

    const pacientesDados: PacienteInsert[] = Array.from({ length: 50 }, () => {
      const convenio = faker.helpers.arrayElement(convenioEnum.enumValues);

      return {
        nome: faker.person.fullName(),
        telefone: `+55${faker.string.numeric({ length: 11 })}`,
        email: faker.internet.email(),
        dataNascimento: faker.date.birthdate({ min: 1, max: 90, mode: 'age' }),
        convenio: convenio,
        numeroConvenio: convenio !== 'Particular' ? faker.string.numeric(10) : null,
      };
    });

    const pacientesInseridos = await db.insert(pacientes).values(pacientesDados).returning();
    console.log(`✅ ${pacientesInseridos.length} pacientes inseridos`);

    // Criar agendamentos
    console.log('📅 Gerando agendamentos fictícios...');
    const statusOptions = ['agendado', 'confirmado', 'cancelado', 'realizado', 'ausente'];

    const agendamentosDados = [];

    // Agendamentos para os próximos 30 dias
    for (let i = 0; i < 100; i++) {
      const paciente = faker.helpers.arrayElement(pacientesInseridos);
      const medico = faker.helpers.arrayElement(medicosInseridos);

      // Horário comercial, próximos 30 dias
      const dataConsulta = faker.date.soon({ days: 30 });
      dataConsulta.setHours(faker.number.int({ min: 8, max: 18 }), 0, 0); // Hora cheia

      agendamentosDados.push({
        pacienteId: paciente.id,
        medicoId: medico.id,
        data: dataConsulta,
        status: faker.helpers.arrayElement(statusOptions),
        observacoes: Math.random() > 0.7 ? faker.lorem.sentence() : null,
      });
    }

    const agendamentosInseridos = await db
      .insert(agendamentos)
      .values(agendamentosDados)
      .returning();
    console.log(`✅ ${agendamentosInseridos.length} agendamentos inseridos`);

    // Criar exames
    console.log('🔬 Gerando exames fictícios...');
    const tiposExames = [
      'Hemograma Completo',
      'Glicemia em Jejum',
      'Colesterol Total e Frações',
      'TSH e T4 Livre',
      'Ultrassonografia Abdominal',
      'Raio-X de Tórax',
      'Eletrocardiograma',
      'Teste Ergométrico',
      'Papanicolau',
      'Densitometria Óssea',
    ];

    const examesDados = [];

    for (let i = 0; i < 80; i++) {
      const paciente = faker.helpers.arrayElement(pacientesInseridos);

      // Data aleatória dos últimos 60 dias
      const dataExame = faker.date.recent({ days: 60 });
      dataExame.setHours(faker.number.int({ min: 7, max: 17 }), 0, 0);

      const disponivel = Math.random() > 0.3; // 70% dos exames estão disponíveis

      examesDados.push({
        pacienteId: paciente.id,
        tipo: faker.helpers.arrayElement(tiposExames),
        data: dataExame,
        resultado: disponivel ? faker.lorem.paragraphs(2) : null,
        disponivel: disponivel ? 'true' : 'false',
      });
    }

    const examesInseridos = await db.insert(exames).values(examesDados).returning();
    console.log(`✅ ${examesInseridos.length} exames inseridos`);

    console.log('✅ Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

seed();
