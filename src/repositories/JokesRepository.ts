import prisma from '../config/database';
import { JokeWithRelations } from '../models/Joke.model';

/**
 * Repository layer for handling joke-related database operations.
 * Implements the Singleton pattern and interacts directly with Prisma.
 */
export default class JokesRepository {
  private static instance: JokesRepository;

  /**
   * Private constructor to enforce Singleton pattern.
   */
  private constructor() {}

  /**
   * Gets the singleton instance of JokesRepository.
   * @returns {JokesRepository} The singleton instance
   */
  static getInstance(): JokesRepository {
    if (!JokesRepository.instance) {
      JokesRepository.instance = new JokesRepository();
    }
    return JokesRepository.instance;
  }

  /**
   * Retrieves a random joke from the database with all relations.
   * @returns {Promise<JokeWithRelations | null>} A random joke with user and topics, or null if no jokes exist
   */
  async getRandomJoke(): Promise<JokeWithRelations | null> {
    const count = await prisma.joke.count();

    if (!count) {
      return null;
    }

    const skip = Math.floor(Math.random() * count);

    const jokes = await prisma.joke.findMany({
      take: 1,
      skip,
      include: {
        user: true,
        jokeTopics: {
          include: {
            topic: true,
          },
        },
      },
    });

    return jokes[0];
  }
}
