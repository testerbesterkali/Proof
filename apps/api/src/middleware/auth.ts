import { FastifyRequest, FastifyReply } from 'fastify';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or missing token' });
    }
}

export function verifyRole(requiredRoles: string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const userRole = (request.user as any)?.role;
        if (!requiredRoles.includes(userRole)) {
            reply.code(403).send({ error: 'Forbidden', message: 'Insufficient permissions' });
        }
    };
}
