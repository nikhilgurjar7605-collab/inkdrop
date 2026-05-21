import { Metadata } from 'next';
import { fetchMangaDetails } from '@/lib/mangadex';

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const manga = await fetchMangaDetails(params.id);
    
    return {
      title: `${manga.title} - Read on INKDROP`,
      description: manga.description.substring(0, 160),
      openGraph: {
        title: manga.title,
        description: manga.description.substring(0, 160),
        images: manga.coverUrl ? [{ url: manga.coverUrl, width: 800, height: 1200 }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: manga.title,
        description: manga.description.substring(0, 160),
        images: manga.coverUrl ? [manga.coverUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Manga - INKDROP',
    };
  }
}

export default function MangaLayout({ children }: Props) {
  return <>{children}</>;
}
