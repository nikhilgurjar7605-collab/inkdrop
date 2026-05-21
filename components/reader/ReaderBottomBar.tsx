import React from 'react';
import { useReaderStore } from '@/store/readerStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReaderBottomBarProps {
  show: boolean;
  totalPages: number;
}

export function ReaderBottomBar({ show, totalPages }: ReaderBottomBarProps) {
  const { currentPage, setPage, direction } = useReaderStore();

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  // Map logical prev/next to visual left/right depending on direction
  const isRTL = direction === 'rtl';
  const LeftIcon = isRTL ? ChevronRight : ChevronLeft;
  const RightIcon = isRTL ? ChevronLeft : ChevronRight;
  const handleLeft = isRTL ? handleNextPage : handlePrevPage;
  const handleRight = isRTL ? handlePrevPage : handleNextPage;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 h-16 bg-black/90 backdrop-blur text-white z-50 flex items-center justify-between px-4 shadow-xl pb-safe"
        >
          <button 
            onClick={handleLeft}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <LeftIcon className="w-6 h-6" />
          </button>

          <div className="font-bold font-mono tracking-widest text-sm">
            {currentPage} / {totalPages}
          </div>

          <button 
            onClick={handleRight}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RightIcon className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
