import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/features/theme/ThemeContext';
import { DashboardPage } from '@/pages/DashboardPage';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/client')>();
  return {
    ...actual,
    apiGet: vi.fn().mockResolvedValue({ resumes: [] }),
    apiPost: vi.fn().mockResolvedValue({ resume: { _id: 'r1', title: 'New Resume' } }),
  };
});

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => ({
    user: { _id: 'u1', name: 'Test User', email: 'test@example.com', subscriptionTier: 'free' },
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function renderDashboard() {
  return render(
    <ThemeProvider>
      <QueryClientProvider client={makeQueryClient()}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the welcome message with the user name', async () => {
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/welcome back, test/i)).toBeInTheDocument(),
    );
  });

  it('renders the "My Resumes" section heading', async () => {
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/my resumes/i)).toBeInTheDocument(),
    );
  });

  it('shows the empty state when there are no resumes', async () => {
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/no resumes yet/i)).toBeInTheDocument(),
    );
  });

  it('shows the "New Resume" button', async () => {
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new resume/i })).toBeInTheDocument(),
    );
  });

  it('renders all four stat card labels', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText(/total resumes/i)).toBeInTheDocument();
      expect(screen.getByText(/total views/i)).toBeInTheDocument();
      expect(screen.getByText(/downloads/i)).toBeInTheDocument();
      expect(screen.getByText(/account tier/i)).toBeInTheDocument();
    });
  });

  it('shows the FREE account tier for a free-tier user', async () => {
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText('FREE')).toBeInTheDocument(),
    );
  });
});
