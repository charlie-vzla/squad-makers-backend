import axios, { AxiosResponse } from 'axios';
import { ChuckJokeResponseInterface } from 'interfaces/ChuckJokes/ChuckJokeResponseInterface';
import { DadJokeResponseInterface } from 'interfaces/DadJokes/DadJokeResponseInterface';
import { env } from '../config/env';
import logger from '../config/logger';
import {
  JokeDTO,
  JokeMapper
} from '../models/Joke.model';
import JokesRepository from '../repositories/JokesRepository';

/**
 * Service layer for handling joke-related business logic.
 * Implements the Singleton pattern and coordinates between repository and external APIs.
 */
export default class JokesService {
  private static instance: JokesService;

  private readonly repository: JokesRepository;

  /**
   * Private constructor to enforce Singleton pattern.
   */
  private constructor() {
    this.repository = JokesRepository.getInstance();
  }

  /**
   * Gets the singleton instance of JokesService.
   * @returns {JokesService} The singleton instance
   */
  static getInstance(): JokesService {
    if (!JokesService.instance) {
      JokesService.instance = new JokesService();
    }
    return JokesService.instance;
  }

  /**
   * Retrieves a random joke from the database.
   * @returns {Promise<JokeDTO | null>} A random joke DTO or null if no jokes exist
   * @throws {Error} If there's an error fetching from the database
   */
  async getRandomJoke(): Promise<JokeDTO | null> {
    try {
      const joke = await this.repository.getRandomJoke();

      if (!joke) {
        return null;
      }

      return JokeMapper.toDTO(joke);
    } catch (error) {
      logger.error('Error fetching random joke from database:', error);
      throw error;
    }
  }

  /**
   * Fetches a random Chuck Norris joke from the external API.
   * @returns {Promise<string>} The joke text from Chuck Norris API
   * @throws {Error} If the API request fails
   */
  async getChuckNorrisJoke(): Promise<string> {
    try {
      const response: AxiosResponse<ChuckJokeResponseInterface> = await axios.get(`${env.CHUCK_NORRIS_API_URL}/jokes/random`);

      return response.data.value;
    } catch (error) {
      logger.error('Error fetching Chuck Norris joke:', error);
      throw error;
    }
  }

  /**
   * Fetches a random Dad joke from the external API.
   * @returns {Promise<string>} The joke text from Dad Jokes API
   * @throws {Error} If the API request fails
   */
  async getDadJoke(): Promise<string> {
    try {
      const response: AxiosResponse<DadJokeResponseInterface> = await axios.get(`${env.DAD_JOKE_API_URL}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      return response.data.joke;
    } catch (error) {
      logger.error('Error fetching Dad joke:', error);
      throw error;
    }
  }

  /**
   * Creates a new joke in the database.
   * @param {string} text - The joke text
   * @param {string} [userName] - Optional user name (defaults to Pedro)
   * @param {string} [topicName] - Optional topic name (defaults to chistes verdes)
   * @returns {Promise<JokeDTO>} The created joke DTO
   * @throws {Error} If database operation fails
   */
  async createJoke(text: string, userName?: string, topicName?: string): Promise<JokeDTO> {
    try {
      const joke = await this.repository.createJoke(text, userName, topicName);

      return JokeMapper.toDTO(joke);
    } catch (error) {
      logger.error('Error creating joke:', error);
      throw error;
    }
  }
}
