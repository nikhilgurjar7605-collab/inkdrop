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
  // MangaDex Genre Name to UUID Mapping
  const GENRE_MAP: Record<string, string> = {
    'action': '391b0423-d847-456f-aff0-8b0cfc03066b',
    'romance': '423e2eae-a7a2-4183-a428-ff18ebcb8fc2',
    'comedy': '4d32cc48-9f00-4cca-9b5a-a839f0764984',
    'horror': 'cdad7e68-1419-41dd-bdce-27753074a640',
    'fantasy': 'cdc58593-87dd-415e-bbc0-2ec27bf404e2',
    'sci-fi': '256c8bd9-4904-4360-bf4f-508a76d67183',
    'slice of life': 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9',
    'drama': 'b9af3a63-f058-46de-a9a0-e0c13906197a',
    'sports': '69c62214-a957-4148-93a0-f2038e285a8d',
    'thriller': '07251805-a27e-4d59-b46d-f1812041ce5e',
  };

  const hasFilters = Object.keys(filters).length > 0;
  
  // Convert genre string array from filters into includedTags[] array of UUIDs
  const processedFilters = { ...filters };
  if (processedFilters.genres && Array.isArray(processedFilters.genres)) {
    const uuids = processedFilters.genres.map(g => GENRE_MAP[g.toLowerCase()]).filter(Boolean);
    if (uuids.length > 0) {
      processedFilters['includedTags[]'] = uuids;
    }
    delete processedFilters.genres;
  }

  return useQuery({
    queryKey: ['manga', 'search', query, processedFilters],
    queryFn: () => fetchMangaList({
      title: query || undefined,
      limit: 20,
      ...processedFilters
    }),
    enabled: !!query || hasFilters,
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
