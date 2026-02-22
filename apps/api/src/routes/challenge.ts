import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as challengeController from '../controllers/challenge';
import { verifyJWT } from '../middleware/auth';

const challengeRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.addHook('onRequest', verifyJWT);

    fastify.post('/:id/start', challengeController.startChallenge);
    fastify.post('/:id/submit', challengeController.submitChallenge);
};

export default challengeRoutes;
