import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as employerController from '../controllers/employer';
import { verifyJWT } from '../middleware/auth';

const employerRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    // Apply JWT verification to all employer routes
    fastify.addHook('onRequest', verifyJWT);

    // Profile Onboarding
    fastify.post('/profile', employerController.createEmployerProfile);

    // Dashboard Data
    fastify.get('/dashboard', employerController.getEmployerDashboard);

    // Challenge Management
    fastify.post('/challenges', employerController.createChallenge);

    // Submission Review
    fastify.get('/review/:submissionId', employerController.getSubmissionReview);
    fastify.patch('/review/:submissionId', employerController.updateSubmissionReview);
    fastify.post('/review/:submissionId/comments', employerController.addSubmissionComment);
};

export default employerRoutes;
