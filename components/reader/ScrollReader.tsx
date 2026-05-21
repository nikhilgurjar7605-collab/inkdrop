import React from 'react';
import { useReaderStore } from '@/store/readerStore';

export function ScrollReader({ chapterData }: { chapterData: any }) {
  const pages = chapterData.pages;

  return (
    <div className="w-full h-full overflow-y-auto pb-safe">
      <div className="flex flex-col items-center mx-auto w-full max-w-[900px]">
        {pages.map((page: string, i: number) => {
          const imgUrl = `${chapterData.baseUrl}/data/${chapterData.hash}/${page}`;
          return (
            <div key={i} className="relative w-full flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imgUrl} 
                alt={`Page ${i + 1}`} 
                className="w-full h-auto"
                loading={i < 3 ? "eager" : "lazy"}
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
