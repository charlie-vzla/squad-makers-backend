import { Request, Response } from 'express';
import prisma from '../config/database';
import { checkElasticsearchHealth } from '../config/elasticsearch';
import { HealthCheckResponse } from '../types';
import logger from '../config/logger';

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the application and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health check successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: Service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    let databaseStatus: 'connected' | 'disconnected' = 'disconnected';
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'connected';
    } catch (error) {
      logger.error('Database health check failed:', error);
    }

    const elasticsearchStatus = (await checkElasticsearchHealth())
      ? 'connected'
      : 'disconnected';

    const allServicesHealthy =
      databaseStatus === 'connected' && elasticsearchStatus === 'connected';

    const response: HealthCheckResponse = {
      status: allServicesHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: databaseStatus,
        elasticsearch: elasticsearchStatus,
      },
      version: process.env.npm_package_version || '1.0.0',
    };

    const statusCode = allServicesHealthy ? 200 : 503;
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Health check failed:', error);

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'disconnected',
        elasticsearch: 'disconnected',
      },
      version: process.env.npm_package_version || '1.0.0',
    });
  }
};
