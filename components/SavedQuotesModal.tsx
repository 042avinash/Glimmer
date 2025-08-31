import React, { useState } from 'react';
import { ShareOptions } from './ShareOptions';
import type { SavedQuote } from '../types';

interface SavedQuotesModalProps {
  onClose: () => void;
  savedQuotes: SavedQuote[];
}

export const SavedQuotesModal: React.FC<SavedQuotesModalProps> = ({ onClose, savedQuotes }) => {
  const [sharingQuoteId, setSharingQuoteId] = useState<string | null>(null);

  const toggleShare = (quoteId: string) => {
    setSharingQuoteId(prevId => prevId === quoteId ? null : quoteId);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">My Saved Quotes</h2>
              <p className="text-xs text-gray-400 mt-1">
                You can save up to 10 quotes in your browser. When you save an 11th, the oldest quote is removed.
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {savedQuotes.length === 0 ? (
            <p className="text-center text-gray-400">You haven't saved any quotes yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedQuotes.map(quote => (
                <div key={quote.id} className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <div className="relative aspect-square w-full">
                    <img src={quote.imageUrl} alt="Quote background" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <p className={`text-white text-center text-sm drop-shadow-lg ${quote.fontClass}`}>"{quote.quote}"</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className={`text-xs text-gray-300 ${quote.fontClass}`}>- {quote.source}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(quote.createdAt).toLocaleDateString()}</p>
                    <button onClick={() => toggleShare(quote.id)} className="w-full mt-3 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded transition-colors">
                        {sharingQuoteId === quote.id ? 'Close Share Options' : 'Share'}
                    </button>
                    {sharingQuoteId === quote.id && <ShareOptions quote={quote} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};