import React, { useState } from 'react';
import { apiGet, apiPostCoverLetter } from '@/api/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Sparkles, Loader2, Copy, CheckCircle2 } from 'lucide-react';

interface Resume {
  _id: string;
  title: string;
}

export const CoverLettersPage: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const { data: resumesData, isLoading: loadingResumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => apiGet<{ resumes: Resume[] }>('/resumes'),
  });

  const generateMutation = useMutation({
    mutationFn: () => apiPostCoverLetter(selectedResume, jobDescription),
    onSuccess: (res) => {
      setCoverLetter(res.data.coverLetter);
    },
  });

  const resumes = resumesData?.resumes ?? [];

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand" />
          AI Cover Letter Generator
        </h1>
        <p className="text-muted mt-1 text-sm">
          Generate a tailored cover letter instantly based on your resume and a job description.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="glass-card p-5 space-y-5 rounded-2xl border border-line bg-surface">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Select Resume
            </label>
            {loadingResumes ? (
              <div className="flex items-center gap-2 text-muted text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading resumes...
              </div>
            ) : (
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="w-full bg-canvas border border-line rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
              >
                <option value="">-- Choose a Resume --</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 bg-canvas border border-line rounded-lg p-3 text-sm text-ink focus:outline-none focus:border-brand resize-none"
            />
          </div>

          <button
            onClick={() => generateMutation.mutate()}
            disabled={!selectedResume || !jobDescription || generateMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover disabled:bg-brand/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generateMutation.isPending ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </div>

        {/* Right Column - Output */}
        <div className="glass-card p-5 rounded-2xl border border-line bg-surface flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink">Preview</h2>
            {coverLetter && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover transition-colors"
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            )}
          </div>
          
          <div className="flex-1 min-h-[300px]">
            {generateMutation.isPending ? (
              <div className="h-full flex flex-col items-center justify-center text-muted gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
                <p className="text-sm animate-pulse">Drafting your cover letter...</p>
              </div>
            ) : coverLetter ? (
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-full min-h-[300px] bg-canvas border border-line rounded-lg p-4 text-sm text-ink leading-relaxed focus:outline-none focus:border-brand resize-none"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted text-sm border-2 border-dashed border-line rounded-xl">
                <Sparkles className="h-8 w-8 text-muted/30 mb-2" />
                <p>Your generated cover letter will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

