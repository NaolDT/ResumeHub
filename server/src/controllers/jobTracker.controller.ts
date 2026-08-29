import { Request, Response, NextFunction } from 'express';
import { JobTrackerService } from '../services/jobTracker.service.js';
import { Types } from 'mongoose';

/** GET /applications - list all job applications for the authenticated user */
export const getApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = new Types.ObjectId(req.user!.userId);
    const apps = await JobTrackerService.list(userId);
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

/** POST /applications - create a new job application */
export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = new Types.ObjectId(req.user!.userId);
    const app = await JobTrackerService.create(userId, req.body);
    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
};

/** PATCH /applications/:id - update status or fields */
export const updateApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = new Types.ObjectId(req.user!.userId);
    const id = req.params.id as string;
    const updated = await JobTrackerService.update(userId, id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/** DELETE /applications/:id - remove an application */
export const deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = new Types.ObjectId(req.user!.userId);
    const id = req.params.id as string;
    await JobTrackerService.delete(userId, id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
