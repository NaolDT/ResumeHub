import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { ApiClientError } from '@/api/client';
import { FileText, Lock, Mail, User, ArrowRight, AlertCircle, Check, Crown } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPasswordValid = password.length >= 8 && /\d/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Password must be at least 8 characters long and contain at least one number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Registration failed. Please check your details and try again.');
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
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-ink">Create your account</h2>
          <p className="mt-2 text-sm text-muted">
            Start building your ATS-friendly resume and career portfolio for free.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
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
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-line rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-ink placeholder:text-muted/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-line rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-ink placeholder:text-muted/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-line rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-ink placeholder:text-muted/60 transition-all"
                />
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted">
                <div className={`flex items-center gap-1.5 ${password.length >= 8 ? 'text-emerald-600 font-medium' : ''}`}>
                  <Check className={`h-3.5 w-3.5 ${password.length >= 8 ? 'opacity-100' : 'opacity-40'}`} />
                  At least 8 characters long
                </div>
                <div className={`flex items-center gap-1.5 ${/\d/.test(password) ? 'text-emerald-600 font-medium' : ''}`}>
                  <Check className={`h-3.5 w-3.5 ${/\d/.test(password) ? 'opacity-100' : 'opacity-40'}`} />
                  Contains at least one number
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Tier Feature highlight */}
          <div className="mt-6 pt-6 border-t border-line text-xs text-muted space-y-2">
            <p className="font-semibold text-ink flex items-center gap-1">
              <Crown className="h-3.5 w-3.5 text-amber-500" /> Free Tier includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted pl-1">
              <li>1 Resume Draft & 3 ATS Templates</li>
              <li>High-fidelity PDF Export</li>
              <li>Live Preview & Real-Time Autosave</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
