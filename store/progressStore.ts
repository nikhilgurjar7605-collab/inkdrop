import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReadingProgress {
  currentChapterId: string;
  currentPage: number;
  totalChapters?: number;
  lastRead: string;
}

interface ProgressState {
  progress: Record<string, ReadingProgress>;
  updateProgress: (mangaId: string, chapterId: string, page: number, totalChapters?: number) => void;
  getProgress: (mangaId: string) => ReadingProgress | undefined;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      updateProgress: (mangaId, chapterId, page, totalChapters) =>
        set((state) => {
          const currentProgress = state.progress[mangaId] || {};
          return {
            progress: {
              ...state.progress,
              [mangaId]: {
                ...currentProgress,
                currentChapterId: chapterId,
                currentPage: page,
                lastRead: new Date().toISOString(),
                ...(totalChapters !== undefined && { totalChapters }),
              },
            },
          };
        }),
      getProgress: (mangaId) => get().progress[mangaId],
    }),
    {
      name: 'inkdrop-progress-storage',
    }
  )
);
