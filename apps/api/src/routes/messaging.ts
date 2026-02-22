import { FastifyInstance } from 'fastify';
import { getConversations, getMessageHistory, sendMessage } from '../controllers/messaging';

export default async function messagingRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    fastify.get('/conversations', getConversations);
    fastify.get('/history/:otherUserId', getMessageHistory);
    fastify.post('/send', sendMessage);
}
