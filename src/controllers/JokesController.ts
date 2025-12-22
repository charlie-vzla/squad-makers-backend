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

  async createJoke(_req: Request, res: Response): Promise<void> {
    res.status(201).json({
      success: true,
      data: { number: 0 },
    });
  }
}
