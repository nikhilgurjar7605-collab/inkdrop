import React, { useState } from 'react';
import Link from 'next/link';
import { useReaderStore } from '@/store/readerStore';
import { Button } from '@/components/ui/Button';

export function ScrollReader({ chapterData, nextChapter, mangaId }: { chapterData: any, nextChapter?: any, mangaId?: string }) {
  const pages = chapterData.pages;

  return (
    <div className="w-full h-full overflow-y-auto pb-safe">
      <div className="flex flex-col items-center mx-auto w-full max-w-[900px]">
        {pages.map((page: string, i: number) => {
          return <ScrollImage key={i} chapterData={chapterData} index={i} pageFile={page} />;
        })}

        {nextChapter && mangaId && (
          <div className="w-full py-16 flex justify-center bg-black/20 mt-4 border-t border-border-subtle/20">
            <Button variant="primary" size="lg" className="text-black font-bold px-8 py-4 text-base" asChild>
              <Link href={`/read/${nextChapter.id}?manga=${mangaId}&chapter=${nextChapter.attributes.chapter}`}>
                Next Chapter (Ch. {nextChapter.attributes.chapter})
              </Link>
            </Button>
          </div>
        )}
        {!nextChapter && pages.length > 0 && (
          <div className="w-full py-16 flex justify-center text-text-muted mt-4 border-t border-border-subtle/20">
            End of available chapters
          </div>
        )}
      </div>
    </div>
  );
}

function ScrollImage({ chapterData, index, pageFile }: { chapterData: any, index: number, pageFile: string }) {
  const [imgError, setImgError] = useState(false);
  
  const isFallback = imgError && chapterData.dataSaverPages && chapterData.dataSaverPages.length > 0;
  const file = isFallback ? chapterData.dataSaverPages[index] : pageFile;
  const imgUrl = `${chapterData.baseUrl}/${isFallback ? 'data-saver' : 'data'}/${chapterData.hash}/${file}`;

  return (
    <div className="relative w-full flex justify-center min-h-[50vh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imgUrl} 
        alt={`Page ${index + 1}`} 
        className="w-full h-auto object-contain bg-background-elevated"
        loading={index < 3 ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
