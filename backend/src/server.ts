import Fastify from 'fastify';
import cors from '@fastify/cors';
import { bookRoutes } from './routes/bookRoutes';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Registrar CORS
fastify.register(cors, {
  origin: true,
  credentials: true,
});

// Registrar rotas
fastify.register(bookRoutes, { prefix: '/api' });

// Rota de health check
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    const port = process.env.PORT_BACKEND ? parseInt(process.env.PORT_BACKEND) : 3002;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Servidor rodando na porta ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 