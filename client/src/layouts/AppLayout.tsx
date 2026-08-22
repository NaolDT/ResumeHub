import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Target,
  Sparkles,
  Globe,
  BookOpen,
  User,
  LogOut,
  Menu,
  Crown,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', pro: false },
  { to: '/resumes', icon: FileText, label: 'My Resumes', pro: false },
  { to: '/tracker', icon: Briefcase, label: 'Job Tracker', pro: false },
  { to: '/ats-check', icon: Target, label: 'ATS Checker', pro: true },
  { to: '/cover-letters', icon: Sparkles, label: 'Cover Letters', pro: true },
  { to: '/portfolio', icon: Globe, label: 'Portfolio', pro: true },
  { to: '/interview-prep', icon: BookOpen, label: 'Interview Prep', pro: true },
];

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isPro = user?.subscriptionTier === 'pro';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-surface border-r border-line w-60">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-line shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">R</div>
        <span className="font-extrabold text-ink text-sm tracking-tight">ResumeHub</span>
        {isPro && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
            <Crown className="h-3 w-3" /> PRO
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          const isLocked = item.pro && !isPro;
          return (
            <Link
              key={item.to}
              to={isLocked ? '#' : item.to}
              onClick={() => setSidebarOpen(false)}
              title={isLocked ? 'Upgrade to PRO to unlock' : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand/10 text-brand font-semibold'
                  : isLocked
                    ? 'text-muted/50 cursor-not-allowed pointer-events-none'
                    : 'text-muted hover:text-ink hover:bg-canvas'
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {isLocked ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">PRO</span>
              ) : isActive ? (
                <ChevronRight className="h-4 w-4 text-brand" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="shrink-0 border-t border-line p-3">
        <Link
          to="/profile"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-canvas transition-colors group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand text-sm font-bold shrink-0">
            {(user?.name ?? 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink truncate">{user?.name}</p>
            <p className="text-[11px] text-muted truncate">{user?.email}</p>
          </div>
          <User className="h-4 w-4 text-muted group-hover:text-ink transition-colors shrink-0 ml-auto" />
        </Link>
        <button
          onClick={handleLogout}
          className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-line bg-surface shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-ink text-sm">ResumeHub</span>
          <Link to="/profile" className="p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors">
            <User className="h-5 w-5" />
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
