export interface Manga {
  id: string;
  type: string;
  attributes: {
    title: { [key: string]: string };
    altTitles: { [key: string]: string }[];
    description: { [key: string]: string };
    status: string;
    year: number;
    contentRating: string;
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
  };
  relationships: Relationship[];
}

export interface Tag {
  id: string;
  type: string;
  attributes: {
    name: { [key: string]: string };
    group: string;
  };
}

export interface Relationship {
  id: string;
  type: string;
  attributes?: any;
}

export interface Chapter {
  id: string;
  type: string;
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    publishAt: string;
    readableAt: string;
    pages: number;
  };
  relationships: Relationship[];
}

export interface MangaResponse {
  result: string;
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}

export interface SingleMangaResponse {
  result: string;
  response: string;
  data: Manga;
}

export interface ChapterResponse {
  result: string;
  response: string;
  data: Chapter[];
  limit: number;
  offset: number;
  total: number;
}

export interface AtHomeResponse {
  result: string;
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export interface CoverResponse {
  result: string;
  response: string;
  data: {
    id: string;
    type: string;
    attributes: {
      fileName: string;
    };
  };
}

// Extracted UI-friendly types
export interface UIManga {
  id: string;
  title: string;
  coverUrl: string | null;
  status: string;
  rating?: number;
  genres: string[];
  description: string;
  author: string;
}

export interface UIChapter {
  id: string;
  chapterNumber: string;
  title: string;
  date: string;
  isRead: boolean;
}
