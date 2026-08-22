import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { apiPost, ApiClientError } from '@/api/client';
import { FileText, Lock, ArrowRight, AlertCircle, CheckCircle2, Check } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialToken = searchParams.get('token') ?? '';

  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPasswordValid = newPassword.length >= 8 && /\d/.test(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Password must be at least 8 characters long and contain at least one number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiPost('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to reset password. Token may be invalid or expired.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand to-brand-hover text-white shadow-lg shadow-brand/30">
            <FileText className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-ink">Set new password</h2>
          <p className="mt-2 text-sm text-muted">
            Enter your reset token and your new account password.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>Password updated successfully! Redirecting to sign in...</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                Reset Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here"
                className="w-full px-4 py-2.5 bg-canvas border border-line rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-ink font-mono text-xs placeholder:font-sans placeholder:text-muted/60 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-line rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-ink placeholder:text-muted/60 transition-all"
                />
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted">
                <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-emerald-600 font-medium' : ''}`}>
                  <Check className={`h-3.5 w-3.5 ${newPassword.length >= 8 ? 'opacity-100' : 'opacity-40'}`} />
                  At least 8 characters long
                </div>
                <div className={`flex items-center gap-1.5 ${/\d/.test(newPassword) ? 'text-emerald-600 font-medium' : ''}`}>
                  <Check className={`h-3.5 w-3.5 ${/\d/.test(newPassword) ? 'opacity-100' : 'opacity-40'}`} />
                  Contains at least one number
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>Updating password...</span>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted">
          Back to{' '}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
