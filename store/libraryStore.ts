import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UIManga } from '@/lib/types';

interface LibraryState {
  bookmarks: Record<string, UIManga>;
  addBookmark: (manga: UIManga) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      bookmarks: {},
      addBookmark: (manga) =>
        set((state) => ({
          bookmarks: { ...state.bookmarks, [manga.id]: manga },
        })),
      removeBookmark: (id) =>
        set((state) => {
          const newBookmarks = { ...state.bookmarks };
          delete newBookmarks[id];
          return { bookmarks: newBookmarks };
        }),
      isBookmarked: (id) => !!get().bookmarks[id],
    }),
    {
      name: 'inkdrop-library-storage',
    }
  )
);
