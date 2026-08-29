import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Target,
  Globe,
  Briefcase,
  BookOpen,
  Check,
  Crown,
  ArrowRight,
  Zap,
  Shield,
  Star,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/features/theme/ThemeContext';

const FEATURES = [
  {
    icon: FileText,
    title: 'Drag-and-Drop Resume Builder',
    desc: 'Build multi-section resumes with real-time live preview. Personal info, experience, education, skills, projects, and more.',
    color: 'from-blue-500 to-brand',
  },
  {
    icon: Target,
    title: 'ATS Compatibility Scorer',
    desc: 'Analyze your resume against ATS parsing rules. Get a 0-100 score and specific improvement recommendations.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Sparkles,
    title: 'AI Writing Assistant',
    desc: 'Generate compelling summaries, optimize bullet points with quantifiable metrics, and fix grammar in one click.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Globe,
    title: 'Public Portfolio Website',
    desc: 'Auto-generate a professional portfolio page showcasing your skills, projects, and experience with a unique public URL.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Briefcase,
    title: 'Job Application Tracker',
    desc: 'Manage your entire job search pipeline. Track applications from Applied → Offer with notes and reminder dates.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: BookOpen,
    title: 'Interview Preparation',
    desc: 'Generate tailored interview questions from your resume and target job description, categorized by type.',
    color: 'from-indigo-500 to-blue-600',
  },
];

const TEMPLATES = [
  { name: 'ATS-Friendly', tier: 'Free', color: 'bg-slate-100 text-slate-800' },
  { name: 'Modern', tier: 'Free', color: 'bg-sky-100 text-sky-800' },
  { name: 'Minimal', tier: 'Free', color: 'bg-gray-100 text-gray-800' },
  { name: 'Executive', tier: 'PRO', color: 'bg-amber-100 text-amber-800' },
  { name: 'Creative', tier: 'PRO', color: 'bg-purple-100 text-purple-800' },
  { name: 'Academic', tier: 'PRO', color: 'bg-emerald-100 text-emerald-800' },
];

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <nav className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-ink text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white font-bold text-xs">R</div>
            ResumeHub
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <Link to="/dashboard" className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-1.5 rounded-xl text-sm font-medium text-muted hover:text-ink transition-colors">Sign In</Link>
                <Link to="/register" className="px-4 py-1.5 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-hover transition-colors">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-canvas via-surface to-canvas pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand mb-8">
            <Zap className="h-3.5 w-3.5" />
            Phase 1 · Zero-Cost Portfolio Build · IEEE 29148:2018
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-tight">
            Build a resume that{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-600">
              actually lands interviews
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            ResumeHub is an AI-powered career platform. Create ATS-optimized resumes, generate tailored cover letters, track applications, and publish your portfolio — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand to-brand-hover shadow-xl shadow-brand/30 hover:shadow-brand/40 transition-all hover:scale-[1.02]"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand to-brand-hover shadow-xl shadow-brand/30 hover:shadow-brand/40 transition-all hover:scale-[1.02]"
                >
                  Start Building Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-muted border border-line bg-surface hover:bg-canvas transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500" /> Free to start
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500" /> ATS-optimized templates
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-canvas">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              Everything you need for your job search
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              From resume creation to interview prep — a complete career platform built with professional engineers in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative glass-card rounded-2xl border border-line bg-surface p-6 shadow-sm hover:shadow-md hover:border-brand/20 hover:scale-[1.02] transition-all"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${feature.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-ink">6 Professional Templates</h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              3 free + 3 PRO templates designed for different industries and career stages.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {TEMPLATES.map((template) => (
              <div
                key={template.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-canvas text-sm font-medium text-ink shadow-sm"
              >
                <span>{template.name}</span>
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${template.color}`}>
                  {template.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Tier Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-canvas">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-ink">Simple, honest pricing</h2>
            <p className="mt-3 text-muted">Start free. Upgrade when you're ready to scale your job search.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="glass-card rounded-2xl border-2 border-line bg-surface p-8 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all">
              <div className="mb-6">
                <p className="text-sm font-bold text-muted uppercase tracking-wider">Free</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-ink">$0</span>
                  <span className="text-muted">/forever</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '1 Resume Draft',
                  '3 ATS-Friendly Templates',
                  'Live Preview',
                  'PDF Export',
                  'Autosave',
                  'Job Application Tracker',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold border-2 border-line text-ink hover:bg-canvas transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="glass-card relative rounded-2xl border-2 border-brand bg-surface p-8 shadow-xl shadow-brand/10 hover:shadow-2xl hover:scale-[1.02] transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-brand to-brand-hover shadow-md">
                  <Crown className="h-3.5 w-3.5 text-amber-300" /> Most Popular
                </span>
              </div>
              <div className="mb-6">
                <p className="text-sm font-bold text-brand uppercase tracking-wider">Pro</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-ink">$9</span>
                  <span className="text-muted">/month</span>
                </div>
                <p className="text-xs text-muted mt-1">Payment integration coming in Phase 2</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Free',
                  'Unlimited Resumes',
                  'All 6 Templates',
                  'AI Writing Assistant',
                  'ATS Score Checker',
                  'Job Description Matcher',
                  'Cover Letter Generator',
                  'Portfolio Website',
                  'DOCX Export',
                  'Interview Preparation',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink">
                    <Check className="h-4 w-4 text-brand shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block w-full text-center py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand to-brand-hover shadow-md shadow-brand/20 hover:scale-[1.01] transition-all"
              >
                Start Free, Upgrade Later
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted">
            {[
              { icon: Shield, label: 'bcrypt Password Hashing' },
              { icon: Star, label: 'JWT Access + Refresh Tokens' },
              { icon: Check, label: 'IEEE 29148:2018 SRS Compliant' },
              { icon: Zap, label: 'Phase 1 Zero-Cost MERN Stack' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 font-medium">
                <Icon className="h-4 w-4 text-brand" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-canvas border-t border-line py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">R</div>
                <span className="font-extrabold text-ink text-sm">ResumeHub</span>
              </div>
              <p className="text-xs text-muted leading-relaxed max-w-[200px]">
                AI-powered career platform for building ATS-optimized resumes and landing your dream job.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Phase 1 · Zero-Cost Stack
              </div>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                {[
                  { label: 'Resume Builder', to: '/register' },
                  { label: 'ATS Checker', to: '/register' },
                  { label: 'Cover Letter AI', to: '/register' },
                  { label: 'Portfolio Website', to: '/register' },
                  { label: 'Interview Prep', to: '/register' },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="hover:text-ink transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Account</h4>
              <ul className="space-y-2 text-sm text-muted">
                {[
                  { label: 'Sign Up Free', to: '/register' },
                  { label: 'Sign In', to: '/login' },
                  { label: 'Dashboard', to: '/dashboard' },
                  { label: 'Profile', to: '/profile' },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="hover:text-ink transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Built With</h4>
              <ul className="space-y-2 text-xs text-muted font-mono">
                {['MongoDB', 'Express.js', 'React 18', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Google Gemini AI'].map((tech) => (
                  <li key={tech} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-brand/60 shrink-0" />
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider + bottom bar */}
          <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
            <span>© {new Date().getFullYear()} ResumeHub. Built for IEEE 29148:2018 compliance.</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-brand" />
                bcrypt + JWT Auth
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-brand" />
                Gemini AI Powered
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
