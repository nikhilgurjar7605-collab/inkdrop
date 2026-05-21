import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchMangaList, fetchMangaDetails, fetchMangaFeed, searchManga } from '@/lib/mangadex';

export function useTrendingManga() {
  return useQuery({
    queryKey: ['manga', 'trending'],
    queryFn: () => fetchMangaList({
      limit: 10,
      'order[rating]': 'desc',
      'hasAvailableChapters': 'true',
    })
  });
}

export function useTopManga() {
  return useQuery({
    queryKey: ['manga', 'top-10'],
    queryFn: () => fetchMangaList({
      limit: 10,
      'order[followedCount]': 'desc',
      'hasAvailableChapters': 'true',
    })
  });
}

export function useRecentlyUpdatedManga() {
  return useQuery({
    queryKey: ['manga', 'recently-updated'],
    queryFn: () => fetchMangaList({
      limit: 15,
      'order[latestUploadedChapter]': 'desc',
      'hasAvailableChapters': 'true',
    })
  });
}

export function useNewArrivalsManga() {
  return useQuery({
    queryKey: ['manga', 'new-arrivals'],
    queryFn: () => fetchMangaList({
      limit: 10,
      'order[createdAt]': 'desc',
      'hasAvailableChapters': 'true',
    })
  });
}

export function useMatureManga() {
  return useQuery({
    queryKey: ['manga', 'mature'],
    queryFn: () => fetchMangaList({
      limit: 20,
      'order[followedCount]': 'desc',
      'hasAvailableChapters': 'true',
      'contentRating[]': ['erotica', 'pornographic']
    })
  });
}

export function useMangaDetail(id: string) {
  return useQuery({
    queryKey: ['manga', id],
    queryFn: () => fetchMangaDetails(id),
    enabled: !!id,
  });
}

export function useSearchManga(query: string, filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['manga', 'search', query, filters],
    queryFn: () => fetchMangaList({
      title: query || undefined,
      limit: 20,
      ...filters
    }),
    enabled: true,
  });
}

export function useMangaFeedInfinite(id: string) {
  return useInfiniteQuery({
    queryKey: ['manga', id, 'feed'],
    queryFn: ({ pageParam = 0 }) => fetchMangaFeed(id, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.offset + lastPage.limit < lastPage.total) {
        return lastPage.offset + lastPage.limit;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!id,
  });
}
