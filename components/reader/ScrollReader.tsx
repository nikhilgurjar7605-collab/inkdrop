import React, { useState } from 'react';
import { useReaderStore } from '@/store/readerStore';

export function ScrollReader({ chapterData }: { chapterData: any }) {
  const pages = chapterData.pages;

  return (
    <div className="w-full h-full overflow-y-auto pb-safe">
      <div className="flex flex-col items-center mx-auto w-full max-w-[900px]">
        {pages.map((page: string, i: number) => {
          return <ScrollImage key={i} chapterData={chapterData} index={i} pageFile={page} />;
        })}
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
