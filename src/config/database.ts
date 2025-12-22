import { PrismaClient } from '@prisma/client';
import logger from './logger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Query: ' + e.query);
    logger.debug('Duration: ' + e.duration + 'ms');
  });
}

prisma.$on('error', (e) => {
  logger.error('Prisma Error: ' + e.message);
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning: ' + e.message);
});

export default prisma;

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✓ Database connected successfully');
  } catch (error) {
    logger.error('✗ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('✓ Database disconnected');
  } catch (error) {
    logger.error('✗ Database disconnection failed:', error);
    throw error;
  }
};
