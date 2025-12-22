import { Router } from 'express';
import { JokesController } from '../controllers/JokesController';

const router = Router();
const jokesController = JokesController.getInstance();

/**
 * @swagger
 * /api/jokes:
 *   get:
 *     summary: Get a random joke from database
 *     description: Returns a random joke stored in the PostgreSQL database
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
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     joke:
 *                       type: string
 *                       example: "Why did the chicken cross the road?"
 *       404:
 *         description: No jokes found in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', (req, res, next) => {
  jokesController.getRandomJoke(req, res).catch(next);
});

/**
 * @swagger
 * /api/jokes/{source}:
 *   get:
 *     summary: Get a joke from an external API
 *     description: Returns a joke from Chuck Norris API or Dad Jokes API based on the source parameter
 *     tags: [Jokes]
 *     parameters:
 *       - in: path
 *         name: source
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Chuck, Dad]
 *         description: The source of the joke (Chuck for Chuck Norris, Dad for Dad Jokes)
 *     responses:
 *       200:
 *         description: Joke retrieved successfully from external API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     joke:
 *                       type: string
 *                       example: "Chuck Norris can divide by zero"
 *       400:
 *         description: Invalid source parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid source. Allowed values: Chuck, Dad"
 *       500:
 *         description: Failed to fetch joke from external API
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:source', (req, res, next) => {
  const pathParameter: string = req.params.source;

  if (!['Chuck', 'Dad'].includes(pathParameter)) {
    res.status(400).json({
      success: false,
      message: 'Invalid source. Allowed values: Chuck, Dad',
    });

    return;
  }

  jokesController.getJoke(pathParameter, res).catch(next);
});

export default router;
