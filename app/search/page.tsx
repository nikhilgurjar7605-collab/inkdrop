"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchManga } from '@/hooks/useManga';
import { useDebounce } from '@/hooks/useDebounce';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Input } from '@/components/ui/Input';
import { MangaCard } from '@/components/ui/MangaCard';
import { MangaCardSkeleton } from '@/components/ui/MangaCardSkeleton';
import { GenrePill } from '@/components/ui/GenrePill';
import { Search, Filter } from 'lucide-react';

const GENRES = ['Action', 'Romance', 'Comedy', 'Horror', 'Fantasy', 'Sci-Fi', 'Slice of Life', 'Drama', 'Sports', 'Thriller'];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre');

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenre ? [initialGenre] : []);

  // Update URL on state change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (selectedGenres.length === 1) params.set('genre', selectedGenres[0]);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, selectedGenres, router]);

  const { data: results, isLoading } = useSearchManga(debouncedQuery, {
    genres: selectedGenres,
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12 pt-16 bg-background-base">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-8">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  type="text"
                  placeholder="Search manga..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 h-12"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-heading font-bold flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <GenrePill 
                    key={genre} 
                    active={selectedGenres.includes(genre.toLowerCase())}
                    onClick={() => toggleGenre(genre.toLowerCase())}
                  >
                    {genre}
                  </GenrePill>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <h2 className="font-heading text-xl font-bold mb-6">
              {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Browse All'}
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <MangaCardSkeleton key={i} />)
              ) : results?.length ? (
                results.map(manga => <MangaCard key={manga.id} manga={manga} />)
              ) : (!debouncedQuery && selectedGenres.length === 0) ? (
                <div className="col-span-full py-12 text-center text-text-secondary">
                  Start typing or select a genre to search the INKDROP library...
                </div>
              ) : (
                <div className="col-span-full py-12 text-center text-text-secondary">
                  No manga found matching your criteria.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      <BottomNav />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16 flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
