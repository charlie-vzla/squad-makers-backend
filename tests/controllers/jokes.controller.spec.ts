import { Request, Response } from 'express';
import { mockChuckNorrisJoke, mockDadJoke, mockJokeDTO, mockCreatedJokeDTO } from '../__mocks__/models/jokes/jokes.mock';
import { JokesController } from '../../src/controllers/JokesController';
import JokesService from '../../src/services/JokesService';

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

      const mockDeleteJoke = jest.fn().mockResolvedValueOnce(true);
      (JokesService.getInstance as jest.Mock).mockReturnValue({
        getRandomJoke: jest.fn(),
        getJoke: jest.fn(),
        createJoke: jest.fn(),
        deleteJoke: mockDeleteJoke,
      });

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

      const mockDeleteJoke = jest.fn().mockResolvedValueOnce(false);
      (JokesService.getInstance as jest.Mock).mockReturnValue({
        getRandomJoke: jest.fn(),
        getJoke: jest.fn(),
        createJoke: jest.fn(),
        deleteJoke: mockDeleteJoke,
      });

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

      const mockDeleteJoke = jest.fn().mockRejectedValueOnce(new Error('Service error'));
      (JokesService.getInstance as jest.Mock).mockReturnValue({
        getRandomJoke: jest.fn(),
        getJoke: jest.fn(),
        createJoke: jest.fn(),
        deleteJoke: mockDeleteJoke,
      });

      await expect(controller.deleteJoke(mockRequest, mockResponse as Response)).rejects.toThrow(
        'Service error'
      );
    });
  });
});
