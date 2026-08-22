import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '@/App';

// Partially mock @/api/client - keep all real exports but stub the network call
vi.mock('@/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/client')>();
  return {
    ...actual,
    apiGet: vi.fn().mockRejectedValue(new Error('offline')),
    apiPost: vi.fn().mockRejectedValue(new Error('offline')),
    apiPut: vi.fn().mockRejectedValue(new Error('offline')),
    apiDelete: vi.fn().mockRejectedValue(new Error('offline')),
  };
});

describe('App', () => {
  it('renders the product name in the header', () => {
    render(<App />);
    expect(screen.getAllByText(/resumehub/i).length).toBeGreaterThan(0);
  });
});
