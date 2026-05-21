"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, Library, History, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith('/read/')) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 border-t border-border-subtle bg-background-base/95 backdrop-blur">
      <div className="flex h-full items-center justify-around px-2">
        <NavItem href="/" icon={<Compass className="w-5 h-5" />} label="Browse" active={pathname === '/'} />
        <NavItem href="/genres" icon={<Tags className="w-5 h-5" />} label="Genres" active={pathname === '/genres'} />
        <NavItem href="/search" icon={<Search className="w-5 h-5" />} label="Search" active={pathname === '/search'} />
        <NavItem href="/library" icon={<Library className="w-5 h-5" />} label="Library" active={pathname === '/library'} />
        <NavItem href="/history" icon={<History className="w-5 h-5" />} label="History" active={pathname === '/history'} />
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors min-h-[44px]",
        active ? "text-accent" : "text-text-secondary hover:text-text-primary"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
