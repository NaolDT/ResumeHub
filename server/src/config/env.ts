import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';

loadDotenv({ path: resolve(process.cwd(), '../.env') });
loadDotenv({ path: resolve(process.cwd(), '.env') });

export type NodeEnv = 'development' | 'test' | 'production';

function asNodeEnv(value: string | undefined): NodeEnv {
  if (value === 'production' || value === 'test' || value === 'development') {
    return value;
  }
  return 'development';
}

function asNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  nodeEnv: asNodeEnv(process.env.NODE_ENV),
  port: asNumber(process.env.PORT, 5000),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET || 'dev-resumehub-jwt-secret-key-change-in-prod',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-resumehub-refresh-secret-key-change-in-prod',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  aiProvider: process.env.AI_PROVIDER ?? 'free',
  storageProvider: process.env.STORAGE_PROVIDER ?? 'local',
  emailProvider: process.env.EMAIL_PROVIDER ?? 'console',
};

export const isProduction = env.nodeEnv === 'production';
