import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthService } from '../../src/services/auth.service.js';
import { User } from '../../src/models/user.model.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('AuthService', () => {
  it('registers a new user and grants admin role to the first user', async () => {
    const { user, tokens } = await AuthService.register({
      email: 'admin@resumehub.dev',
      password: 'password123',
      name: 'Admin User',
    });

    expect(user.email).toBe('admin@resumehub.dev');
    expect(user.role).toBe('admin');
    expect(user.subscriptionTier).toBe('pro');
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it('registers a subsequent user as free tier', async () => {
    const { user } = await AuthService.register({
      email: 'user@resumehub.dev',
      password: 'password123',
      name: 'Standard User',
    });

    expect(user.email).toBe('user@resumehub.dev');
    expect(user.role).toBe('free');
    expect(user.subscriptionTier).toBe('free');
  });

  it('authenticates valid credentials on login', async () => {
    const { user, tokens } = await AuthService.login({
      email: 'user@resumehub.dev',
      password: 'password123',
    });

    expect(user.email).toBe('user@resumehub.dev');
    expect(tokens.accessToken).toBeDefined();
  });

  it('refuses invalid password on login', async () => {
    await expect(
      AuthService.login({
        email: 'user@resumehub.dev',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow('Invalid email or password.');
  });
});
