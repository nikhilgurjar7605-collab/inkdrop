"use client";

import React, { useState } from 'react';
import { useTrendingManga, useRecentlyUpdatedManga, useNewArrivalsManga, useTopManga } from '@/hooks/useManga';
import { useQuery } from '@tanstack/react-query';
import { fetchMangaList } from '@/lib/mangadex';
import { MangaCard } from '@/components/ui/MangaCard';
import { MangaCardSkeleton } from '@/components/ui/MangaCardSkeleton';
import { GenrePill } from '@/components/ui/GenrePill';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Sparkles, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const GENRES = ['Action', 'Romance', 'Comedy', 'Horror', 'Fantasy', 'Sci-Fi', 'Slice of Life', 'Drama', 'Sports', 'Thriller', 'Mystery', 'Adventure', 'Supernatural', 'Historical', 'Psychological'];

export default function Home() {
  const { data: trending, isLoading: trendingLoading } = useTrendingManga();
  const { data: topManga, isLoading: topLoading } = useTopManga();
  const { data: recent, isLoading: recentLoading } = useRecentlyUpdatedManga();
  const { data: newArrivals, isLoading: newLoading } = useNewArrivalsManga();

  // Extra sections for a huge library feel
  const { data: actionManga, isLoading: actionLoading } = useQuery({
    queryKey: ['manga', 'action'],
    queryFn: () => fetchMangaList({ limit: 10, 'order[followedCount]': 'desc', 'hasAvailableChapters': 'true', 'includedTags[]': '391b0423-d847-456f-aff0-8b0cfc03066b' })
  });
  const { data: romanceManga, isLoading: romanceLoading } = useQuery({
    queryKey: ['manga', 'romance'],
    queryFn: () => fetchMangaList({ limit: 10, 'order[rating]': 'desc', 'hasAvailableChapters': 'true', 'includedTags[]': '423e2eae-a7a2-4a8b-ac03-a8351462d71d' })
  });
  const { data: fantasyManga, isLoading: fantasyLoading } = useQuery({
    queryKey: ['manga', 'fantasy'],
    queryFn: () => fetchMangaList({ limit: 10, 'order[rating]': 'desc', 'hasAvailableChapters': 'true', 'includedTags[]': 'cdc58593-87dd-415e-bbc0-2ec27bf404cc' })
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12 pt-16">

        {/* ── HERO ── */}
        <section className="relative px-6 py-20 lg:px-8 border-b border-border-subtle bg-background-surface overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-background-surface to-background-surface" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center"
          >
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-5">
              INK<span className="text-accent">DROP</span>
            </h1>
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mb-8 font-medium">
              Your gateway to infinite stories — read manga the way it was meant to be experienced, with flawless design and zero distractions.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/search" className="bg-accent text-black font-bold px-6 py-3 rounded-md hover:bg-accent-hover transition-colors">
                Explore Library
              </Link>
              <Link href="/library" className="bg-transparent border border-border text-text-primary font-medium px-6 py-3 rounded-md hover:bg-background-elevated transition-colors">
                My Library
              </Link>
            </div>
          </motion.div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 flex flex-col gap-16">

          {/* ── TRENDING ROW ── */}
          <section>
            <SectionHeader icon={<TrendingUp className="w-5 h-5 text-accent" />} title="Trending This Week" href="/search" />
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
              {trendingLoading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="min-w-[160px] md:min-w-[200px] snap-start"><MangaCardSkeleton /></div>)
                : trending?.map(m => <div key={m.id} className="min-w-[160px] md:min-w-[200px] snap-start"><MangaCard manga={m} /></div>)
              }
            </div>
          </section>

          {/* ── TOP 10 ── */}
          <section>
            <SectionHeader icon={<Trophy className="w-5 h-5 text-accent" />} title="Top 10 Manga" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {topLoading
                ? Array.from({ length: 10 }).map((_, i) => <MangaCardSkeleton key={i} />)
                : topManga?.slice(0, 10).map((m, idx) => (
                    <div key={m.id} className="relative">
                      <div className="absolute -left-2 -top-2 z-10 w-8 h-8 rounded-full bg-background-elevated border-2 border-accent text-accent font-heading font-bold flex items-center justify-center text-sm">
                        {idx + 1}
                      </div>
                      <MangaCard manga={m} />
                    </div>
                  ))
              }
            </div>
          </section>

          {/* ── GENRE PILLS ── */}
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-lg font-bold text-text-secondary tracking-tight">Browse by Genre</h2>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <Link key={g} href={`/search?genre=${g.toLowerCase()}`}>
                  <GenrePill>{g}</GenrePill>
                </Link>
              ))}
            </div>
          </section>

          {/* ── RECENTLY UPDATED ── */}
          <section>
            <SectionHeader icon={<Clock className="w-5 h-5 text-accent" />} title="Recently Updated" href="/search" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {recentLoading
                ? Array.from({ length: 10 }).map((_, i) => <MangaCardSkeleton key={i} />)
                : recent?.map(m => <MangaCard key={m.id} manga={m} />)
              }
            </div>
          </section>

          {/* ── ACTION ── */}
          <section>
            <SectionHeader icon={<Sparkles className="w-5 h-5 text-accent" />} title="Best Action Manga" href="/search?genre=action" />
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
              {actionLoading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="min-w-[160px] md:min-w-[200px] snap-start"><MangaCardSkeleton /></div>)
                : actionManga?.map(m => <div key={m.id} className="min-w-[160px] md:min-w-[200px] snap-start"><MangaCard manga={m} /></div>)
              }
            </div>
          </section>

          {/* ── ROMANCE ── */}
          <section>
            <SectionHeader icon={<Sparkles className="w-5 h-5 text-accent" />} title="Top Romance Manga" href="/search?genre=romance" />
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
              {romanceLoading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="min-w-[160px] md:min-w-[200px] snap-start"><MangaCardSkeleton /></div>)
                : romanceManga?.map(m => <div key={m.id} className="min-w-[160px] md:min-w-[200px] snap-start"><MangaCard manga={m} /></div>)
              }
            </div>
          </section>

          {/* ── FANTASY ── */}
          <section>
            <SectionHeader icon={<Sparkles className="w-5 h-5 text-accent" />} title="Fantasy & Isekai" href="/search?genre=fantasy" />
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
              {fantasyLoading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="min-w-[160px] md:min-w-[200px] snap-start"><MangaCardSkeleton /></div>)
                : fantasyManga?.map(m => <div key={m.id} className="min-w-[160px] md:min-w-[200px] snap-start"><MangaCard manga={m} /></div>)
              }
            </div>
          </section>

          {/* ── NEW ARRIVALS ── */}
          <section>
            <SectionHeader icon={<Sparkles className="w-5 h-5 text-accent" />} title="New Arrivals" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {newLoading
                ? Array.from({ length: 10 }).map((_, i) => <MangaCardSkeleton key={i} />)
                : newArrivals?.map(m => <MangaCard key={m.id} manga={m} />)
              }
            </div>
          </section>

        </div>
      </main>
      <BottomNav />
    </>
  );
}

function SectionHeader({ icon, title, href }: { icon: React.ReactNode; title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
        {icon} {title}
      </h2>
      {href && (
        <Link href={href} className="text-sm font-bold text-accent flex items-center gap-1 hover:text-accent-hover transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
