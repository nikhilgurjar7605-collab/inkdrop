import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UIManga } from '@/lib/types';
import { Badge } from './Badge';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface MangaCardProps {
  manga: UIManga;
}

export function MangaCard({ manga }: MangaCardProps) {
  const statusColors = {
    ongoing: 'success',
    completed: 'warning', // accent
    hiatus: 'muted',
    cancelled: 'danger',
  } as const;

  const statusVariant = statusColors[manga.status as keyof typeof statusColors] || 'default';

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <Link href={`/manga/${manga.id}`} className="group block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-background-surface border border-border">
        {manga.coverUrl ? (
          <Image
            src={manga.coverUrl}
            alt={manga.title}
            fill
            className="object-cover transition-transform duration-150 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-elevated">
            <span className="text-text-muted text-sm">No cover</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center justify-center">
          <span className="bg-accent text-black font-bold px-4 py-2 rounded-md">Read Now</span>
        </div>

        {/* Rating Badge */}
        {manga.rating !== undefined && (
          <div className="absolute top-2 right-2 bg-background-elevated/90 backdrop-blur px-2 py-1 rounded-md border border-border-subtle flex items-center gap-1">
            <Star className="w-3 h-3 text-accent fill-accent" />
            <span className="text-xs font-bold text-text-primary">{manga.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <h3 className="font-heading text-sm font-bold text-text-primary line-clamp-2 leading-tight">
          {manga.title}
        </h3>
        
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant}>
            {manga.status}
          </Badge>
          
          <div className="flex gap-1 overflow-hidden">
            {manga.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-xs text-text-secondary whitespace-nowrap">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
