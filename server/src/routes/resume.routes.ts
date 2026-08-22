import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const resumeRouter = Router();

// Public routes
resumeRouter.get('/public/:slug', ResumeController.getPublicResume);
resumeRouter.post('/public/:slug/download', ResumeController.recordDownload);

// Protected candidate routes
resumeRouter.use(requireAuth);

resumeRouter.get('/', ResumeController.getResumes);
resumeRouter.post('/', ResumeController.createResume);
resumeRouter.get('/:id', ResumeController.getResumeById);
resumeRouter.put('/:id', ResumeController.updateResume);
resumeRouter.post('/:id/duplicate', ResumeController.duplicateResume);
resumeRouter.delete('/:id', ResumeController.deleteResume);
