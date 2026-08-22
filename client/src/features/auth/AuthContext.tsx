import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, setTokens, getAccessToken } from '@/api/client';

export type UserRole = 'free' | 'pro' | 'admin';

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionTier: 'free' | 'pro';
  isVerified: boolean;
  avatarUrl?: string;
  headline?: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; headline?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await apiGet<{ user: UserProfile }>('/users/me');
        setUser(res.user);
      } catch {
        setTokens(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const res = await apiPost<{ user: UserProfile; tokens: { accessToken: string; refreshToken: string } }>('/auth/login', data);
    setTokens(res.tokens);
    setUser(res.user);
  };

  const register = async (data: { email: string; password: string; name: string }) => {
    const res = await apiPost<{ user: UserProfile; tokens: { accessToken: string; refreshToken: string } }>('/auth/register', data);
    setTokens(res.tokens);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await apiPost('/auth/logout');
    } catch {
      // ignore network error on logout
    } finally {
      setTokens(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: { name?: string; headline?: string; avatarUrl?: string }) => {
    const res = await apiPut<{ user: UserProfile }>('/users/profile', data);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
