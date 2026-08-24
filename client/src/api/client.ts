import { clientConfig } from '@/config/env';

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

let accessTokenMemory: string | null = localStorage.getItem('resumehub_access_token');
let refreshTokenMemory: string | null = localStorage.getItem('resumehub_refresh_token');

export function setTokens(tokens: { accessToken: string; refreshToken: string } | null) {
  if (tokens) {
    accessTokenMemory = tokens.accessToken;
    refreshTokenMemory = tokens.refreshToken;
    localStorage.setItem('resumehub_access_token', tokens.accessToken);
    localStorage.setItem('resumehub_refresh_token', tokens.refreshToken);
  } else {
    accessTokenMemory = null;
    refreshTokenMemory = null;
    localStorage.removeItem('resumehub_access_token');
    localStorage.removeItem('resumehub_refresh_token');
  }
}

export function getAccessToken(): string | null {
  return accessTokenMemory;
}

export function getRefreshToken(): string | null {
  return refreshTokenMemory;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${clientConfig.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessTokenMemory && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${accessTokenMemory}`;
  }

  let response = await fetch(url, { ...options, headers });

  // Auto-refresh token on 401
  if (response.status === 401 && refreshTokenMemory && !path.includes('/auth/refresh') && !path.includes('/auth/login')) {
    try {
      const refreshRes = await fetch(`${clientConfig.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenMemory }),
      });
      if (refreshRes.ok) {
        const data = (await refreshRes.json()) as { tokens: { accessToken: string; refreshToken: string } };
        setTokens(data.tokens);
        headers['Authorization'] = `Bearer ${data.tokens.accessToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        setTokens(null);
      }
    } catch {
      setTokens(null);
    }
  }

  const body = await parseJson(response);

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null;
    throw new ApiClientError(
      errorBody?.error?.message ?? 'The request could not be completed.',
      response.status,
      errorBody?.error?.code ?? 'REQUEST_FAILED',
    );
  }

  return body as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export async function apiPost<T>(path: string, data?: unknown): Promise<T> {
  const options: RequestInit = { method: 'POST' };
  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }
  return request<T>(path, options);
}

export async function apiPut<T>(path: string, data?: unknown): Promise<T> {
  const options: RequestInit = { method: 'PUT' };
  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }
  return request<T>(path, options);
}

export async function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

// ─── ATS Score ────────────────────────────────────────────────────────────────

export interface ATSScoreResponse {
  score: number;
  recommendations: string[];
}

/**
 * POST /api/v1/ai/ats-score
 * Calculates a simple ATS compatibility score for the given resume data.
 */
export async function apiGetATSScore(resumeData: unknown): Promise<{ success: boolean; data: ATSScoreResponse }> {
  return apiPost('/ai/ats-score', { resume: resumeData });
}

