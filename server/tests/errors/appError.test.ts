import { describe, expect, it } from 'vitest';
import { AppError } from '../../src/errors/AppError.js';

describe('AppError', () => {
  it('creates operational not-found errors with a stable code', () => {
    const error = AppError.notFound('Resume not found.');

    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.isOperational).toBe(true);
    expect(error.message).toBe('Resume not found.');
  });
});
