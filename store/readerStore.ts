import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ReadingMode = 'page' | 'scroll';
type ReadingDirection = 'ltr' | 'rtl';
type PageFit = 'width' | 'height' | 'original';
type BackgroundColor = 'black' | 'dark' | 'sepia' | 'white';

interface ReaderState {
  mode: ReadingMode;
  direction: ReadingDirection;
  fit: PageFit;
  background: BackgroundColor;
  currentPage: number;
  setMode: (mode: ReadingMode) => void;
  setDirection: (direction: ReadingDirection) => void;
  setFit: (fit: PageFit) => void;
  setBackground: (bg: BackgroundColor) => void;
  setPage: (page: number) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      mode: 'page',
      direction: 'rtl', // default manga reading direction
      fit: 'height',
      background: 'black',
      currentPage: 1, // Will not be persisted via partialize
      setMode: (mode) => set({ mode }),
      setDirection: (direction) => set({ direction }),
      setFit: (fit) => set({ fit }),
      setBackground: (background) => set({ background }),
      setPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'inkdrop-reader-settings',
      partialize: (state) => ({
        mode: state.mode,
        direction: state.direction,
        fit: state.fit,
        background: state.background,
        // Don't persist currentPage
      }),
    }
  )
);
