import { Router } from 'express';
import { getATSScore } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const aiRouter = Router();

// POST /api/v1/ai/ats-score  – protected, requires valid JWT
aiRouter.post('/ats-score', requireAuth, getATSScore);

