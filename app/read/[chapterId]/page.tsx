"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchChapterPages } from '@/lib/mangadex';
import { useReaderStore } from '@/store/readerStore';
import { useProgressStore } from '@/store/progressStore';
import { useHistoryStore } from '@/store/historyStore';
import { PageReader } from '@/components/reader/PageReader';
import { ScrollReader } from '@/components/reader/ScrollReader';
import { ReaderTopBar } from '@/components/reader/ReaderTopBar';
import { ReaderBottomBar } from '@/components/reader/ReaderBottomBar';
import { ReaderSettings } from '@/components/reader/ReaderSettings';
import { useMangaDetail, useMangaFeedInfinite } from '@/hooks/useManga';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

function ReaderContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const chapterId = params.chapterId as string;
  const mangaId = searchParams.get('manga') || '';
  const chapterNum = searchParams.get('chapter') || '?';

  const { mode, background, currentPage, setPage, direction } = useReaderStore();
  const { updateProgress } = useProgressStore();
  const { addToHistory } = useHistoryStore();

  const [showUI, setShowUI] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showDirectionToast, setShowDirectionToast] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowDirectionToast(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => fetchChapterPages(chapterId),
    enabled: !!chapterId,
  });

  const { data: manga } = useMangaDetail(mangaId);
  const { data: feed } = useMangaFeedInfinite(mangaId);

  const allChapters = feed?.pages.flatMap((p) => p.data) || [];
  const currentChapterIndex = allChapters.findIndex(c => c.id === chapterId);
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < allChapters.length - 1 ? allChapters[currentChapterIndex + 1] : null;

  // Auto-hide UI
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowUI(true);
      clearTimeout(timeout);
      if (!settingsOpen) timeout = setTimeout(() => setShowUI(false), 3000);
    };
    window.addEventListener('mousemove', handleMouseMove);
    handleMouseMove();
    return () => { window.removeEventListener('mousemove', handleMouseMove); clearTimeout(timeout); };
  }, [settingsOpen]);

  // Save progress + history
  useEffect(() => {
    if (mangaId && chapterId && chapterData && manga) {
      updateProgress(mangaId, chapterId, currentPage);
      addToHistory(manga, chapterId, chapterNum);
    }
  }, [mangaId, chapterId, chapterData, manga, chapterNum]);

  // Preload next 3 pages
  useEffect(() => {
    if (!chapterData) return;
    chapterData.pages.slice(currentPage, currentPage + 3).forEach(page => {
      const img = new window.Image();
      img.src = `${chapterData.baseUrl}/data/${chapterData.hash}/${page}`;
    });
  }, [currentPage, chapterData]);

  if (isLoading || !chapterData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading chapter...</p>
        </div>
      </div>
    );
  }

  const bgColors: Record<string, string> = {
    black: 'bg-black',
    dark: 'bg-[#1a1a1a]',
    sepia: 'bg-[#f4ecd8]',
    white: 'bg-white',
  };

  return (
    <div className={`min-h-screen relative flex flex-col ${bgColors[background] || 'bg-black'}`}>
      <ReaderTopBar
        show={showUI}
        mangaTitle={manga?.title || 'Loading...'}
        chapterTitle={`Chapter ${chapterNum}`}
        onSettingsClick={() => { setSettingsOpen(true); setShowUI(true); }}
        mangaId={mangaId}
      />

      <div
        className="flex-1 relative w-full"
        style={{ paddingTop: showUI ? '56px' : '0', paddingBottom: mode === 'page' ? '64px' : '0' }}
        onClick={(e) => { if (!settingsOpen) setShowUI(v => !v); }}
      >
        {mode === 'page' ? (
          <PageReader chapterData={chapterData} />
        ) : (
          <ScrollReader chapterData={chapterData} nextChapter={nextChapter} mangaId={mangaId} />
        )}
      </div>

      {mode === 'page' && (
        <>
          <ReaderBottomBar show={showUI} totalPages={chapterData.pages.length} />
          
          <AnimatePresence>
            {!showUI && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed bottom-6 right-6 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-xs font-bold font-mono tracking-widest z-40 pointer-events-none"
              >
                {currentPage} / {chapterData.pages.length}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <ReaderSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <AnimatePresence>
        {showDirectionToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold z-[55] flex items-center gap-2 shadow-lg whitespace-nowrap"
          >
            <Settings className="w-4 h-4" />
            Reading Mode: {mode === 'scroll' ? 'Scroll' : direction === 'rtl' ? 'Right-to-Left (Manga)' : 'Left-to-Right (Comic)'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReaderContent />
    </Suspense>
  );
}
