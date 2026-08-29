import { Router } from 'express';
import { getATSScore, generateCoverLetter } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const aiRouter = Router();

// POST /api/v1/ai/ats-score  – protected, requires valid JWT
aiRouter.post('/ats-score', requireAuth, getATSScore);

// POST /api/v1/ai/cover-letter - protected, requires valid JWT
aiRouter.post('/cover-letter', requireAuth, generateCoverLetter);

