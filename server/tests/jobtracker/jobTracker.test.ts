import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthService } from '../../src/services/auth.service.js';
import { JobTrackerService } from '../../src/services/jobTracker.service.js';
import { Types } from 'mongoose';

let mongoServer: MongoMemoryServer;
let testUserId: Types.ObjectId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const { user } = await AuthService.register({
    email: 'tracker@example.com',
    password: 'password123',
    name: 'Tracker User',
  });
  testUserId = user._id as Types.ObjectId;
}, 120_000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('JobTrackerService', () => {
  it('starts with an empty list for a new user', async () => {
    const apps = await JobTrackerService.list(testUserId);
    expect(apps).toEqual([]);
  });

  it('creates a new job application', async () => {
    const app = await JobTrackerService.create(testUserId, {
      company: 'Acme Corp',
      position: 'Software Engineer',
      status: 'Applied',
    });
    expect(app.company).toBe('Acme Corp');
    expect(app.position).toBe('Software Engineer');
    expect(app.status).toBe('Applied');
    expect(app.userId.toString()).toBe(testUserId.toString());
  });

  it('lists created applications for the user', async () => {
    const apps = await JobTrackerService.list(testUserId);
    expect(apps.length).toBeGreaterThanOrEqual(1);
    expect(apps[0].company).toBe('Acme Corp');
  });

  it('updates an existing application status', async () => {
    const apps = await JobTrackerService.list(testUserId);
    const id = apps[0]._id.toString();
    const updated = await JobTrackerService.update(testUserId, id, { status: 'Interviewing' });
    expect(updated?.status).toBe('Interviewing');
  });

  it('does not update applications belonging to another user', async () => {
    const otherUserId = new Types.ObjectId();
    const apps = await JobTrackerService.list(testUserId);
    const id = apps[0]._id.toString();
    const result = await JobTrackerService.update(otherUserId, id, { status: 'Offer' });
    expect(result).toBeNull();
  });

  it('deletes an application', async () => {
    // Create a second application then delete it
    const app = await JobTrackerService.create(testUserId, {
      company: 'Delete Me Inc',
      position: 'QA Engineer',
      status: 'Applied',
    });
    const id = app._id.toString();
    const result = await JobTrackerService.delete(testUserId, id);
    expect(result.deletedCount).toBe(1);

    // Verify it's gone
    const apps = await JobTrackerService.list(testUserId);
    expect(apps.find((a) => a._id.toString() === id)).toBeUndefined();
  });

  it('does not delete applications belonging to another user', async () => {
    const otherUserId = new Types.ObjectId();
    const apps = await JobTrackerService.list(testUserId);
    const id = apps[0]._id.toString();
    const result = await JobTrackerService.delete(otherUserId, id);
    expect(result.deletedCount).toBe(0);
  });
});
