import { Request, Response } from 'express';

/**
 * @swagger
 * /api/jokes:
 *   get:
 *     summary: Get a random joke from database
 *     description: Returns a random joke from the database
 *     tags: [Jokes]
 *     responses:
 *       200:
 *         description: Joke retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Joke'
 *       404:
 *         description: No jokes found in database
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/jokes/{source}:
 *   get:
 *     summary: Get a joke from external API
 *     description: Returns a joke from Chuck Norris or Dad Jokes API
 *     tags: [Jokes]
 *     parameters:
 *       - in: path
 *         name: source
 *         schema:
 *           type: string
 *           enum: [Chuck, Dad]
 *         required: true
 *         description: Joke source (Chuck or Dad)
 *     responses:
 *       200:
 *         description: Joke retrieved successfully
 *       400:
 *         description: Invalid source parameter
 *       500:
 *         description: Failed to fetch joke from external API
 */
export class JokesController {
  private static instance: JokesController;

  private constructor() {
  }

  public static getInstance(): JokesController {
    if (!JokesController.instance) {
      JokesController.instance = new JokesController();
    }
    return JokesController.instance;
  }

  async getJoke(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented');
  }
}
