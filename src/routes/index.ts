import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import { JokesController } from '../controllers/jokes/JokesController';

const router = Router();

// Health check route
router.get('/health', healthCheck);

// Jokes routes
const jokesController = JokesController.getInstance();
router.get('/jokes/:source?', (req, res) => jokesController.getJoke(req, res));

export default router;
