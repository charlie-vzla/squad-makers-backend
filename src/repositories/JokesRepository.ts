import prisma from '../config/database';
import { JokeWithRelations } from '../models/Joke.model';

/**
 * Repository layer for handling joke-related database operations.
 * Implements the Singleton pattern and interacts directly with Prisma.
 */
export default class JokesRepository {
  private static instance: JokesRepository;

  private readonly DEFAULT_USER_NAME = 'Pedro';
  private readonly DEFAULT_TOPIC_NAME = 'chistes verdes';

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

  /**
   * Creates a new joke in the database and associates it with a topic.
   * @param {string} text - The joke text
   * @param {string} [userName] - Optional user name (defaults to Pedro)
   * @param {string} [topicName] - Optional topic name (defaults to chistes verdes)
   * @returns {Promise<JokeWithRelations>} The created joke with all relations
   */
  async createJoke(text: string, userName?: string, topicName?: string): Promise<JokeWithRelations> {
    const finalUserName = userName || this.DEFAULT_USER_NAME;
    const finalTopicName = topicName || this.DEFAULT_TOPIC_NAME;

    const user = await prisma.user.findUnique({
      where: { name: finalUserName },
    });

    if (!user) {
      throw new Error(`User '${finalUserName}' not found`);
    }

    const topic = await prisma.topic.findUnique({
      where: { name: finalTopicName },
    });

    if (!topic) {
      throw new Error(`Topic '${finalTopicName}' not found`);
    }

    const joke = await prisma.joke.create({
      data: {
        text,
        source: 'custom',
        userId: user.id,
      },
      include: {
        user: true,
        jokeTopics: {
          include: {
            topic: true,
          },
        },
      },
    });

    await prisma.jokeTopic.create({
      data: {
        jokeId: joke.id,
        topicId: topic.id,
      },
    });

    return joke;
  }
}
