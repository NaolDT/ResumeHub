import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/jobTracker.controller';

export const jobTrackerRouter = Router();

// Protect all routes
jobTrackerRouter.use(requireAuth);

jobTrackerRouter.get('/applications', getApplications);
jobTrackerRouter.post('/applications', createApplication);
jobTrackerRouter.patch('/applications/:id', updateApplication);
jobTrackerRouter.delete('/applications/:id', deleteApplication);
