import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Sparkles, Sword, Heart, Laugh, Ghost, Wand2, Rocket, Coffee, Film, Trophy, Skull } from 'lucide-react';

const GENRES = [
  { name: 'Action', icon: Sword, color: 'from-red-500 to-orange-500' },
  { name: 'Romance', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { name: 'Comedy', icon: Laugh, color: 'from-yellow-400 to-amber-500' },
  { name: 'Horror', icon: Ghost, color: 'from-stone-600 to-stone-900' },
  { name: 'Fantasy', icon: Wand2, color: 'from-purple-500 to-indigo-500' },
  { name: 'Sci-Fi', icon: Rocket, color: 'from-cyan-500 to-blue-500' },
  { name: 'Slice of Life', icon: Coffee, color: 'from-emerald-400 to-emerald-600' },
  { name: 'Drama', icon: Film, color: 'from-violet-500 to-fuchsia-500' },
  { name: 'Sports', icon: Trophy, color: 'from-blue-400 to-blue-600' },
  { name: 'Thriller', icon: Skull, color: 'from-slate-700 to-black' },
  { name: 'Mature', icon: Sparkles, color: 'from-red-600 to-red-900' },
];

export default function GenresPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12 pt-16 bg-background-base">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Explore Genres</h1>
            <p className="text-text-secondary text-lg">
              Find your next favorite manga by diving deep into specific categories and themes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {GENRES.map((genre) => {
              const Icon = genre.icon;
              return (
                <Link
                  key={genre.name}
                  href={`/genre/${genre.name.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[2/1] flex flex-col items-center justify-center border border-border-subtle bg-background-surface hover:border-border transition-all hover:scale-[1.02] active:scale-95"
                >
                  <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${genre.color}`} />
                  <Icon className="w-8 h-8 mb-3 text-text-primary group-hover:-translate-y-1 transition-transform" />
                  <h3 className="font-heading font-bold text-lg tracking-wide">{genre.name}</h3>
                </Link>
              );
            })}
          </div>

        </div>
      </main>
      <BottomNav />
    </>
  );
}
