import { Router } from 'express';
import { JokesController } from '../controllers/JokesController';
import { validateRequest, validateParams, validateQuery } from '../middleware/validateRequest';
import { createJokeSchema, jokeSourceSchema, jokeNumberSchema, getJokesQuerySchema } from '../validators/jokes.validator';

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
 * /api/jokes/list:
 *   get:
 *     summary: List jokes with optional filters
 *     description: Returns jokes filtered by userName and/or topicName. If no filters provided, returns all jokes.
 *     tags: [Jokes]
 *     parameters:
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         description: Filter by user name (will be titlecased automatically)
 *         example: "Manolito"
 *       - in: query
 *         name: topicName
 *         schema:
 *           type: string
 *         description: Filter by topic name (will be lowercased automatically)
 *         example: "humor negro"
 *     responses:
 *       200:
 *         description: Jokes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       text:
 *                         type: string
 *                       source:
 *                         type: string
 *                       number:
 *                         type: integer
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       topics:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/list', validateQuery(getJokesQuerySchema), (req, res, next) => {
  jokesController.getJokes(req, res).catch(next);
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
router.get('/:source', validateParams(jokeSourceSchema), (req, res, next) => {
  jokesController.getJoke(req.params.source, res).catch(next);
});

/**
 * @swagger
 * /api/jokes:
 *   post:
 *     summary: Create a new joke
 *     description: Saves a new joke to the database with optional userName and topicName
 *     tags: [Jokes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The joke text
 *                 example: "Why did the developer go broke? Because he used up all his cache!"
 *               userName:
 *                 type: string
 *                 description: The name of the user creating the joke (optional, defaults to Pedro)
 *                 example: "Manolito"
 *               topicName:
 *                 type: string
 *                 description: The name of the topic for the joke (optional, defaults to chistes verdes)
 *                 example: "humor negro"
 *     responses:
 *       201:
 *         description: Joke created successfully
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
 *                     number:
 *                       type: integer
 *                       example: 42
 *       400:
 *         description: Invalid input (missing or empty text)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateRequest(createJokeSchema), (req, res, next) => {
  jokesController.createJoke(req, res).catch(next);
});

/**
 * @swagger
 * /api/jokes/{number}:
 *   delete:
 *     summary: Delete a joke by number
 *     description: Removes a joke from the database by its number
 *     tags: [Jokes]
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The joke number to delete
 *         example: 42
 *     responses:
 *       200:
 *         description: Joke deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Joke deleted successfully
 *       404:
 *         description: Joke not found
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
 *                   example: Joke not found
 *       400:
 *         description: Invalid number parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:number', validateParams(jokeNumberSchema), (req, res, next) => {
  jokesController.deleteJoke(req, res).catch(next);
});

/**
 * @swagger
 * /api/jokes/paired:
 *   get:
 *     summary: Get 5 paired jokes from Chuck Norris and Dad Jokes APIs
 *     description: Fetches 5 jokes from each API in parallel, pairs them 1-to-1, and creates a combined creative version
 *     tags: [Jokes]
 *     responses:
 *       200:
 *         description: Paired jokes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       chuck:
 *                         type: string
 *                         example: "Chuck Norris counted to infinity. Twice."
 *                       dad:
 *                         type: string
 *                         example: "Why did the math book look sad? Because it had too many problems."
 *                       combinado:
 *                         type: string
 *                         example: "Chuck Norris counted to infinity. Also, the math book had too many problems."
 *       500:
 *         description: Error fetching jokes from external APIs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/paired', (req, res, next) => {
  jokesController.getPairedJokes(req, res).catch(next);
});

export default router;
