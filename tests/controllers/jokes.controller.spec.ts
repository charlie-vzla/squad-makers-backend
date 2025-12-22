import { Request, Response } from 'express';
import { mockChuckNorrisJoke, mockDadJoke, mockJokeDTO, mockCreatedJokeDTO } from '../__mocks__/models/jokes/jokes.mock';
import { JokesController } from '../../src/controllers/JokesController';

const mockGetRandomJoke = jest.fn();
const mockGetChuckNorrisJoke = jest.fn();
const mockGetDadJoke = jest.fn();
const mockCreateJoke = jest.fn();

jest.mock('../../src/services/JokesService', () => ({
  __esModule: true,
  default: class {
    static getInstance() {
      return {
        getRandomJoke: mockGetRandomJoke,
        getChuckNorrisJoke: mockGetChuckNorrisJoke,
        getDadJoke: mockGetDadJoke,
        createJoke: mockCreateJoke,
      };
    }
  },
}));

describe('JokesController', () => {
  let controller: JokesController;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    // Reset singleton
    (JokesController as any).instance = undefined;
    controller = JokesController.getInstance();
  });

  describe('getRandomJoke', () => {
    it('should return a random joke from the database', async () => {
      mockGetRandomJoke.mockResolvedValueOnce(mockJokeDTO);
      await controller.getRandomJoke({} as Request, mockResponse as Response);

      expect(mockGetRandomJoke).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { joke: mockJokeDTO.text },
      });
    });

    it('should return 404 if no jokes exist in database', async () => {
      mockGetRandomJoke.mockResolvedValueOnce(null);

      await controller.getRandomJoke({} as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'No jokes found in database',
      });
    });
  });

  describe('getJoke - Chuck Norris', () => {
    it('should return a joke from Chuck Norris API', async () => {
      mockGetChuckNorrisJoke.mockResolvedValueOnce(mockChuckNorrisJoke.text);

      await controller.getJoke('Chuck', mockResponse as Response);

      expect(mockGetChuckNorrisJoke).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { joke: mockChuckNorrisJoke.text },
      });
    });

    it('should throw error when Chuck Norris API fails', async () => {
      mockGetChuckNorrisJoke.mockRejectedValueOnce(new Error('External API error'));

      await expect(
        controller.getJoke('Chuck', mockResponse as Response)
      ).rejects.toThrow('External API error');
    });
  });

  describe('getJoke - Dad Jokes', () => {
    it('should return a joke from Dad Jokes API', async () => {
      mockGetDadJoke.mockResolvedValueOnce(mockDadJoke.text);
      await controller.getJoke('Dad', mockResponse as Response);

      expect(mockGetDadJoke).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { joke: mockDadJoke.text },
      });
    });

    it('should throw error when Dad Jokes API fails', async () => {
      mockGetDadJoke.mockRejectedValueOnce(new Error('External API error'));

      await expect(
        controller.getJoke('Dad', mockResponse as Response)
      ).rejects.toThrow('External API error');
    });
  });

  describe('createJoke', () => {
    it('should create a joke with text, userId, and topicId', async () => {
      const mockRequest = {
        body: {
          text: 'This is a newly created joke',
          userId: 'user1',
          topicId: 'topic1',
        },
      } as Request;

      mockCreateJoke.mockResolvedValueOnce(mockCreatedJokeDTO);

      await controller.createJoke(mockRequest, mockResponse as Response);

      expect(mockCreateJoke).toHaveBeenCalledWith(
        'This is a newly created joke',
        'user1',
        'topic1'
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { number: 42 },
      });
    });

    it('should create a joke with only text (using defaults)', async () => {
      const mockRequest = {
        body: {
          text: 'This is a newly created joke',
        },
      } as Request;

      mockCreateJoke.mockResolvedValueOnce(mockCreatedJokeDTO);

      await controller.createJoke(mockRequest, mockResponse as Response);

      expect(mockCreateJoke).toHaveBeenCalledWith('This is a newly created joke', undefined, undefined);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { number: 42 },
      });
    });

    it('should throw error when service fails', async () => {
      const mockRequest = {
        body: {
          text: 'This is a newly created joke',
        },
      } as Request;

      mockCreateJoke.mockRejectedValueOnce(new Error('Database error'));

      await expect(controller.createJoke(mockRequest, mockResponse as Response)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
