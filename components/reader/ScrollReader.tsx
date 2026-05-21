import React from 'react';
import { useReaderStore } from '@/store/readerStore';

export function ScrollReader({ chapterData }: { chapterData: any }) {
  const { fit } = useReaderStore();
  const pages = chapterData.pages;

  const fitClass = {
    width: 'w-full h-auto',
    height: 'h-screen w-auto object-contain',
    original: 'max-w-full h-auto',
  }[fit];

  return (
    <div className="w-full h-full overflow-y-auto pb-safe">
      <div className={`flex flex-col items-center mx-auto ${fit === 'width' ? 'w-full md:w-[800px]' : ''}`}>
        {pages.map((page: string, i: number) => {
          const imgUrl = `${chapterData.baseUrl}/data/${chapterData.hash}/${page}`;
          return (
            <div key={i} className="relative w-full flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imgUrl} 
                alt={`Page ${i + 1}`} 
                className={fitClass}
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
