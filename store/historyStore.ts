import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UIManga } from '@/lib/types';

export interface HistoryEntry {
  manga: UIManga;
  chapterId: string;
  chapterNumber: string;
  readAt: string;
}

interface HistoryState {
  history: HistoryEntry[];
  addToHistory: (manga: UIManga, chapterId: string, chapterNumber: string) => void;
  clearHistory: () => void;
  removeFromHistory: (mangaId: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addToHistory: (manga, chapterId, chapterNumber) =>
        set((state) => {
          // Remove existing entry for same manga to avoid duplicates, then add to front
          const filtered = state.history.filter((h) => h.manga.id !== manga.id);
          return {
            history: [
              {
                manga,
                chapterId,
                chapterNumber,
                readAt: new Date().toISOString(),
              },
              ...filtered,
            ].slice(0, 100), // Keep max 100 entries
          };
        }),
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (mangaId) =>
        set((state) => ({
          history: state.history.filter((h) => h.manga.id !== mangaId),
        })),
    }),
    {
      name: 'inkdrop-history-storage',
    }
  )
);
