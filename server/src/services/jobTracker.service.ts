import { JobApplication, IJobApplication } from '../models/jobTracker.model.js';
import { Types } from 'mongoose';

export class JobTrackerService {
  /** Create a new job application for a user */
  static async create(userId: Types.ObjectId, data: Omit<IJobApplication, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const job = new JobApplication({ userId, ...data });
    return await job.save();
  }

  /** Retrieve all applications for a user */
  static async list(userId: Types.ObjectId) {
    return await JobApplication.find({ userId }).sort({ appliedDate: -1 }).lean();
  }

  /** Update an existing application */
  static async update(userId: Types.ObjectId, id: string, updates: Partial<IJobApplication>) {
    return await JobApplication.findOneAndUpdate({ _id: id, userId }, updates, { new: true }).lean();
  }

  /** Delete an application */
  static async delete(userId: Types.ObjectId, id: string) {
    return await JobApplication.deleteOne({ _id: id, userId });
  }
}
