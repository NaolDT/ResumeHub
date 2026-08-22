import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    await connectDatabase();
    const app = createApp();

    app.listen(env.port, () => {
      logger.info('ResumeHub API listening', {
        port: env.port,
        nodeEnv: env.nodeEnv,
        apiBase: '/api/v1',
      });
    });
  } catch (error: any) {
    logger.error('Failed to start ResumeHub server:', { error: String(error) });
    process.exit(1);
  }
}

startServer();
