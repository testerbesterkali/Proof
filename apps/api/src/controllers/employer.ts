import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils/prisma';

export const createEmployerProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    const { companyName, industry, website, companySize } = request.body as any;
    const userId = (request.user as any).id;

    try {
        const profile = await prisma.employerProfile.create({
            data: {
                userId,
                companyName,
                industry,
                verifiedUrl: website,
                companySize
            }
        });

        // Update user role to EMPLOYER if not already set
        await prisma.user.update({
            where: { id: userId },
            data: { role: 'EMPLOYER' }
        });

        return reply.code(201).send(profile);
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to create employer profile' });
    }
};

export const getEmployerDashboard = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).id;

    try {
        const profile = await prisma.employerProfile.findUnique({
            where: { userId },
            include: {
                challenges: {
                    include: {
                        _count: {
                            select: { submissions: true }
                        }
                    }
                }
            }
        });

        if (!profile) {
            return reply.code(404).send({ error: 'Employer profile not found' });
        }

        return reply.send(profile);
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to fetch dashboard data' });
    }
};

export const createChallenge = async (request: FastifyRequest, reply: FastifyReply) => {
    const { title, description, type, timeLimitMins, prizeAmount, isPublic, rubric } = request.body as any;
    const userId = (request.user as any).id;

    try {
        const profile = await prisma.employerProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return reply.code(404).send({ error: 'Employer profile not found' });
        }

        const challenge = await prisma.challenge.create({
            data: {
                employerId: profile.id,
                title,
                description,
                type,
                timeLimitMins: parseInt(timeLimitMins),
                prizeAmount: parseInt(prizeAmount),
                isPublic: !!isPublic,
                status: 'ACTIVE',
                rubric
            }
        });

        return reply.code(201).send(challenge);
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to create challenge' });
    }
};

export const getSubmissionReview = async (request: FastifyRequest, reply: FastifyReply) => {
    const { submissionId } = request.params as any;

    try {
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                challenge: true,
                candidate: {
                    include: { user: { select: { email: true } } }
                },
                comments: {
                    include: { author: { select: { email: true } } },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!submission) {
            return reply.code(404).send({ error: 'Submission not found' });
        }

        return reply.send(submission);
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to fetch submission review' });
    }
};

export const updateSubmissionReview = async (request: FastifyRequest, reply: FastifyReply) => {
    const { submissionId } = request.params as any;
    const { status, employerRating, rubricScores, feedback } = request.body as any;

    try {
        const submission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status,
                employerRating,
                rubricScores,
                feedback,
                updatedAt: new Date()
            }
        });

        return reply.send(submission);
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to update submission' });
    }
};

export const addSubmissionComment = async (request: FastifyRequest, reply: FastifyReply) => {
    const { submissionId } = request.params as any;
    const { content } = request.body as any;
    const userId = (request.user as any).id;

    try {
        const comment = await prisma.submissionComment.create({
            data: {
                submissionId,
                authorId: userId,
                content
            },
            include: {
                author: { select: { email: true } }
            }
        });

        return reply.code(201).send(comment);
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to add comment' });
    }
};
