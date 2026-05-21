import React, { useEffect, useCallback } from 'react';
import { useReaderStore } from '@/store/readerStore';
import { motion, AnimatePresence } from 'framer-motion';

export function PageReader({ chapterData }: { chapterData: any }) {
  const { currentPage, setPage, direction } = useReaderStore();
  const totalPages = chapterData.pages.length;

  const handlePrev = useCallback(() => {
    if (currentPage > 1) setPage(currentPage - 1);
  }, [currentPage, setPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  }, [currentPage, totalPages, setPage]);

  const isRTL = direction === 'rtl';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        isRTL ? handleNext() : handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        isRTL ? handlePrev() : handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isRTL]);

  const handleTap = (e: React.MouseEvent) => {
    const x = e.clientX;
    const width = window.innerWidth;
    
    // Tap left third -> left action
    if (x < width / 3) {
      isRTL ? handleNext() : handlePrev();
    }
    // Tap right third -> right action
    else if (x > (width * 2) / 3) {
      isRTL ? handlePrev() : handleNext();
    }
    // Middle tap is handled by parent to toggle UI
  };

  const imgUrl = `${chapterData.baseUrl}/data/${chapterData.hash}/${chapterData.pages[currentPage - 1]}`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-auto" onClick={handleTap}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-[900px] flex items-center justify-center pointer-events-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imgUrl} 
            alt={`Page ${currentPage}`} 
            className="w-full h-auto max-h-[100vh] object-contain"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
