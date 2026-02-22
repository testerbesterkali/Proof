import { Worker, Job } from 'bullmq';
import * as dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

console.log('🔔 Notification Service Worker starting...');

interface NotificationPayload {
    type: string;
    recipient: string;
    data: Record<string, unknown>;
}

const worker = new Worker(
    'notifications',
    async (job: Job<NotificationPayload>) => {
        const { type, recipient } = job.data;

        console.log(`✉️ Sending ${type} notification to ${recipient}...`);

        // In a real implementation, this would use Resend/SendGrid/Twilio
        await new Promise<void>(resolve => setTimeout(resolve, 1000));

        return { success: true, type, recipient };
    },
    { connection: { url: redisUrl } }
);

worker.on('completed', (job) => {
    console.log(`✅ Notification job ${job.id} sent!`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Notification job ${job?.id} failed: ${err.message}`);
});
