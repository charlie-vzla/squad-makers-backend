import axios from 'axios';
import { JokesService } from '../../services/jokes/JokesService';
import { JokesRepository } from '../../repositories/jokes/JokesRepository';
import { mockPrismaJoke } from '../../__mocks__/db/jokes/jokes.mock';
import {
  mockChuckNorrisApiResponse,
  mockDadJokeApiResponse,
  mockChuckNorrisJoke,
  mockDadJoke,
} from '../../__mocks__/models/jokes/jokes.mock';

// Mock dependencies
jest.mock('axios');
jest.mock('../../repositories/jokes/JokesRepository');

describe('JokesService', () => {
  let service: JokesService;
  let mockRepositoryInstance: jest.Mocked<JokesRepository>;

  beforeEach(() => {
    // Mock repository instance
    mockRepositoryInstance = {
      getRandomJoke: jest.fn(),
    } as any;

    // Mock the getInstance method
    (JokesRepository.getInstance as jest.Mock) = jest
      .fn()
      .mockReturnValue(mockRepositoryInstance);

    // Get service instance
    service = JokesService.getInstance();

    jest.clearAllMocks();
  });

  describe('getRandomJoke', () => {
    it('should return a random joke from the repository', async () => {
      mockRepositoryInstance.getRandomJoke.mockResolvedValue(mockPrismaJoke);

      const result = await service.getRandomJoke();

      expect(mockRepositoryInstance.getRandomJoke).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result?.id).toBe(mockPrismaJoke.id);
      expect(result?.text).toBe(mockPrismaJoke.text);
      expect(result?.user?.name).toBe(mockPrismaJoke.user.name);
    });

    it('should return null if no jokes exist', async () => {
      mockRepositoryInstance.getRandomJoke.mockResolvedValue(null);

      const result = await service.getRandomJoke();

      expect(result).toBeNull();
    });
  });

  describe('getChuckNorrisJoke', () => {
    it('should fetch a joke from Chuck Norris API', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: mockChuckNorrisApiResponse });

      const result = await service.getChuckNorrisJoke();

      expect(axios.get).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random');
      expect(result).toEqual(mockChuckNorrisJoke);
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
      expect(result).toEqual(mockDadJoke);
    });

    it('should throw error if API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(service.getDadJoke()).rejects.toThrow('Network error');
    });
  });
});
