import Fastify from 'fastify';
import { Server } from 'socket.io';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import authRoutes from './routes/auth';
import employerRoutes from './routes/employer';
import challengeRoutes from './routes/challenge';
import messagingRoutes from './routes/messaging';

const app = Fastify({
    logger: true
});

app.register(helmet);
app.register(cors, {
    origin: true,
    credentials: true
});

app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
});

app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret-jwt-key'
});

app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'supersecret-cookie-signature',
    hook: 'onRequest'
});

app.register(authRoutes, { prefix: '/api/v1/auth' });
app.register(employerRoutes, { prefix: '/api/v1/employer' });
app.register(challengeRoutes, { prefix: '/api/v1/challenge' });
app.register(messagingRoutes, { prefix: '/api/v1/messages' });

// Socket.io initialization
const io = new Server(app.server, {
    cors: {
        origin: process.env.WEB_APP_URL || 'http://localhost:5173',
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on('send_message', (data) => {
        // Broadcast to room
        io.to(data.roomId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

export { io };


app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`API Server listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

if (require.main === module) {
    start();
}

export default app;
