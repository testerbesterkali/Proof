import { FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/cookie';
import { prisma } from '../utils/prisma';
import z from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['CANDIDATE', 'EMPLOYER'])
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const data = registerSchema.parse(request.body);
        // Use bcrypt in production
        const hashedPassword = `hashed_${data.password}`;

        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return reply.code(400).send({ error: 'Email already in use' });
        }

        const user = await prisma.user.create({
            data: {
                email: data.email,
                hashedPassword,
                role: data.role
            }
        });

        if (data.role === 'CANDIDATE') {
            await prisma.candidateProfile.create({ data: { userId: user.id } });
        } else {
            await prisma.employerProfile.create({ data: { userId: user.id, companyName: 'New Company' } });
        }

        const token = await reply.jwtSign({ id: user.id, role: user.role });
        reply.setCookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return reply.code(201).send({ message: 'Registered successfully', user: { id: user.id, email: user.email, role: user.role } });
    } catch (err: any) {
        return reply.code(400).send({ error: 'Failed to register', details: err.message });
    }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const data = loginSchema.parse(request.body);
        const user = await prisma.user.findUnique({ where: { email: data.email } });

        // Use bcrypt in production
        if (!user || user.hashedPassword !== `hashed_${data.password}`) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const token = await reply.jwtSign({ id: user.id, role: user.role });
        reply.setCookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return reply.code(200).send({ message: 'Login successful', user: { id: user.id, email: user.email, role: user.role } });
    } catch (err: any) {
        return reply.code(400).send({ error: 'Failed to login', details: err.message });
    }
};
