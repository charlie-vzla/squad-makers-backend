import { JokesRepository } from '../../repositories/jokes/JokesRepository';
import prisma from '../../config/database';
import { mockPrismaJoke } from '../../__mocks__/db/jokes/jokes.mock';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    joke: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('JokesRepository', () => {
  let repository: JokesRepository;

  beforeEach(() => {
    repository = JokesRepository.getInstance();
    jest.clearAllMocks();
  });

  describe('getRandomJoke', () => {
    it('should return a random joke from the database', async () => {
      (prisma.joke.count as jest.Mock).mockResolvedValue(10);
      (prisma.joke.findMany as jest.Mock).mockResolvedValue([mockPrismaJoke]);

      const result = await repository.getRandomJoke();

      expect(prisma.joke.count).toHaveBeenCalledTimes(1);
      expect(prisma.joke.findMany).toHaveBeenCalledWith({
        take: 1,
        skip: expect.any(Number),
        include: {
          user: true,
          jokeTopics: {
            include: {
              topic: true,
            },
          },
        },
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe(mockPrismaJoke.id);
    });

    it('should return null if no jokes exist in database', async () => {
      (prisma.joke.count as jest.Mock).mockResolvedValue(0);

      const result = await repository.getRandomJoke();

      expect(prisma.joke.count).toHaveBeenCalledTimes(1);
      expect(prisma.joke.findMany).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null if findMany returns empty array', async () => {
      (prisma.joke.count as jest.Mock).mockResolvedValue(10);
      (prisma.joke.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.getRandomJoke();

      expect(result).toBeNull();
    });
  });
});
