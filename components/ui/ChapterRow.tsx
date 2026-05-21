import React from 'react';
import Link from 'next/link';
import { formatDate, cn } from '@/lib/utils';

interface ChapterRowProps {
  id: string;
  mangaId: string;
  chapter: string | null;
  title: string | null;
  date: string;
  isRead: boolean;
}

export function ChapterRow({ id, mangaId, chapter, title, date, isRead }: ChapterRowProps) {
  const isNew = new Date(date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <Link 
      href={`/read/${id}?manga=${mangaId}`}
      className="group flex items-center gap-4 px-4 py-3 rounded-md transition-colors hover:bg-background-elevated w-full"
    >
      <div 
        className={cn(
          "w-2 h-2 rounded-full shrink-0",
          isRead ? "bg-background-hover" : "bg-accent"
        )} 
      />
      
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary">
            {chapter ? `Chapter ${chapter}` : 'Oneshot'}
          </span>
          {isNew && !isRead && (
            <span className="bg-accent/10 text-accent text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm tracking-wider">
              New
            </span>
          )}
        </div>
        {title && (
          <span className="text-sm text-text-secondary truncate">
            {title}
          </span>
        )}
      </div>

      <div className="text-sm text-text-muted whitespace-nowrap">
        {formatDate(date)}
      </div>
    </Link>
  );
}
