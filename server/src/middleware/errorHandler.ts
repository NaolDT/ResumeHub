import type { NextFunction, Request, Response } from 'express';
import { isProduction } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`No route matches ${req.method} ${req.path}.`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const error =
    err instanceof AppError
      ? err
      : new AppError('An unexpected error occurred.', 500, 'INTERNAL_ERROR', undefined, false);

  if (!error.isOperational || error.statusCode >= 500) {
    logger.error('Unhandled application error', {
      message: error.message,
      code: error.code,
      name: err instanceof Error ? err.name : 'unknown',
    });
  }

  res.status(error.statusCode).json({
    error: {
      code: error.code,
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
      ...(isProduction || error.statusCode < 500
        ? {}
        : { stack: err instanceof Error ? err.stack : undefined }),
    },
  });
}
