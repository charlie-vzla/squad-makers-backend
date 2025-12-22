import axios from 'axios';
import JokesService from '../../src/services/JokesService';
import { mockCreatedPrismaJoke, mockPrismaJoke } from '../__mocks__/db/jokes/jokes.mock';
import {
  mockChuckNorrisApiResponse,
  mockChuckNorrisJoke,
  mockDadJoke,
  mockDadJokeApiResponse
} from '../__mocks__/models/jokes/jokes.mock';

jest.mock('axios');

const mockGetRandomJoke = jest.fn();
const mockCreateJoke = jest.fn();
const mockDeleteJoke = jest.fn();
const mockGetJokes = jest.fn();

const mockRepository = {
  getRandomJoke: mockGetRandomJoke,
  createJoke: mockCreateJoke,
  deleteJoke: mockDeleteJoke,
  getJokes: mockGetJokes,
};

jest.mock('../../src/repositories/JokesRepository', () => ({
  __esModule: true,
  default: class {
    static getInstance() {
      return mockRepository;
    }
  },
}));

describe('JokesService', () => {
  let service: JokesService;

  beforeEach(() => {
    // Reset singleton
    (JokesService as any).instance = undefined;
    service = JokesService.getInstance();
    jest.clearAllMocks();
  });

  describe('getRandomJoke', () => {
    it('should return a random joke from the repository', async () => {
      mockGetRandomJoke.mockResolvedValueOnce(mockPrismaJoke);

      const result = await service.getRandomJoke();

      expect(mockGetRandomJoke).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result?.id).toBe(mockPrismaJoke.id);
      expect(result?.text).toBe(mockPrismaJoke.text);
      expect(result?.user?.name).toBe(mockPrismaJoke.user.name);
    });

    it('should return null if no jokes exist', async () => {
      mockGetRandomJoke.mockResolvedValueOnce(null);

      const result = await service.getRandomJoke();

      expect(result).toBeNull();
    });
  });

  describe('getChuckNorrisJoke', () => {
    it('should fetch a joke from Chuck Norris API', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: mockChuckNorrisApiResponse });

      const result = await service.getChuckNorrisJoke();

      expect(axios.get).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random');
      expect(result).toEqual(mockChuckNorrisJoke.text);
    });

    it('should throw error if API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(service.getChuckNorrisJoke()).rejects.toThrow('Network error');
    });
  });

  describe('getDadJoke', () => {
    it('should fetch a joke from Dad Jokes API', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: mockDadJokeApiResponse });

      const result = await service.getDadJoke();

      expect(axios.get).toHaveBeenCalledWith('https://icanhazdadjoke.com', {
        headers: { Accept: 'application/json' },
      });
      expect(result).toEqual(mockDadJoke.text);
    });

    it('should throw error if API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(service.getDadJoke()).rejects.toThrow('Network error');
    });
  });

  describe('createJoke', () => {
    it('should create a joke with provided userName and topicName', async () => {
      mockCreateJoke.mockResolvedValueOnce(mockCreatedPrismaJoke);

      const result = await service.createJoke('This is a newly created joke', 'Manolito', 'humor negro');

      expect(mockCreateJoke).toHaveBeenCalledWith('This is a newly created joke', 'Manolito', 'humor negro');
      expect(result).toBeDefined();
      expect(result.id).toBe(mockCreatedPrismaJoke.id);
      expect(result.text).toBe(mockCreatedPrismaJoke.text);
      expect(result.number).toBe(42);
    });

    it('should create a joke without userName and topicName', async () => {
      mockCreateJoke.mockResolvedValueOnce(mockCreatedPrismaJoke);

      const result = await service.createJoke('This is a newly created joke', undefined, undefined);

      expect(mockCreateJoke).toHaveBeenCalledWith(
        'This is a newly created joke',
        undefined,
        undefined
      );
      expect(result.number).toBe(42);
    });

    it('should throw error if repository fails', async () => {
      mockCreateJoke.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.createJoke('This is a newly created joke', 'user1', 'topic1')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('deleteJoke', () => {
    it('should delete a joke by number', async () => {
      mockDeleteJoke.mockResolvedValueOnce(true)

      const result = await service.deleteJoke(1);

      expect(mockDeleteJoke).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should return false when joke not found', async () => {
      mockDeleteJoke.mockResolvedValueOnce(false);

      const result = await service.deleteJoke(999);

      expect(mockDeleteJoke).toHaveBeenCalledWith(999);
      expect(result).toBe(false);
    });

    it('should throw error when repository fails', async () => {
      mockDeleteJoke.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.deleteJoke(1)).rejects.toThrow('Database error');
    });
  });

  describe('getJokes', () => {
    it('should return all jokes when no filters provided', async () => {
      mockGetJokes.mockResolvedValueOnce([mockPrismaJoke]);

      const result = await service.getJokes();

      expect(mockGetJokes).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockPrismaJoke.id);
    });

    it('should pass userName as-is (already transformed by validator)', async () => {
      mockGetJokes.mockResolvedValueOnce([mockPrismaJoke]);

      await service.getJokes('Manolito');

      expect(mockGetJokes).toHaveBeenCalledWith('Manolito', undefined);
    });

    it('should pass topicName as-is (already transformed by validator)', async () => {
      mockGetJokes.mockResolvedValueOnce([mockPrismaJoke]);

      await service.getJokes(undefined, 'humor negro');

      expect(mockGetJokes).toHaveBeenCalledWith(undefined, 'humor negro');
    });

    it('should pass both filters through', async () => {
      mockGetJokes.mockResolvedValueOnce([mockPrismaJoke]);

      await service.getJokes('Manolito', 'humor negro');

      expect(mockGetJokes).toHaveBeenCalledWith('Manolito', 'humor negro');
    });

    it('should return empty array when no jokes found', async () => {
      mockGetJokes.mockResolvedValueOnce([]);

      const result = await service.getJokes('NonExistent');

      expect(result).toHaveLength(0);
    });

    it('should throw error when repository fails', async () => {
      mockGetJokes.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getJokes()).rejects.toThrow('Database error');
    });
  });
});
