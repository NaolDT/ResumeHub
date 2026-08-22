import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { ApiClientError } from '@/api/client';
import { User, Mail, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [headline, setHeadline] = useState(user?.headline ?? '');
  const [avatarUrl] = useState(user?.avatarUrl ?? '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">
        Loading user profile...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      await updateProfile({ name, headline, avatarUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to update profile settings.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Account & Profile</h1>
        <p className="mt-2 text-muted">
          Manage your personal information, subscription status, and platform credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-brand to-brand-hover text-white font-bold text-3xl flex items-center justify-center shadow-lg shadow-brand/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">{user.name}</h3>
            <p className="text-xs text-muted truncate max-w-[200px]">{user.email}</p>
          </div>

          <div className="w-full pt-4 border-t border-line space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Subscription Tier</span>
              <span
                className={`font-semibold px-2.5 py-1 rounded-full border ${
                  user.subscriptionTier === 'pro'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                    : 'bg-muted/10 text-muted border-line'
                }`}
              >
                {user.subscriptionTier.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Account Role</span>
              <span className="font-semibold text-ink uppercase">{user.role}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Verification Status</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="md:col-span-2 rounded-2xl border border-line bg-surface p-8 shadow-sm">
          <h3 className="text-lg font-bold text-ink mb-6">Personal Details</h3>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>Profile changes saved successfully!</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-line rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-ink transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer & Software Architect"
                className="w-full px-4 py-2.5 bg-canvas border border-line rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-ink placeholder:text-muted/60 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                Email Address (Read-only)
              </label>
              <div className="relative opacity-70">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-line rounded-xl text-sm text-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 transition-all disabled:opacity-50 hover:scale-[1.01]"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
