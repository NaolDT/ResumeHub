import { Router } from 'express';
import { getQuestions } from '../controllers/interview.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const interviewRouter = Router();

// GET /api/v1/interview-questions - protected, requires valid JWT
interviewRouter.get('/', requireAuth, getQuestions);

