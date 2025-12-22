import { Router } from 'express';
import healthRoutes from './health.routes';
import jokesRoutes from './jokes.routes';
import mathRoutes from './math.routes';

const router = Router();

// Mount domain-specific routes
router.use('/health', healthRoutes);
router.use('/jokes', jokesRoutes);
router.use('/math', mathRoutes);

export default router;
