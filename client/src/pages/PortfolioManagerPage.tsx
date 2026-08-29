import React, { useState } from 'react';
import { apiGet, apiPut } from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, Loader2, Link as LinkIcon, CheckCircle2, Lock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Resume {
  _id: string;
  title: string;
  isPublic: boolean;
  publicSlug: string;
  viewsCount: number;
  downloadsCount: number;
}

export const PortfolioManagerPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const { data: resumesData, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => apiGet<{ resumes: Resume[] }>('/resumes'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resume> }) =>
      apiPut(`/resumes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCopyResume = (slug: string) => {
    const url = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug('r-' + slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const resumes = resumesData?.resumes ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
          <Globe className="h-6 w-6 text-brand" />
          Public Portfolio & Resumes
        </h1>
        <p className="text-muted mt-1 text-sm">
          Manage your public presence. Share your resumes directly or showcase them in a personalized portfolio page.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px] text-muted gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
          <span>Loading your resumes...</span>
        </div>
      ) : resumes.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-2 rounded-2xl flex flex-col items-center justify-center text-muted">
          <Globe className="h-10 w-10 mb-3 opacity-30" />
          <p>You don't have any resumes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {resumes.map((resume) => (
            <div key={resume._id} className="glass-card p-6 rounded-2xl border border-line bg-surface flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-ink">{resume.title}</h2>
                  {resume.isPublic ? (
                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-green-500/10 text-green-600 border border-green-500/20">
                      <Globe className="h-3 w-3" /> Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-muted/10 text-muted border border-line">
                      <Lock className="h-3 w-3" /> Private
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {resume.viewsCount} Views
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => updateMutation.mutate({ id: resume._id, data: { isPublic: !resume.isPublic } })}
                  disabled={updateMutation.isPending}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                    resume.isPublic
                      ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                      : 'bg-brand text-white hover:bg-brand-hover'
                  }`}
                >
                  {resume.isPublic ? 'Make Private' : 'Make Public'}
                </button>
                
                {resume.isPublic && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleCopy(resume.publicSlug)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-canvas border border-line hover:bg-surface transition-colors flex items-center justify-center gap-2"
                    >
                      {copiedSlug === resume.publicSlug ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4 text-muted" />}
                      {copiedSlug === resume.publicSlug ? 'Portfolio Link Copied' : 'Copy Portfolio Link'}
                    </button>
                    <button
                      onClick={() => handleCopyResume(resume.publicSlug)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-canvas border border-line hover:bg-surface transition-colors flex items-center justify-center gap-2"
                    >
                      {copiedSlug === 'r-' + resume.publicSlug ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4 text-muted" />}
                      {copiedSlug === 'r-' + resume.publicSlug ? 'Resume Link Copied' : 'Copy Resume Link'}
                    </button>
                    <div className="flex gap-2">
                      <Link to={`/portfolio/${resume.publicSlug}`} target="_blank" className="text-xs text-brand hover:underline">View Portfolio</Link>
                      <Link to={`/r/${resume.publicSlug}`} target="_blank" className="text-xs text-brand hover:underline">View Resume</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

