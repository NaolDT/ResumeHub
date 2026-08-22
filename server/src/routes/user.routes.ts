import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get('/me', AuthController.getMe);
userRouter.put('/profile', AuthController.updateProfile);
