import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as authController from '../controllers/auth';

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.post('/register', {
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '1 minute'
            }
        }
    }, authController.register);

    fastify.post('/login', {
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 minute'
            }
        }
    }, authController.login);
};

export default authRoutes;
