import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { apiGet, apiPost } from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  PlusCircle,
  Clock,
  BarChart3,
  Eye,
  ChevronRight,
  Sparkles,
  Crown,
  Briefcase,
  Target,
} from 'lucide-react';

interface Resume {
  _id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  viewsCount: number;
  downloadsCount: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: resumesData, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => apiGet<{ resumes: Resume[] }>('/resumes'),
  });

  const createMutation = useMutation({
    mutationFn: () => apiPost<{ resume: Resume }>('/resumes', { title: 'Untitled Resume' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      window.location.href = `/builder/${data.resume._id}`;
    },
  });

  const resumes = resumesData?.resumes ?? [];
  const isPro = user?.subscriptionTier === 'pro';
  const canCreate = isPro || resumes.length === 0;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-brand-hover p-8 text-white shadow-lg shadow-brand/20">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 text-sm text-white/80 max-w-xl">
            {isPro
              ? 'Your PRO account unlocks unlimited resumes, AI writing tools, ATS scoring, and cover letter generation.'
              : 'You\'re on the Free tier. Upgrade to PRO to unlock unlimited resumes, AI tools, ATS scoring, and more.'}
          </p>
          {!isPro && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-100 border border-amber-400/30">
                <Crown className="h-3.5 w-3.5 text-amber-300" /> Upgrade to PRO coming in Phase 2
              </span>
            </div>
          )}
        </div>
        {/* Decorative blob */}
        <div className="absolute right-0 top-0 h-full w-48 bg-white/5 rounded-l-full transform translate-x-12" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Resumes', value: resumes.length, icon: FileText, color: 'text-brand' },
          {
            label: 'Total Views',
            value: resumes.reduce((a, r) => a + r.viewsCount, 0),
            icon: Eye,
            color: 'text-emerald-600',
          },
          {
            label: 'Downloads',
            value: resumes.reduce((a, r) => a + r.downloadsCount, 0),
            icon: BarChart3,
            color: 'text-purple-600',
          },
          { label: 'Account Tier', value: (user?.subscriptionTier ?? 'free').toUpperCase(), icon: Crown, color: 'text-amber-500' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-surface p-5 shadow-sm flex flex-col gap-3"
            >
              <div className={`flex items-center gap-2 ${stat.color}`}>
                <Icon className="h-5 w-5" />
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-ink">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'ATS Score Checker', icon: Target, to: '/ats-check', desc: 'Optimize for ATS parsers', pro: true },
          { label: 'Cover Letter Generator', icon: Sparkles, to: '/cover-letters', desc: 'AI-tailored cover letters', pro: true },
          { label: 'Job Application Tracker', icon: Briefcase, to: '/tracker', desc: 'Track your pipeline', pro: false },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.pro && !isPro ? '#' : card.to}
              className={`group relative rounded-2xl border border-line bg-surface p-5 shadow-sm transition-all hover:shadow-md hover:border-brand/30 ${card.pro && !isPro ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{card.label}</p>
                  <p className="text-xs text-muted mt-0.5">{card.desc}</p>
                </div>
              </div>
              {card.pro && !isPro && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  PRO
                </span>
              )}
              <ChevronRight className="absolute bottom-3 right-3 h-4 w-4 text-muted group-hover:text-brand transition-colors" />
            </Link>
          );
        })}
      </div>

      {/* Resumes Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-ink">My Resumes</h2>
          <button
            disabled={!canCreate || createMutation.isPending}
            onClick={() => createMutation.mutate()}
            title={!canCreate ? 'Upgrade to PRO for unlimited resumes' : undefined}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-sm shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
          >
            <PlusCircle className="h-4 w-4" />
            {createMutation.isPending ? 'Creating...' : 'New Resume'}
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-canvas border border-line animate-pulse" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-line bg-surface p-12 text-center">
            <FileText className="h-12 w-12 text-muted/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ink mb-2">No resumes yet</h3>
            <p className="text-sm text-muted mb-6">Create your first professional resume in under 10 minutes.</p>
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/20 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              {createMutation.isPending ? 'Creating...' : 'Create My First Resume'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <Link
                key={resume._id}
                to={`/builder/${resume._id}`}
                className="group rounded-2xl border border-line bg-surface p-6 shadow-sm hover:shadow-md hover:border-brand/30 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-ink truncate">{resume.title}</p>
                      <p className="text-xs text-muted capitalize">{resume.templateId.replace('-', ' ')} template</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {resume.viewsCount} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {fmtDate(resume.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-line">
                  <span className="text-xs text-muted">Click to edit</span>
                  <ChevronRight className="h-4 w-4 text-muted group-hover:text-brand transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
