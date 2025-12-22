import app from './app';
import { env } from './config/env';
import logger from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectElasticsearch, initializeJokesIndex } from './config/elasticsearch';

const PORT = env.PORT || 3000;

let server: ReturnType<typeof app.listen>;

const startServer = async (): Promise<void> => {
  try {
    // Validate environment variables
    logger.info('Validating environment variables...');

    // Connect to database
    logger.info('Connecting to database...');
    await connectDatabase();

    // Connect to Elasticsearch
    logger.info('Connecting to Elasticsearch...');
    await connectElasticsearch();

    // Initialize Elasticsearch indices
    logger.info('Initializing Elasticsearch indices...');
    await initializeJokesIndex();

    // Start Express server
    server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📚 Environment: ${env.NODE_ENV}`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await disconnectDatabase();
        logger.info('✅ Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
