"use client";

import React, { useState } from 'react';
import { useLibraryStore } from '@/store/libraryStore';
import { useProgressStore } from '@/store/progressStore';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { MangaCard } from '@/components/ui/MangaCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { BookOpen, Heart, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'bookmarked' | 'reading' | 'completed';

export default function LibraryPage() {
  const { bookmarks } = useLibraryStore();
  const { progress } = useProgressStore();
  const [activeTab, setActiveTab] = useState<Tab>('bookmarked');

  const bookmarksArray = Object.values(bookmarks);
  const readingList = bookmarksArray.filter(m => {
    const p = progress[m.id];
    return p && (!p.totalChapters || p.currentPage < (p.totalChapters || 999));
  });
  const completedList = bookmarksArray.filter(m => {
    const p = progress[m.id];
    return p && p.totalChapters && p.currentPage >= p.totalChapters;
  });

  const displayList = {
    bookmarked: bookmarksArray,
    reading: readingList,
    completed: completedList,
  }[activeTab];

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'bookmarked', label: 'Bookmarked', icon: <Heart className="w-4 h-4" />, count: bookmarksArray.length },
    { key: 'reading', label: 'Reading', icon: <BookOpen className="w-4 h-4" />, count: readingList.length },
    { key: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" />, count: completedList.length },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12 pt-16 bg-background-base">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h1 className="font-heading text-3xl font-bold">My Library</h1>
            <div className="flex bg-background-surface rounded-lg p-1 border border-border gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-md capitalize transition-colors",
                    activeTab === tab.key
                      ? "bg-accent text-black"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {tab.icon} {tab.label}
                  <span className={cn(
                    "text-xs rounded-full px-1.5 py-0.5 font-bold",
                    activeTab === tab.key ? "bg-black/20 text-black" : "bg-background-elevated text-text-muted"
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {displayList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
              {displayList.map(manga => (
                <div key={manga.id} className="relative">
                  <MangaCard manga={manga} />
                  {progress[manga.id] && (
                    <div className="absolute bottom-[92px] left-0 right-0 h-1 bg-background-hover rounded-b overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${Math.min(100, ((progress[manga.id].currentPage) / (progress[manga.id].totalChapters || 100)) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-background-surface rounded-full flex items-center justify-center mb-6 border border-border border-dashed">
                <BookOpen className="w-8 h-8 text-text-muted" />
              </div>
              <h2 className="font-heading text-xl font-bold mb-2">Nothing here yet</h2>
              <p className="text-text-secondary mb-6 text-sm">
                {activeTab === 'bookmarked' && "You haven't saved any manga to your library."}
                {activeTab === 'reading' && "No manga in progress. Start reading something!"}
                {activeTab === 'completed' && "No completed manga yet. Keep reading!"}
              </p>
              <Button asChild><Link href="/">Browse Manga</Link></Button>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
