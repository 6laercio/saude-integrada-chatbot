import { Queue, Worker, QueueEvents } from 'bullmq';
import { redis } from './redis.js';

// fila de lembretes
export const reminderQueue = new Queue('reminders', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: {
      count: 100,
      age: 24 * 60 * 60, // 1 dia
    },
    removeOnFail: {
      count: 100,
      age: 7 * 24 * 60 * 60, // 7 dias
    },
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

// Monitorar eventos da fila
const queueEvents = new QueueEvents('reminders', {
  connection: redis,
});

queueEvents.on('completed', ({ jobId }) => {
  console.log(`Lembrete completado: ${jobId}`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`Lembrete falhou: ${jobId}`, failedReason);
});

export function initReminderWorker() {
  const worker = new Worker(
    'reminders',
    async (job) => {
      console.log(`Processando lembrete: ${job.id}`, job.data);
      // implementar ógica de processamento de lembretes
    },
    {
      connection: redis,
      autorun: true,
    }
  );

  worker.on('completed', (job) => {
    console.log(`Lembrete processado com sucesso: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Erro ao processar lembrete ${job?.id}:`, err);
  });

  return worker;
}
