import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Test API',
      version: '1.0.0',
      description:
        'REST API for jokes management with external API integration (Chuck Norris, Dad Jokes) and mathematical operations',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Jokes',
        description: 'Jokes management endpoints',
      },
      {
        name: 'Math',
        description: 'Mathematical operations endpoints',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Joke: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            text: {
              type: 'string',
            },
            source: {
              type: 'string',
              enum: ['Chuck', 'Dad', 'custom'],
              nullable: true,
            },
            number: {
              type: 'integer',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                },
              },
            },
            topics: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy'],
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            uptime: {
              type: 'number',
            },
            services: {
              type: 'object',
              properties: {
                database: {
                  type: 'string',
                  enum: ['connected', 'disconnected'],
                },
                elasticsearch: {
                  type: 'string',
                  enum: ['connected', 'disconnected'],
                },
              },
            },
            version: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
