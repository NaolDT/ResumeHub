import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthService } from '../../src/services/auth.service.js';
import { ResumeService } from '../../src/services/resume.service.js';

let mongoServer: MongoMemoryServer;
let testUserId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register an admin user (first user) – used by admin role test
  await AuthService.register({
    email: 'admin@resumehub.dev',
    password: 'password123',
    name: 'Admin User',
  });

  // Register a free‑tier user to serve as the test user for resume service
  const { user } = await AuthService.register({
    email: 'candidate@example.com',
    password: 'password123',
    name: 'Candidate User',
  });
  testUserId = user._id.toString();
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('ResumeService', () => {
  let createdResumeId: string;

  it('creates default resume draft with 6 initial sections', async () => {
    const resume = await ResumeService.createResume(testUserId, 'Software Engineer 2026');

    expect(resume.title).toBe('Software Engineer 2026');
    expect(resume.sections).toHaveLength(6);
    expect(resume.templateId).toBe('ats-friendly');
    createdResumeId = resume._id.toString();
  });

  it('updates resume settings and section content', async () => {
    const updated = await ResumeService.updateResume(createdResumeId, testUserId, {
      title: 'Senior Software Engineer',
      colorTheme: 'emerald',
    });

    expect(updated.title).toBe('Senior Software Engineer');
    expect(updated.colorTheme).toBe('emerald');
  });

  it('enforces 1-resume limit for free tier users', async () => {
    await expect(ResumeService.createResume(testUserId, 'Second Resume')).rejects.toThrow(
      'Free tier users are limited to one (1) resume draft.',
    );
  });
});
