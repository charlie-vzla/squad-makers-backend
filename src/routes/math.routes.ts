import { Router } from 'express';
import { MathController } from '../controllers/MathController';
import { validateQuery } from '../middleware/validateRequest';
import { lcmQuerySchema, incrementQuerySchema } from '../validators/math.validator';

const router = Router();
const mathController = MathController.getInstance();

/**
 * @swagger
 * /api/math/lcm:
 *   get:
 *     summary: Calculate Least Common Multiple (LCM)
 *     description: Calculates the LCM of a comma-separated list of integers
 *     tags: [Math]
 *     parameters:
 *       - in: query
 *         name: numbers
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d+(,\s*\d+)*$'
 *         description: Comma-separated list of positive integers
 *         example: "12,15,20"
 *     responses:
 *       200:
 *         description: LCM calculated successfully
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
 *                     lcm:
 *                       type: number
 *                       example: 60
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/lcm', validateQuery(lcmQuerySchema), (req, res, next) => {
  mathController.getLCM(req, res).catch(next);
});

/**
 * @swagger
 * /api/math/increment:
 *   get:
 *     summary: Increment a number by 1
 *     description: Returns the given number incremented by 1
 *     tags: [Math]
 *     parameters:
 *       - in: query
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: The integer to increment
 *         example: 42
 *     responses:
 *       200:
 *         description: Number incremented successfully
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
 *                     result:
 *                       type: number
 *                       example: 43
 *       400:
 *         description: Invalid query parameters or number overflow
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/increment', validateQuery(incrementQuerySchema), (req, res, next) => {
  mathController.getIncrement(req, res).catch(next);
});

export default router;
