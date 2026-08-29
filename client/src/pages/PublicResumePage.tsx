import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { apiGetPublicResume, apiRecordResumeDownload } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Download, AlertCircle } from 'lucide-react';
import { TemplateRenderer } from '@/features/templates/TemplateRenderer';

export const PublicResumePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicResume', slug],
    queryFn: () => apiGetPublicResume(slug!),
    enabled: !!slug,
    retry: false,
  });

  useEffect(() => {
    // Record view/download count dynamically, but it's done server-side on get.
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-muted gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span>Loading resume...</span>
      </div>
    );
  }

  if (error || !data?.resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="glass-card max-w-md p-8 text-center rounded-2xl border border-line bg-surface flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-ink">Resume Not Found</h1>
          <p className="text-muted mt-2 text-sm">
            This resume is either private or does not exist.
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    // We would trigger a PDF print here in a real app
    window.print();
    if (slug) {
      await apiRecordResumeDownload(slug).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Download Action */}
      <div className="w-full max-w-[800px] flex justify-end mb-4 print:hidden">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-brand-hover transition-colors"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      {/* Resume Container */}
      <div className="w-full max-w-[800px] bg-white shadow-xl min-h-[1056px] print:shadow-none print:m-0 print:p-0 border border-line">
        <TemplateRenderer data={data.resume} />
      </div>
    </div>
  );
};

