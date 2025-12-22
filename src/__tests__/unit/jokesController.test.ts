import { Request, Response } from 'express';
import { JokesController } from '../../controllers/jokes/JokesController';
import { JokesService } from '../../services/jokes/JokesService';
import { mockJokeDTO, mockChuckNorrisJoke, mockDadJoke } from '../../__mocks__/models/jokes/jokes.mock';

// Mock the service
jest.mock('../../services/jokes/JokesService');

describe('JokesController - GET /api/jokes/:source?', () => {
  let controller: JokesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let mockServiceInstance: jest.Mocked<JokesService>;

  beforeEach(() => {
    // Clear all mocks first
    jest.clearAllMocks();

    // Setup response mocks
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    // Mock service instance
    mockServiceInstance = {
      getRandomJoke: jest.fn(),
      getChuckNorrisJoke: jest.fn(),
      getDadJoke: jest.fn(),
    } as any;

    // Mock the getInstance method to return our mock
    jest.spyOn(JokesService, 'getInstance').mockReturnValue(mockServiceInstance);

    // Clear the controller singleton to force re-instantiation
    (JokesController as any).instance = undefined;

    // Get controller instance (will use mocked service)
    controller = JokesController.getInstance();
  });

  describe('GET /api/jokes (no path param)', () => {
    it('should return a random joke from the database', async () => {
      mockRequest = {
        params: {},
      };

      mockServiceInstance.getRandomJoke.mockResolvedValue(mockJokeDTO);

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(mockServiceInstance.getRandomJoke).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockJokeDTO,
      });
    });

    it('should return 404 if no jokes exist in database', async () => {
      mockRequest = {
        params: {},
      };

      mockServiceInstance.getRandomJoke.mockResolvedValue(null);

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'No jokes found in database',
      });
    });
  });

  describe('GET /api/jokes/Chuck', () => {
    it('should return a joke from Chuck Norris API', async () => {
      mockRequest = {
        params: { source: 'Chuck' },
      };

      mockServiceInstance.getChuckNorrisJoke.mockResolvedValue(mockChuckNorrisJoke);

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(mockServiceInstance.getChuckNorrisJoke).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockChuckNorrisJoke,
      });
    });

    it('should handle errors from Chuck Norris API', async () => {
      mockRequest = {
        params: { source: 'Chuck' },
      };

      mockServiceInstance.getChuckNorrisJoke.mockRejectedValue(
        new Error('External API error')
      );

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch joke from external API',
      });
    });
  });

  describe('GET /api/jokes/Dad', () => {
    it('should return a joke from Dad Jokes API', async () => {
      mockRequest = {
        params: { source: 'Dad' },
      };

      mockServiceInstance.getDadJoke.mockResolvedValue(mockDadJoke);

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(mockServiceInstance.getDadJoke).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockDadJoke,
      });
    });

    it('should handle errors from Dad Jokes API', async () => {
      mockRequest = {
        params: { source: 'Dad' },
      };

      mockServiceInstance.getDadJoke.mockRejectedValue(
        new Error('External API error')
      );

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch joke from external API',
      });
    });
  });

  describe('GET /api/jokes/:source with invalid source', () => {
    it('should return 400 error for invalid source', async () => {
      mockRequest = {
        params: { source: 'InvalidSource' },
      };

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid source. Allowed values: Chuck, Dad',
      });
    });

    it('should treat empty string source as no source and return random joke', async () => {
      mockRequest = {
        params: { source: '' },
      };

      mockServiceInstance.getRandomJoke.mockResolvedValue(mockJokeDTO);

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(mockServiceInstance.getRandomJoke).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockJokeDTO,
      });
    });

    it('should return 400 error for lowercase "chuck"', async () => {
      mockRequest = {
        params: { source: 'chuck' },
      };

      await controller.getJoke(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid source. Allowed values: Chuck, Dad',
      });
    });
  });
});
