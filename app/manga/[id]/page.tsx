"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMangaDetail, useMangaFeedInfinite } from '@/hooks/useManga';
import { useLibraryStore } from '@/store/libraryStore';
import { useProgressStore } from '@/store/progressStore';
import { Navbar } from '@/components/ui/Navbar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/Badge';
import { GenrePill } from '@/components/ui/GenrePill';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChapterRow } from '@/components/ui/ChapterRow';
import { Heart, Star, BookOpen, MessageSquare, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

// --- Reviews Data ---
const REVIEW_NAMES = ["Alex Reader", "Sarah K.", "David Chen", "Mia Wong", "Chris T.", "Emma P.", "Jordan L.", "Nina S.", "James R.", "Sophia M."];
const REVIEW_TEXTS = [
  "I've read over 500 manga and this easily makes my top 10 list. The character development is incredible.",
  "Absolutely gripping from the first chapter. The art style and storytelling are top-tier!",
  "Took a few chapters to get into, but once the main arc starts it is impossible to put down.",
  "A must-read for genre fans. The pacing is excellent and the characters are well-developed.",
  "Stayed up all night reading this. The plot twists keep you hooked until the very end.",
  "This manga redefined the genre for me. Highly recommend to anyone looking for a new favorite.",
  "The protagonist's journey is so relatable. I felt every emotion they went through.",
  "One of the best art styles I've seen in a while. Every panel is a masterpiece."
];

function generateReviews(id: string) {
  const seed1 = id.charCodeAt(0) || 1;
  const seed2 = id.charCodeAt(id.length - 1) || 2;
  const seed3 = id.charCodeAt(Math.floor(id.length / 2)) || 3;
  const seed4 = id.length * 2;

  const getReview = (seed: number, index: number) => {
    const nameStr = REVIEW_NAMES[(seed + index * 3) % REVIEW_NAMES.length];
    return {
      id: index,
      name: nameStr,
      avatar: nameStr.substring(0, 2).toUpperCase(),
      rating: 4 + (seed % 2),
      text: REVIEW_TEXTS[(seed * index + seed) % REVIEW_TEXTS.length],
      likes: Math.floor((seed * index + 3) % 20) + 1,
      dislikes: Math.floor((seed + index) % 5),
    };
  };

  return [getReview(seed1, 1), getReview(seed2, 2), getReview(seed3, 3), getReview(seed4, 4)];
}

export default function MangaDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: manga, isLoading: mangaLoading } = useMangaDetail(id);
  const { data: feed, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: feedLoading } = useMangaFeedInfinite(id);

  const { addBookmark, removeBookmark, isBookmarked } = useLibraryStore();
  const { getProgress } = useProgressStore();
  const { user, isAuthenticated } = useAuthStore();

  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [votes, setVotes] = useState<Record<number, 'up' | 'down' | null>>({});

  React.useEffect(() => {
    if (id) setReviews(generateReviews(id));
  }, [id]);

  const bookmarked = isBookmarked(id);
  const progress = getProgress(id);
  const allChapters = feed?.pages.flatMap((p) => p.data) || [];
  const totalFromApi = feed?.pages[0]?.total || 0;

  if (mangaLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-background-base">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center p-4 text-center bg-background-base">
        <h1 className="font-heading text-2xl font-bold mb-4">Manga not found</h1>
        <Button asChild><Link href="/">Back to Home</Link></Button>
      </div>
    );
  }

  const firstChapterId = allChapters[0]?.id;
  const continueChapterId = progress?.currentChapterId || firstChapterId;

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    const reviewerName = user?.name || 'Guest User';
    const review = {
      id: Date.now(),
      name: reviewerName,
      avatar: reviewerName.substring(0, 2).toUpperCase(),
      rating: newRating,
      text: newReview.trim(),
      likes: 0,
      dislikes: 0,
    };
    setReviews([review, ...reviews]);
    setNewReview('');
    setNewRating(5);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12 pt-0 md:pt-16 bg-background-base">

        {/* Blurred Banner */}
        <div className="relative h-56 md:h-72 w-full overflow-hidden">
          {manga.coverUrl && (
            <Image src={manga.coverUrl} alt={manga.title} fill className="object-cover blur-xl scale-110 opacity-25" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/60 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-36 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Cover */}
            <div className="shrink-0 mx-auto md:mx-0 w-44 md:w-60">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-border bg-background-surface shadow-2xl">
                {manga.coverUrl && <Image src={manga.coverUrl} alt={manga.title} fill className="object-cover" priority />}
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <Button variant="primary" size="lg" className="w-full gap-2 text-black font-bold" asChild>
                  <Link href={`/read/${continueChapterId || ''}?manga=${manga.id}&chapter=1`}>
                    <BookOpen className="w-5 h-5" />
                    {progress ? 'Continue Reading' : 'Start Reading'}
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className={cn("w-full gap-2", bookmarked && "border-accent text-accent hover:bg-accent/10")}
                  onClick={() => bookmarked ? removeBookmark(id) : addBookmark(manga)}
                >
                  <Heart className={cn("w-5 h-5 transition-all", bookmarked && "fill-accent scale-110")} />
                  {bookmarked ? 'In Library' : 'Add to Library'}
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-2 md:pt-28">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant={manga.status === 'ongoing' ? 'success' : manga.status === 'completed' ? 'warning' : 'muted'}>
                  {manga.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm font-bold text-accent">
                  <Star className="w-4 h-4 fill-accent" /> 8.5
                </div>
              </div>

              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2 leading-tight">{manga.title}</h1>
              <p className="text-text-secondary font-medium text-sm mb-5">{manga.author}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {manga.genres.map(g => <GenrePill key={g}>{g}</GenrePill>)}
              </div>

              <p className="text-text-primary/80 leading-relaxed text-sm mb-8 line-clamp-5">{manga.description}</p>

              {progress && (
                <div className="mb-8 p-4 rounded-lg bg-background-surface border border-border-subtle">
                  <h3 className="font-bold text-sm mb-3 text-text-secondary">Your Progress</h3>
                  <ProgressBar current={allChapters.findIndex(c => c.id === progress.currentChapterId) + 1 || 1} total={totalFromApi || allChapters.length} />
                </div>
              )}
            </div>
          </div>

          {/* ── CHAPTERS SECTION ── */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-2xl font-bold">
                Chapters <span className="text-text-muted text-lg font-normal ml-1">({totalFromApi})</span>
              </h2>
              <span className="text-text-muted text-sm">{allChapters.length} loaded</span>
            </div>

            {feedLoading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => <div key={i} className="h-16 rounded-md skeleton-shimmer" />)}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 rounded-lg overflow-hidden border border-border-subtle bg-background-surface divide-y divide-border-subtle">
                  {allChapters.map((chapter) => (
                    <ChapterRow
                      key={chapter.id}
                      id={chapter.id}
                      mangaId={manga.id}
                      chapter={chapter.attributes.chapter}
                      title={chapter.attributes.title}
                      date={chapter.attributes.readableAt}
                      isRead={progress?.currentChapterId === chapter.id}
                    />
                  ))}
                </div>

                {hasNextPage && (
                  <Button
                    variant="secondary"
                    className="w-full h-12 border-dashed border-2 bg-transparent hover:bg-background-surface"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? 'Loading more chapters...' : 'Load More Chapters'}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* ── REVIEWS SECTION ── */}
          <div className="mt-16 mb-8">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-accent" /> Community Reviews
            </h2>

            {/* Write Review */}
            <form onSubmit={handlePostReview} className="mb-8 p-4 rounded-lg bg-background-surface border border-border-subtle flex flex-col gap-3">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm font-bold text-text-secondary mr-2">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 -ml-1 hover:scale-110 transition-transform"
                  >
                    <Star className={cn("w-5 h-5 transition-colors", star <= newRating ? "fill-accent text-accent" : "text-border")} />
                  </button>
                ))}
              </div>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="What did you think about this manga?"
                className="w-full bg-background-base border border-border rounded-md p-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent resize-none h-24"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm" className="gap-2 text-black font-bold" disabled={!newReview.trim()}>
                  <Send className="w-4 h-4" /> Post Review
                </Button>
              </div>
            </form>

            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg bg-background-surface border border-border-subtle flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-accent/20 text-accent text-sm">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-text-primary flex items-center gap-1.5">
                        {review.name}
                      </p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-accent text-accent" : "text-text-muted")} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-4 mt-1 pt-2 border-t border-border-subtle">
                    <button
                      onClick={() => {
                        const current = votes[review.id];
                        if (current === 'up') {
                          setVotes(v => ({ ...v, [review.id]: null }));
                          setReviews(rs => rs.map(r => r.id === review.id ? { ...r, likes: r.likes - 1 } : r));
                        } else {
                          setVotes(v => ({ ...v, [review.id]: 'up' }));
                          setReviews(rs => rs.map(r => r.id === review.id ? {
                            ...r,
                            likes: r.likes + (current === 'down' ? 1 : 1),
                            dislikes: r.dislikes - (current === 'down' ? 1 : 0)
                          } : r));
                        }
                      }}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-all",
                        votes[review.id] === 'up'
                          ? "bg-accent/20 text-accent"
                          : "text-text-muted hover:text-text-primary hover:bg-background-elevated"
                      )}
                    >
                      <ThumbsUp className={cn("w-3.5 h-3.5 transition-transform", votes[review.id] === 'up' && "scale-110 fill-accent")} />
                      {review.likes}
                    </button>
                    <button
                      onClick={() => {
                        const current = votes[review.id];
                        if (current === 'down') {
                          setVotes(v => ({ ...v, [review.id]: null }));
                          setReviews(rs => rs.map(r => r.id === review.id ? { ...r, dislikes: r.dislikes - 1 } : r));
                        } else {
                          setVotes(v => ({ ...v, [review.id]: 'down' }));
                          setReviews(rs => rs.map(r => r.id === review.id ? {
                            ...r,
                            dislikes: r.dislikes + 1,
                            likes: r.likes - (current === 'up' ? 1 : 0)
                          } : r));
                        }
                      }}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-all",
                        votes[review.id] === 'down'
                          ? "bg-red-500/20 text-red-400"
                          : "text-text-muted hover:text-text-primary hover:bg-background-elevated"
                      )}
                    >
                      <ThumbsDown className={cn("w-3.5 h-3.5 transition-transform", votes[review.id] === 'down' && "scale-110 fill-red-400")} />
                      {review.dislikes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <BottomNav />
    </>
  );
}
