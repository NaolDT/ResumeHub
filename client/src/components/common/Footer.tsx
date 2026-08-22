import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-line bg-surface py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-bold text-ink">ResumeHub</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
              Phase 1 Zero-Cost Build
            </span>
          </div>

          <p className="text-xs text-muted flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500 inline" /> for job seekers worldwide. IEEE 29148:2018 Compliant.
          </p>

          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Privacy Policy
            </span>
            <span>•</span>
            <Link to="/terms" className="hover:text-ink transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
