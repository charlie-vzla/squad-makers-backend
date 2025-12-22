import JokesRepository from '../../src/repositories/JokesRepository';
import prisma from '../../src/config/database';
import { mockPrismaJoke, mockCreatedPrismaJoke } from '../__mocks__/db/jokes/jokes.mock';

jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    joke: {
      count: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    jokeTopic: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    topic: {
      findUnique: jest.fn(),
    },
  },
}));

describe('JokesRepository', () => {
  let repository: JokesRepository;

  beforeEach(() => {
    // Reset singleton
    (JokesRepository as any).instance = undefined;
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

    it('should return undefined if findMany returns empty array', async () => {
      (prisma.joke.count as jest.Mock).mockResolvedValue(10);
      (prisma.joke.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.getRandomJoke();

      expect(result).toBeUndefined();
    });
  });

  describe('createJoke', () => {
    it('should create a joke with provided userName and topicName', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user1', name: 'Manolito' });
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue({ id: 'topic1', name: 'humor negro' });
      (prisma.joke.create as jest.Mock).mockResolvedValue(mockCreatedPrismaJoke);

      const result = await repository.createJoke('This is a newly created joke', 'Manolito', 'humor negro');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { name: 'Manolito' } });
      expect(prisma.topic.findUnique).toHaveBeenCalledWith({ where: { name: 'humor negro' } });
      expect(result).toBeDefined();
      expect(result.number).toBe(42);
    });

    it('should use default userName when not provided', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-pedro', name: 'Pedro' });
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue({ id: 'topic1', name: 'humor negro' });
      (prisma.joke.create as jest.Mock).mockResolvedValue(mockCreatedPrismaJoke);

      await repository.createJoke('Another joke', undefined, 'humor negro');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { name: 'Pedro' } });
    });

    it('should use default topicName when not provided', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user1', name: 'Manolito' });
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue({ id: 'topic-verdes', name: 'chistes verdes' });
      (prisma.joke.create as jest.Mock).mockResolvedValue(mockCreatedPrismaJoke);

      await repository.createJoke('Another joke', 'Manolito', undefined);

      expect(prisma.topic.findUnique).toHaveBeenCalledWith({ where: { name: 'chistes verdes' } });
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(repository.createJoke('Failed joke', 'NonExistent', 'humor negro')).rejects.toThrow(
        "User 'NonExistent' not found"
      );
    });

    it('should throw error if topic not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user1', name: 'Manolito' });
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(repository.createJoke('Failed joke', 'Manolito', 'NonExistent')).rejects.toThrow(
        "Topic 'NonExistent' not found"
      );
    });
  });

  describe('deleteJoke', () => {
    it('should delete a joke by number', async () => {
      (prisma.joke.findUnique as jest.Mock).mockResolvedValue(mockPrismaJoke);
      (prisma.joke.delete as jest.Mock).mockResolvedValue(mockPrismaJoke);

      const result = await repository.deleteJoke(1);

      expect(prisma.joke.findUnique).toHaveBeenCalledWith({ where: { number: 1 } });
      expect(prisma.joke.delete).toHaveBeenCalledWith({ where: { id: mockPrismaJoke.id } });
      expect(result).toBe(true);
    });

    it('should return false when joke not found', async () => {
      (prisma.joke.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.deleteJoke(999);

      expect(prisma.joke.findUnique).toHaveBeenCalledWith({ where: { number: 999 } });
      expect(prisma.joke.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
