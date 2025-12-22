import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

const router = Router();

// Health check route
router.get('/health', healthCheck);

// Other routes will be added as endpoints are implemented

export default router;
