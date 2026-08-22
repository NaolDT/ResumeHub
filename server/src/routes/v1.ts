import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { userRouter } from './user.routes.js';
import { resumeRouter } from './resume.routes.js';
import { jobTrackerRouter } from './jobTracker.routes.js';

export const v1Router = Router();

v1Router.get('/', (_req, res) => {
  res.json({
    name: 'ResumeHub API',
    version: 'v1',
    status: 'online',
    phase: 'Phase 1 - Zero-Cost Portfolio Build',
  });
});

v1Router.use('/auth', authRouter);
v1Router.use('/users', userRouter);
v1Router.use('/resumes', resumeRouter);
v1Router.use('/job-tracker', jobTrackerRouter);
