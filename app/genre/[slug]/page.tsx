"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useSearchManga } from '@/hooks/useManga';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { MangaCard } from '@/components/ui/MangaCard';
import { MangaCardSkeleton } from '@/components/ui/MangaCardSkeleton';

export default function GenrePage() {
  const params = useParams();
  const slug = params.slug as string;
  const genreName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';

  // In a real app we need to map slug to MangaDex UUID tags
  // For demo, we just search with a query or dummy filter
  const { data: results, isLoading } = useSearchManga('', {
    // tag UUID would go here
    limit: 30,
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12 pt-16 bg-background-base">
        {/* Genre Hero */}
        <section className="bg-background-surface border-b border-border-subtle py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <span className="text-accent text-sm font-bold tracking-widest uppercase mb-2">Genre</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{genreName}</h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => <MangaCardSkeleton key={i} />)
            ) : results?.length ? (
              results.map(manga => <MangaCard key={manga.id} manga={manga} />)
            ) : (
              <div className="col-span-full py-12 text-center text-text-secondary">
                No manga found in this genre.
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
