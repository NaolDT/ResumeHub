export type ErrorCode =
  | 'INTERNAL_ERROR'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'RATE_LIMITED';

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly isOperational: boolean;
  readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    details?: unknown,
    isOperational = true,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
  }

  static badRequest(message = 'Bad request.', details?: unknown): AppError {
    return new AppError(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Authentication required.'): AppError {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Access denied.'): AppError {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(message = 'The requested resource was not found.'): AppError {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  static conflict(message = 'Resource conflict.'): AppError {
    return new AppError(message, 409, 'CONFLICT');
  }

  static internal(message = 'An unexpected error occurred.'): AppError {
    return new AppError(message, 500, 'INTERNAL_ERROR', undefined, false);
  }
}
