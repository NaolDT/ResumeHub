import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let mongoMemoryServer: any = null;

export async function connectDatabase(): Promise<string> {
  let uri = env.mongodbUri;

  if (!uri) {
    logger.info('No MONGODB_URI provided in environment. Starting in-memory MongoDB instance...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      uri = mongoMemoryServer.getUri();
      logger.info('In-memory MongoDB server started successfully.');
    } catch (error: any) {
      logger.error('Failed to start in-memory MongoDB instance:', { error: String(error) });
      throw error;
    }
  }

  try {
    await mongoose.connect(uri);
    logger.info(`Connected to MongoDB database (${mongoMemoryServer ? 'In-Memory' : 'Remote/Local'})`);
    return uri;
  } catch (error: any) {
    logger.error('MongoDB connection error:', { error: String(error) });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
  logger.info('Disconnected from MongoDB.');
}
