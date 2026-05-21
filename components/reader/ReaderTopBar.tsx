import React from 'react';
import Link from 'next/link';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ReaderTopBarProps {
  show: boolean;
  mangaTitle: string;
  chapterTitle: string;
  onSettingsClick: () => void;
  mangaId: string;
}

export function ReaderTopBar({ show, mangaTitle, chapterTitle, onSettingsClick, mangaId }: ReaderTopBarProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 inset-x-0 h-14 bg-black/90 backdrop-blur text-white z-50 flex items-center justify-between px-4 shadow-xl"
        >
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-bold text-sm truncate">{mangaTitle}</span>
            <span className="text-xs text-gray-400 truncate">{chapterTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="icon" className="text-white hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); onSettingsClick(); }}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="icon" className="text-white hover:bg-white/10 transition-colors" asChild>
              <Link href={mangaId ? `/manga/${mangaId}` : '/'}>
                <X className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
