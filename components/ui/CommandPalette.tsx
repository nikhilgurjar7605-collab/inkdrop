"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearchManga } from '@/hooks/useManga';
import { useDebounce } from '@/hooks/useDebounce';
import Image from 'next/image';
import Link from 'next/link';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: results, isLoading } = useSearchManga(debouncedQuery);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Close on Escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Prevent background scrolling when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [open]);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-background-elevated border border-border hover:bg-background-hover transition-colors text-sm text-text-muted"
      >
        <Search className="w-4 h-4" />
        <span>Search manga...</span>
        <kbd className="ml-4 font-sans text-xs bg-background-surface px-1.5 py-0.5 rounded border border-border-subtle">Ctrl+K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-[101] bg-background-surface border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center px-4 py-3 border-b border-border-subtle bg-background-base">
                <Search className="w-5 h-5 text-text-muted mr-3" />
                <input
                  autoFocus
                  placeholder="Search for manga..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-muted"
                />
                {isLoading && debouncedQuery && <Loader2 className="w-5 h-5 text-accent animate-spin" />}
                <button onClick={() => setOpen(false)} className="ml-2 p-1 text-text-muted hover:text-text-primary rounded-md hover:bg-background-elevated transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {!debouncedQuery && (
                  <div className="py-12 text-center text-text-muted text-sm">
                    Start typing to search the INKDROP library...
                  </div>
                )}
                {debouncedQuery && !isLoading && (!results || results.length === 0) && (
                  <div className="py-12 text-center text-text-muted text-sm">
                    No manga found for "{debouncedQuery}"
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {debouncedQuery && results?.slice(0, 8).map((manga) => (
                    <Link
                      key={manga.id}
                      href={`/manga/${manga.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-elevated transition-colors group"
                    >
                      <div className="w-12 h-16 bg-background-elevated rounded border border-border overflow-hidden relative shrink-0">
                        {manga.coverUrl && (
                          <Image src={manga.coverUrl} alt={manga.title} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-text-primary truncate group-hover:text-accent transition-colors">
                          {manga.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-accent font-bold capitalize">{manga.status}</span>
                          <span className="text-xs text-text-muted truncate flex-1">
                            {manga.genres.slice(0, 3).join(', ')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
