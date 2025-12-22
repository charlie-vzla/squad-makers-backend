import { Request, Response } from 'express';
import JokesService from '../services/JokesService';

/**
 * Controller for handling joke-related HTTP requests.
 * Implements the Singleton pattern to ensure only one instance exists.
 */
export class JokesController {
  private static instance: JokesController;
  private readonly service: JokesService;

  /**
   * Private constructor to enforce Singleton pattern.
   */
  private constructor() {
    this.service = JokesService.getInstance();
  }

  /**
   * Gets the singleton instance of JokesController.
   * @returns {JokesController} The singleton instance
   */
  public static getInstance(): JokesController {
    if (!JokesController.instance) {
      JokesController.instance = new JokesController();
    }
    return JokesController.instance;
  }

  /**
   * Handles GET /api/jokes request to retrieve a random joke from the database.
   * @param {Request} _req - Express request object (unused)
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getRandomJoke(_req: Request, res: Response): Promise<void> {
    const joke = await this.service.getRandomJoke();

    if (!joke) {
      res.status(404).json({
        success: false,
        message: 'No jokes found in database',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { joke: joke.text },
    });
  }

  /**
   * Handles GET /api/jokes/:source request to retrieve a joke from an external API.
   * @param {string} source - The joke source ('Chuck' or 'Dad')
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getJoke(source: string, res: Response): Promise<void> {
    let joke: string;

    if (source === 'Chuck') {
      joke = await this.service.getChuckNorrisJoke();
    } else {
      joke = await this.service.getDadJoke();
    }

    res.status(200).json({
      success: true,
      data: { joke },
    });
  }

  /**
   * Handles POST /api/jokes request to create a new joke.
   * @param {Request} req - Express request object with text, userName (optional), topicName (optional)
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async createJoke(req: Request, res: Response): Promise<void> {
    const { text, userName, topicName } = req.body;

    const joke = await this.service.createJoke(text, userName, topicName);

    res.status(201).json({
      success: true,
      data: { number: joke.number },
    });
  }

  /**
   * Handles DELETE /api/jokes/:number request to delete a joke.
   * @param {Request} req - Express request object with number parameter
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async deleteJoke(req: Request, res: Response): Promise<void> {
    const number = Number.parseInt(req.params.number, 10);

    const deleted = await this.service.deleteJoke(number);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Joke not found',
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: 'Joke deleted successfully',
    });
  }

  /**
   * Handles GET /api/jokes request to retrieve jokes with optional filters.
   * @param {Request} req - Express request object with optional userName and topicName query params
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getJokes(req: Request, res: Response): Promise<void> {
    const { userName, topicName } = req.query as { userName?: string; topicName?: string };

    const jokes = await this.service.getJokes(userName, topicName);

    res.status(200).json({
      success: true,
      data: jokes,
    });
  }

  /**
   * Handles GET /api/jokes/paired request to get paired jokes from external APIs.
   * @param {Request} _req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getPairedJokes(_req: Request, res: Response): Promise<void> {
    try {
      const pairedJokes = await this.service.getPairedJokes();

      res.status(200).json({
        success: true,
        data: pairedJokes,
      });
    } catch (error: any) {
      if (error.message === 'No jokes could be retrieved from APIs') {
        res.status(404).json({
          success: false,
          message: 'Could not retrieve any jokes from external APIs',
        });
        return;
      }
      throw error;
    }
  }
}
