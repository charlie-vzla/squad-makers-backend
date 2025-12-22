import { Request, Response } from 'express';
import { healthCheck } from '../../controllers/healthController';
import prisma from '../../config/database';
import * as elasticsearch from '../../config/elasticsearch';

// Mock the modules
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    $queryRaw: jest.fn(),
  },
}));

jest.mock('../../config/elasticsearch');

describe('Health Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('healthCheck', () => {
    it('should return healthy status when all services are connected', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);
      (elasticsearch.checkElasticsearchHealth as jest.Mock).mockResolvedValue(true);

      await healthCheck(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'healthy',
          services: {
            database: 'connected',
            elasticsearch: 'connected',
          },
        })
      );
    });

    it('should return unhealthy status when database is disconnected', async () => {
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error('Database error'));

      (elasticsearch.checkElasticsearchHealth as jest.Mock).mockResolvedValue(true);

      await healthCheck(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(503);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'unhealthy',
          services: {
            database: 'disconnected',
            elasticsearch: 'connected',
          },
        })
      );
    });

    it('should return unhealthy status when Elasticsearch is disconnected', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);
      (elasticsearch.checkElasticsearchHealth as jest.Mock).mockResolvedValue(false);

      await healthCheck(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(503);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'unhealthy',
          services: {
            database: 'connected',
            elasticsearch: 'disconnected',
          },
        })
      );
    });

    it('should include timestamp, uptime, and version in response', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);
      (elasticsearch.checkElasticsearchHealth as jest.Mock).mockResolvedValue(true);

      await healthCheck(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
          uptime: expect.any(Number),
          version: expect.any(String),
        })
      );
    });
  });
});
