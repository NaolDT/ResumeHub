import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import { TokenPayload } from '../services/auth.service.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Authentication required. Missing Bearer token.'));
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return next(AppError.unauthorized('Invalid or expired access token.'));
  }
}

export function requireTier(minTier: 'pro') {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user.subscriptionTier !== minTier) {
      return next(AppError.forbidden(`This feature requires a ${minTier.toUpperCase()} subscription tier.`));
    }

    next();
  };
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(AppError.unauthorized('Authentication required.'));
  }

  if (req.user.role !== 'admin') {
    return next(AppError.forbidden('Administrator access required.'));
  }

  next();
}
