import prisma from '../config/database';
import { JokeWithRelations } from '../models/Joke.model';
import ElasticsearchService from '../services/ElasticsearchService';
import logger from '../config/logger';

/**
 * Repository layer for handling joke-related database operations.
 * Implements the Singleton pattern and interacts directly with Prisma.
 */
export default class JokesRepository {
  private static instance: JokesRepository;

  private readonly DEFAULT_USER_NAME = 'Pedro';
  private readonly DEFAULT_TOPIC_NAME = 'chistes verdes';

  private readonly esService: ElasticsearchService;

  /**
   * Private constructor to enforce Singleton pattern.
   */
  private constructor() {
    this.esService = ElasticsearchService.getInstance();
  }

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
   * Indexes a joke in Elasticsearch.
   * @param {JokeWithRelations} joke - The joke to index
   * @returns {Promise<void>}
   */
  private async indexJoke(joke: JokeWithRelations): Promise<void> {
    try {
      await this.esService.indexJoke(joke.id, {
        text: joke.text,
        source: joke.source || 'custom',
        userId: joke.userId,
        userName: joke.user.name,
        topics: joke.jokeTopics.map(jt => jt.topic.name),
        number: joke.number,
        createdAt: joke.createdAt,
        updatedAt: joke.updatedAt,
      });
    } catch (err) {
      logger.error('Failed to index joke in Elasticsearch:', err);
    }
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

    const jokeWithTopics = await prisma.joke.findUnique({
      where: { id: joke.id },
      include: {
        user: true,
        jokeTopics: {
          include: {
            topic: true,
          },
        },
      },
    });

    if (jokeWithTopics) {
      await this.indexJoke(jokeWithTopics);
    }

    return joke;
  }

  /**
   * Deletes a joke by its number.
   * @param {number} number - The joke number to delete
   * @returns {Promise<boolean>} True if joke was deleted, false if not found
   */
  async deleteJoke(number: number): Promise<boolean> {
    const joke = await prisma.joke.findUnique({
      where: { number },
    });

    if (!joke) {
      return false;
    }

    await prisma.joke.delete({
      where: { id: joke.id },
    });

    const esService = ElasticsearchService.getInstance();
    esService.deleteJoke(joke.id).catch(err =>
      logger.error('Failed to delete joke from Elasticsearch:', err)
    );

    return true;
  }

  /**
   * Gets jokes filtered by userName and/or topicName.
   * @param {string} [userName] - Optional user name to filter by
   * @param {string} [topicName] - Optional topic name to filter by
   * @returns {Promise<JokeWithRelations[]>} Array of jokes with relations
   */
  async getJokes(userName?: string, topicName?: string): Promise<JokeWithRelations[]> {
    const where: any = {};

    if (userName) {
      where.user = {
        name: userName,
      };
    }

    if (topicName) {
      where.jokeTopics = {
        some: {
          topic: {
            name: topicName,
          },
        },
      };
    }

    return await prisma.joke.findMany({
      include: {
        user: true,
        jokeTopics: {
          include: {
            topic: true,
          },
        },
      },
      where,
    });
  }
}
