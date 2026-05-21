import { MangaResponse, SingleMangaResponse, ChapterResponse, AtHomeResponse, UIManga, Manga, CoverResponse } from './types';
import { buildCoverUrl } from './utils';

// Use Next.js proxy for client requests to bypass CORS, but use absolute URL for SSR
const BASE_URL = typeof window !== 'undefined' ? '/api/mangadex' : 'https://api.mangadex.org';

async function fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}

export async function fetchMangaList(params: Record<string, any> = {}): Promise<UIManga[]> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => queryParams.append(`${key}[]`, v));
    } else {
      queryParams.append(key, value);
    }
  });

  // Always include cover_art relationship
  queryParams.append('includes[]', 'cover_art');
  queryParams.append('includes[]', 'author');

  const data: MangaResponse = await fetchWithRetry(`${BASE_URL}/manga?${queryParams.toString()}`);
  
  return data.data.map(mapMangaToUI);
}

export async function fetchMangaDetails(id: string): Promise<UIManga> {
  const data: SingleMangaResponse = await fetchWithRetry(`${BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author`);
  return mapMangaToUI(data.data);
}

export async function fetchMangaFeed(id: string, offset = 0, limit = 500): Promise<ChapterResponse> {
  return await fetchWithRetry(
    `${BASE_URL}/manga/${id}/feed?limit=${limit}&offset=${offset}&translatedLanguage[]=en&order[chapter]=asc&order[volume]=asc`
  );
}

export async function fetchChapterPages(chapterId: string): Promise<{ baseUrl: string; hash: string; pages: string[] }> {
  const data: AtHomeResponse = await fetchWithRetry(`${BASE_URL}/at-home/server/${chapterId}`);
  return {
    baseUrl: data.baseUrl,
    hash: data.chapter.hash,
    pages: data.chapter.data
  };
}

export async function searchManga(query: string, limit = 20): Promise<UIManga[]> {
  return fetchMangaList({
    title: query,
    limit,
    contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
    order: { relevance: 'desc' }
  });
}

// Helper to map API response to UI model
function mapMangaToUI(manga: Manga): UIManga {
  const altEnglishTitle = manga.attributes.altTitles?.find(t => t.en)?.en;
  const title = manga.attributes.title.en || altEnglishTitle || Object.values(manga.attributes.title)[0] || 'Unknown Title';
  const description = manga.attributes.description.en || 'No description available.';
  
  let coverUrl = null;
  const coverRel = manga.relationships.find(r => r.type === 'cover_art');
  if (coverRel && coverRel.attributes && coverRel.attributes.fileName) {
    coverUrl = buildCoverUrl(manga.id, coverRel.attributes.fileName);
  }

  let author = 'Unknown';
  const authorRel = manga.relationships.find(r => r.type === 'author');
  if (authorRel && authorRel.attributes && authorRel.attributes.name) {
    author = authorRel.attributes.name;
  }

  const genres = manga.attributes.tags
    .filter(tag => tag.attributes.group === 'genre')
    .map(tag => tag.attributes.name.en)
    .filter(Boolean) as string[];

  return {
    id: manga.id,
    title,
    coverUrl,
    status: manga.attributes.status,
    genres,
    description,
    author
  };
}
