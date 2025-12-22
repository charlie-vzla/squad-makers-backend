import { Request, Response } from 'express';
import { mockChuckNorrisJoke, mockDadJoke, mockJokeDTO, mockCreatedJokeDTO } from '../__mocks__/models/jokes/jokes.mock';
import { JokesController } from '../../src/controllers/JokesController';

const mockGetRandomJoke = jest.fn();
const mockGetChuckNorrisJoke = jest.fn();
const mockGetDadJoke = jest.fn();
const mockCreateJoke = jest.fn();
const mockDeleteJoke = jest.fn();
const mockGetJokes = jest.fn();
const mockGetPairedJokes = jest.fn();

jest.mock('../../src/services/JokesService', () => ({
  __esModule: true,
  default: class {
    static getInstance() {
      return {
        getRandomJoke: mockGetRandomJoke,
        getChuckNorrisJoke: mockGetChuckNorrisJoke,
        getDadJoke: mockGetDadJoke,
        createJoke: mockCreateJoke,
        deleteJoke: mockDeleteJoke,
        getJokes: mockGetJokes,
        getPairedJokes: mockGetPairedJokes,
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
    it('should create a joke with text, userName, and topicName', async () => {
      const mockRequest = {
        body: {
          text: 'This is a newly created joke',
          userName: 'Manolito',
          topicName: 'humor negro',
        },
      } as Request;

      mockCreateJoke.mockResolvedValueOnce(mockCreatedJokeDTO);

      await controller.createJoke(mockRequest, mockResponse as Response);

      expect(mockCreateJoke).toHaveBeenCalledWith(
        'This is a newly created joke',
        'Manolito',
        'humor negro'
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

  describe('deleteJoke', () => {
    it('should delete a joke by number', async () => {
      const mockRequest = {
        params: { number: '1' },
      } as unknown as Request;

      mockDeleteJoke.mockResolvedValueOnce(true);

      await controller.deleteJoke(mockRequest, mockResponse as Response);

      expect(mockDeleteJoke).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Joke deleted successfully',
      });
    });

    it('should return 404 when joke not found', async () => {
      const mockRequest = {
        params: { number: '999' },
      } as unknown as Request;

      mockDeleteJoke.mockResolvedValueOnce(false);

      await controller.deleteJoke(mockRequest, mockResponse as Response);

      expect(mockDeleteJoke).toHaveBeenCalledWith(999);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Joke not found',
      });
    });

    it('should throw error when service fails', async () => {
      const mockRequest = {
        params: { number: '1' },
      } as unknown as Request;

      mockDeleteJoke.mockRejectedValueOnce(new Error('Service error'));

      await expect(controller.deleteJoke(mockRequest, mockResponse as Response)).rejects.toThrow(
        'Service error'
      );
    });
  });

  describe('getJokes', () => {
    it('should return all jokes when no filters provided', async () => {
      const mockRequest = {
        query: {},
      } as unknown as Request;

      mockGetJokes.mockResolvedValueOnce([mockJokeDTO]);

      await controller.getJokes(mockRequest, mockResponse as Response);

      expect(mockGetJokes).toHaveBeenCalledWith(undefined, undefined);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: [mockJokeDTO],
      });
    });

    it('should filter jokes by userName', async () => {
      const mockRequest = {
        query: { userName: 'Manolito' },
      } as unknown as Request;

      mockGetJokes.mockResolvedValueOnce([mockJokeDTO]);

      await controller.getJokes(mockRequest, mockResponse as Response);

      expect(mockGetJokes).toHaveBeenCalledWith('Manolito', undefined);
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('should filter jokes by topicName', async () => {
      const mockRequest = {
        query: { topicName: 'humor negro' },
      } as unknown as Request;

      mockGetJokes.mockResolvedValueOnce([mockJokeDTO]);

      await controller.getJokes(mockRequest, mockResponse as Response);

      expect(mockGetJokes).toHaveBeenCalledWith(undefined, 'humor negro');
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('should filter jokes by both userName and topicName', async () => {
      const mockRequest = {
        query: { userName: 'Manolito', topicName: 'humor negro' },
      } as unknown as Request;

      mockGetJokes.mockResolvedValueOnce([mockJokeDTO]);

      await controller.getJokes(mockRequest, mockResponse as Response);

      expect(mockGetJokes).toHaveBeenCalledWith('Manolito', 'humor negro');
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('should return empty array when no jokes found', async () => {
      const mockRequest = {
        query: { userName: 'NonExistent' },
      } as unknown as Request;

      mockGetJokes.mockResolvedValueOnce([]);

      await controller.getJokes(mockRequest, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });

    it('should throw error when service fails', async () => {
      const mockRequest = {
        query: {},
      } as unknown as Request;

      mockGetJokes.mockRejectedValueOnce(new Error('Service error'));

      await expect(controller.getJokes(mockRequest, mockResponse as Response)).rejects.toThrow(
        'Service error'
      );
    });
  });

  describe('getPairedJokes', () => {
    it('should return 5 paired jokes', async () => {
      const mockRequest = {} as Request;

      const mockPairedJokes = [
        {
          chuck: 'Chuck Norris counted to infinity. Twice.',
          dad: 'Why did the math book look sad? Because it had too many problems.',
          combinado: 'Chuck Norris counted to infinity. Also, the math book had too many problems.',
        },
      ];

      mockGetPairedJokes.mockResolvedValueOnce(mockPairedJokes);

      await controller.getPairedJokes(mockRequest, mockResponse as Response);

      expect(mockGetPairedJokes).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockPairedJokes,
      });
    });

    it('should return exactly 5 paired jokes', async () => {
      const mockRequest = {} as Request;

      const mockPairedJokes = Array(5).fill(null).map((_, i) => ({
        chuck: `Chuck joke ${i + 1}`,
        dad: `Dad joke ${i + 1}`,
        combinado: `Combined joke ${i + 1}`,
      }));

      mockGetPairedJokes.mockResolvedValueOnce(mockPairedJokes);

      await controller.getPairedJokes(mockRequest, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            chuck: expect.any(String),
            dad: expect.any(String),
            combinado: expect.any(String),
          }),
        ]),
      });
    });

    it('should return 404 when no jokes could be retrieved', async () => {
      const mockRequest = {} as Request;

      mockGetPairedJokes.mockRejectedValueOnce(new Error('No jokes could be retrieved from APIs'));

      await controller.getPairedJokes(mockRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Could not retrieve any jokes from external APIs',
      });
    });

    it('should throw error when service fails with other errors', async () => {
      const mockRequest = {} as Request;

      mockGetPairedJokes.mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(controller.getPairedJokes(mockRequest, mockResponse as Response)).rejects.toThrow(
        'Unexpected error'
      );
    });
  });
});
