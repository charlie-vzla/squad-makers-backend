import { JokeWithRelations } from '../../../models/jokes/Joke.model';

export const mockPrismaJoke: JokeWithRelations = {
  id: '123',
  text: 'This is a random joke from DB',
  source: 'custom',
  number: 1,
  userId: 'user1',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  user: {
    id: 'user1',
    name: 'Manolito',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  },
  jokeTopics: [
    {
      topic: {
        id: 'topic1',
        name: 'humor negro',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      },
    },
  ] as any,
};

export const mockPrismaJokes: JokeWithRelations[] = [mockPrismaJoke];
