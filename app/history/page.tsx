"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useHistoryStore } from '@/store/historyStore';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { History, Trash2, BookOpen, Clock } from 'lucide-react';

export default function HistoryPage() {
  const { history, clearHistory, removeFromHistory } = useHistoryStore();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12 pt-16 bg-background-base">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <History className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold">Reading History</h1>
                <p className="text-text-secondary text-sm">{history.length} titles read</p>
              </div>
            </div>
            {history.length > 0 && (
              <Button variant="ghost" className="gap-2 text-danger hover:text-danger hover:bg-danger/10" onClick={clearHistory}>
                <Trash2 className="w-4 h-4" /> Clear All
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-background-surface border border-border border-dashed flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-text-muted" />
              </div>
              <h2 className="font-heading text-xl font-bold mb-2">No history yet</h2>
              <p className="text-text-secondary mb-6 text-sm">Start reading manga and your history will appear here.</p>
              <Button asChild>
                <Link href="/">Browse Manga</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((entry) => (
                <div
                  key={entry.manga.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-background-surface border border-border-subtle hover:border-border transition-colors group"
                >
                  {/* Cover */}
                  <Link href={`/manga/${entry.manga.id}`} className="shrink-0">
                    <div className="relative w-14 h-20 rounded-md overflow-hidden bg-background-elevated">
                      {entry.manga.coverUrl && (
                        <Image src={entry.manga.coverUrl} alt={entry.manga.title} fill className="object-cover" sizes="56px" />
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/manga/${entry.manga.id}`}>
                      <h3 className="font-bold text-text-primary truncate hover:text-accent transition-colors">
                        {entry.manga.title}
                      </h3>
                    </Link>
                    <p className="text-text-secondary text-sm mt-0.5">
                      Chapter {entry.chapterNumber}
                    </p>
                    <p className="text-text-muted text-xs mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(entry.readAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/read/${entry.chapterId}?manga=${entry.manga.id}`}
                      className="flex items-center gap-1.5 bg-accent text-black text-xs font-bold px-3 py-1.5 rounded-md hover:bg-accent-hover transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Continue
                    </Link>
                    <button
                      onClick={() => removeFromHistory(entry.manga.id)}
                      className="p-1.5 text-text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
