import axios from 'axios';
import { mockPrismaJoke } from '../__mocks__/db/jokes/jokes.mock';
import {
  mockChuckNorrisApiResponse,
  mockChuckNorrisJoke,
  mockDadJoke,
  mockDadJokeApiResponse,
} from '../__mocks__/models/jokes/jokes.mock';
import JokesService from '../../src/services/JokesService';

jest.mock('axios');

const mockGetRandomJoke = jest.fn();
jest.mock('../../src/repositories/JokesRepository', () => ({
  __esModule: true,
  default: class {
    static getInstance() {
      return {
        getRandomJoke: mockGetRandomJoke,
      };
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
});
