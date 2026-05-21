"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoginModal } from './LoginModal';
import { CommandPalette } from './CommandPalette';
import { useAuthStore } from '@/store/authStore';

export function Navbar() {
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/read/')) return null;

  return (
    <>
      <header className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 transition-all duration-200 hidden md:flex items-center px-6 lg:px-8",
        scrolled ? "bg-background-base/90 backdrop-blur border-b border-border-subtle" : "bg-transparent"
      )}>
        <div className="flex w-full max-w-7xl mx-auto items-center justify-between">
          <div className="flex items-center gap-8">
            {/* INKDROP logo → home */}
            <Link href="/" className="font-heading text-xl font-bold text-accent tracking-tighter hover:opacity-80 transition-opacity">
              INKDROP
            </Link>
            <nav className="flex items-center gap-6">
              <NavLink href="/" active={pathname === '/'}>Browse</NavLink>
              <NavLink href="/genres" active={pathname === '/genres'}>Genres</NavLink>
              <NavLink href="/search" active={pathname === '/search'}>Search</NavLink>
              <NavLink href="/library" active={pathname === '/library'}>Library</NavLink>
              <NavLink href="/history" active={pathname === '/history'}>History</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <CommandPalette />
            <Link href="/search" className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center gap-2 bg-background-elevated border border-border text-text-primary text-sm font-medium px-3 py-2 rounded-md hover:bg-background-hover transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                    {user.avatar}
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background-surface border border-border-subtle rounded-lg shadow-xl z-50 overflow-hidden py-1">
                      <div className="px-3 py-2 border-b border-border-subtle">
                        <p className="font-bold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email || 'Guest'}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 bg-accent text-black text-sm font-bold px-4 py-2 rounded-md hover:bg-accent-hover transition-colors"
              >
                <User className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-text-primary",
        active ? "text-accent" : "text-text-secondary"
      )}
    >
      {children}
    </Link>
  );
}
