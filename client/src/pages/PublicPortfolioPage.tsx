import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetPublicResume } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, Mail, MapPin, ExternalLink, MessageSquare, Globe, Link } from 'lucide-react';
import { TemplateRenderer } from '@/features/templates/TemplateRenderer';

export const PublicPortfolioPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showContact, setShowContact] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicResume', slug],
    queryFn: () => apiGetPublicResume(slug!),
    enabled: !!slug,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span>Loading portfolio...</span>
      </div>
    );
  }

  if (error || !data?.resume) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 border border-slate-700 max-w-md p-8 text-center rounded-2xl flex flex-col items-center shadow-xl">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-white">Portfolio Not Found</h1>
          <p className="text-slate-400 mt-2 text-sm">
            This portfolio is either private or does not exist.
          </p>
        </div>
      </div>
    );
  }

  const resume = data.resume;
  const personal = resume.sections.find((s: any) => s.type === 'personal')?.content || {};
  const summary = resume.sections.find((s: any) => s.type === 'summary')?.content || '';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-brand selection:text-white pb-20">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-slate-800">
            {personal.fullName ? personal.fullName[0].toUpperCase() : 'U'}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Hi, I'm {personal.fullName || 'Anonymous'}
          </h1>
          {resume.title && (
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl">
              {resume.title}
            </p>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-300">
            {personal.location && (
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
                <MapPin className="h-4 w-4" /> {personal.location}
              </span>
            )}
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm hover:text-white hover:border-slate-600 transition-colors">
                <Mail className="h-4 w-4" /> {personal.email}
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={() => setShowContact(true)}
              className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-semibold shadow-[0_0_20px_rgba(var(--brand-color),0.3)] hover:bg-brand-hover hover:scale-105 transition-all"
            >
              <MessageSquare className="h-5 w-5" />
              Contact Me
            </button>
            
            {personal.linkedin && (
              <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-all">
                <Globe className="h-5 w-5" />
              </a>
            )}
            {personal.github && (
              <a href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-all">
                <Link className="h-5 w-5" />
              </a>
            )}
            {personal.website && (
              <a href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-all">
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* About Summary */}
      {summary && (
        <div className="max-w-4xl mx-auto px-6 mb-20 text-center">
          <p className="text-lg md:text-xl leading-relaxed text-slate-300 max-w-3xl mx-auto">
            {summary}
          </p>
        </div>
      )}

      {/* Interactive Resume View */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">My Resume</h2>
            <a
              href={`/r/${slug}`}
              target="_blank"
              className="text-sm font-semibold text-brand hover:text-brand-hover flex items-center gap-1"
            >
              View Full PDF <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="bg-white rounded-xl overflow-hidden text-ink shadow-inner">
            <div className="scale-[0.8] origin-top md:scale-100 flex justify-center py-8">
               <TemplateRenderer data={resume} />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">Get in touch</h3>
            <p className="text-sm text-slate-400">
              I'm open to new opportunities. Reach out via email!
            </p>
            <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl break-all">
              <a href={`mailto:${personal.email}`} className="text-brand font-semibold hover:underline">
                {personal.email || 'No email provided'}
              </a>
            </div>
            <button
              onClick={() => setShowContact(false)}
              className="w-full py-2.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

