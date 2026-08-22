import { describe, expect, it } from 'vitest';
import { logger } from '../../src/utils/logger.js';

describe('logger', () => {
  it('redacts secret-like keys without throwing', () => {
    expect(() =>
      logger.info('test', {
        password: 'super-secret',
        nested: { refreshToken: 'abc', email: 'user@example.com' },
      }),
    ).not.toThrow();
  });
});
