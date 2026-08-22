import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import {
  FileText,
  Briefcase,
  Sparkles,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Crown,
  LayoutDashboard,
  ShieldAlert,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, authRequired: true },
    { name: 'Resume Builder', path: '/builder', icon: FileText, authRequired: true },
    { name: 'Job Tracker', path: '/tracker', icon: Briefcase, authRequired: true },
    { name: 'Cover Letters', path: '/cover-letters', icon: Sparkles, authRequired: true },
    { name: 'Interview Prep', path: '/interview-prep', icon: BookOpen, authRequired: true },
  ];

  const activePath = location.pathname;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-line transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 text-xl font-bold text-ink">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand to-brand-hover text-white shadow-md shadow-brand/20">
                <FileText className="h-5 w-5" />
              </div>
              <span className="tracking-tight">
                Resume<span className="text-brand">Hub</span>
              </span>
            </Link>

            {user && (
              <span
                className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  user.subscriptionTier === 'pro'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                    : 'bg-muted/10 text-muted border-line'
                }`}
              >
                {user.subscriptionTier === 'pro' && <Crown className="h-3 w-3 text-amber-500" />}
                {user.subscriptionTier.toUpperCase()}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activePath.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand/10 text-brand font-semibold'
                        : 'text-muted hover:text-ink hover:bg-canvas'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-canvas transition-colors border border-transparent hover:border-line focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-ink max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-surface border border-line shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-line">
                      <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-ink hover:bg-canvas transition-colors"
                    >
                      <User className="h-4 w-4" /> Profile & Account
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors font-medium"
                      >
                        <ShieldAlert className="h-4 w-4" /> Admin Console
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-ink transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl shadow-md shadow-brand/20 transition-all hover:scale-[1.02]"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-line bg-surface px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-muted hover:text-ink hover:bg-canvas"
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
