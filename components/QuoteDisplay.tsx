import React, { forwardRef } from 'react';
import type { GeneratedQuote } from '../types';

interface QuoteDisplayProps {
  quoteData: GeneratedQuote;
  onDownload: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export const QuoteDisplay = forwardRef<HTMLDivElement, QuoteDisplayProps>(({ quoteData, onDownload, onSave, isSaved }, ref) => {
  const { quote, source, imageUrl, fontClass } = quoteData;

  return (
    <div className="mt-8 flex flex-col items-center">
      <div 
        ref={ref} 
        className="w-full max-w-2xl aspect-square relative overflow-hidden rounded-xl shadow-2xl bg-black flex items-center justify-center p-8 sm:p-12"
      >
        <img src={imageUrl} alt="AI generated background" className="absolute top-0 left-0 w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
        <div className="relative text-center z-10 text-white flex flex-col items-center">
          <p className={`text-3xl md:text-4xl lg:text-5xl leading-tight drop-shadow-lg ${fontClass}`}>
            "{quote}"
          </p>
          <p className={`mt-6 text-xl md:text-2xl font-semibold opacity-90 drop-shadow-md ${fontClass}`}>
            - {source}
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button 
          onClick={onDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download
        </button>
        <button 
          onClick={onSave}
          disabled={isSaved}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
          </svg>
          {isSaved ? 'Saved' : 'Save Quote'}
        </button>
      </div>
    </div>
  );
});