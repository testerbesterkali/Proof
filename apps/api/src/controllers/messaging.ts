import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils/prisma';
import { io } from '../app';

export const getConversations = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).id;

    // Get unique users with whom this user has exchanged messages
    const sentTo = await prisma.message.findMany({
        where: { senderId: userId },
        distinct: ['receiverId'],
        select: { receiver: { select: { id: true, email: true, role: true } } }
    });

    const receivedFrom = await prisma.message.findMany({
        where: { receiverId: userId },
        distinct: ['senderId'],
        select: { sender: { select: { id: true, email: true, role: true } } }
    });

    const conversationUsers = new Map();
    sentTo.forEach(m => conversationUsers.set(m.receiver.id, m.receiver));
    receivedFrom.forEach(m => conversationUsers.set(m.sender.id, m.sender));

    return Array.from(conversationUsers.values());
};

export const getMessageHistory = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).id;
    const { otherUserId } = request.params as { otherUserId: string };

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        },
        orderBy: { createdAt: 'asc' }
    });

    return messages;
};

export const sendMessage = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).id;
    const { receiverId, content } = request.body as { receiverId: string, content: string };

    const message = await prisma.message.create({
        data: {
            senderId: userId,
            receiverId,
            content
        }
    });

    // Notify the receiver via Socket.io if they are connected
    const roomId = [userId, receiverId].sort().join('-');
    io.to(roomId).emit('new_message', message);

    return message;
};
