import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils/prisma';

export const startChallenge = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: challengeId } = request.params as any;
    const userId = (request.user as any).id;

    try {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId }
        });

        if (!challenge) {
            return reply.code(404).send({ error: 'Challenge not found' });
        }

        const candidate = await prisma.candidateProfile.findUnique({
            where: { userId }
        });

        if (!candidate) {
            return reply.code(403).send({ error: 'Only candidates can start challenges' });
        }

        // Check if already submitted
        const existingSubmission = await prisma.submission.findFirst({
            where: {
                challengeId,
                candidateId: candidate.id
            }
        });

        if (existingSubmission && existingSubmission.status !== 'DRAFT') {
            return reply.code(400).send({ error: 'Challenge already submitted' });
        }

        // Create or return draft submission
        let submission = existingSubmission;
        if (!submission) {
            submission = await prisma.submission.create({
                data: {
                    challengeId,
                    candidateId: candidate.id,
                    status: 'UNDER_REVIEW', // In a real app, maybe 'ACTIVE' or 'DRAFT'
                    content: { code: '', language: 'javascript' }
                }
            });
        }

        return reply.send({ challenge, submission });
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to start challenge' });
    }
};

export const submitChallenge = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: challengeId } = request.params as any;
    const { content, assetUrls } = request.body as any;
    const userId = (request.user as any).id;

    try {
        const candidate = await prisma.candidateProfile.findUnique({
            where: { userId }
        });

        if (!candidate) {
            return reply.code(403).send({ error: 'Candidate profile required' });
        }

        const submission = await prisma.submission.updateMany({
            where: {
                challengeId,
                candidateId: candidate.id
            },
            data: {
                content,
                assetUrls,
                status: 'SUBMITTED',
                updatedAt: new Date()
            }
        });

        return reply.send({ message: 'Submitted successfully' });
    } catch (error) {
        return reply.code(500).send({ error: 'Submission failed' });
    }
};
