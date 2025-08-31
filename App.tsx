import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { QuoteInput } from './components/QuoteInput';
import { QuoteDisplay } from './components/QuoteDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SavedQuotesModal } from './components/SavedQuotesModal';
import { generateQuoteDetails, generateQuoteImage } from './services/geminiService';
import type { GeneratedQuote, QuoteDetails, SavedQuote } from './types';

// Declare htmlToImage as it's loaded from a script in index.html
declare const htmlToImage: any;

const mapFontSuggestionToClass = (suggestion: string): string => {
  const s = suggestion.toLowerCase();
  if (s.includes('retro') || s.includes('8-bit') || s.includes('pixel')) return "font-['Press_Start_2P']";
  if (s.includes('elegant') || s.includes('serif') || s.includes('formal')) return "font-['Playfair_Display']";
  if (s.includes('script') || s.includes('handwritten') || s.includes('cursive')) return "font-['Dancing_Script']";
  if (s.includes('sci-fi') || s.includes('futuristic') || s.includes('tech')) return "font-['Orbitron']";
  if (s.includes('classic') || s.includes('book') || s.includes('traditional')) return "font-['Lora']";
  return "font-['Montserrat']"; // Default for 'modern', 'sans-serif', etc.
};


function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuote, setGeneratedQuote] = useState<GeneratedQuote | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [isQuotesModalOpen, setQuotesModalOpen] = useState(false);
  const [isViewOnlyMode, setViewOnlyMode] = useState(false);
  
  const quoteDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for shared quote in URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const sharedQuoteData = urlParams.get('quote');
    if (sharedQuoteData) {
      try {
        const decodedJson = atob(sharedQuoteData);
        const quote: GeneratedQuote = JSON.parse(decodedJson);
        setGeneratedQuote(quote);
        setViewOnlyMode(true);
      } catch (e) {
        console.error("Failed to parse shared quote:", e);
        setError("The shared quote link is invalid or corrupted.");
      }
    } else {
       // Load saved quotes from local storage on initial load if not in view-only mode
      try {
        const storedQuotes = localStorage.getItem('saved_quotes');
        if (storedQuotes) {
          setSavedQuotes(JSON.parse(storedQuotes));
        }
      } catch (e) {
        console.error("Failed to parse saved quotes from localStorage:", e);
        setSavedQuotes([]);
      }
    }
  }, []);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedQuote(null);

    try {
      const quoteDetails: QuoteDetails = await generateQuoteDetails(prompt);
      const imageUrl = await generateQuoteImage(quoteDetails.imagePrompt);
        const fontClass = mapFontSuggestionToClass(quoteDetails.fontSuggestion);

    setGeneratedQuote({
      quote: quoteDetails.quote,
      source: quoteDetails.source,
      imageUrl, // already a valid blob URL
      fontClass,
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDownload = useCallback(() => {
    if (!quoteDisplayRef.current) {
      setError("Cannot download image. Reference not found.");
      return;
    }
    htmlToImage.toPng(quoteDisplayRef.current, { cacheBust: true, })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = 'quote-image.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err: Error) => {
        console.error('oops, something went wrong!', err);
        setError("Failed to generate image for download.");
      });
  }, []);
  
  const saveQuote = useCallback((quote: GeneratedQuote) => {
    const newQuote: SavedQuote = {
      ...quote,
      id: new Date().toISOString(),
      createdAt: Date.now(),
    };

    setSavedQuotes(prevQuotes => {
      // Add new quote to the front
      let updatedQuotes = [newQuote, ...prevQuotes];
      // If we exceed the limit of 10, remove the oldest one (from the end)
      if (updatedQuotes.length > 10) {
        updatedQuotes = updatedQuotes.slice(0, 10);
      }
      localStorage.setItem('saved_quotes', JSON.stringify(updatedQuotes));
      return updatedQuotes;
    });
  }, []);

  const isCurrentQuoteSaved = useMemo(() => {
    if (!generatedQuote) return false;
    return savedQuotes.some(q => q.quote === generatedQuote.quote && q.imageUrl === generatedQuote.imageUrl);
  }, [generatedQuote, savedQuotes]);

  const handleSaveQuote = useCallback(() => {
    if (generatedQuote && !isCurrentQuoteSaved) {
      saveQuote(generatedQuote);
    }
  }, [generatedQuote, isCurrentQuoteSaved, saveQuote]);

  if (isViewOnlyMode && generatedQuote) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
        <div 
          className="w-full max-w-2xl aspect-square relative overflow-hidden rounded-xl shadow-2xl bg-black flex items-center justify-center p-8 sm:p-12"
        >
          <img src={generatedQuote.imageUrl} alt="AI generated background" className="absolute top-0 left-0 w-full h-full object-cover" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
          <div className="relative text-center z-10 text-white flex flex-col items-center">
            <p className={`text-3xl md:text-4xl lg:text-5xl leading-tight drop-shadow-lg ${generatedQuote.fontClass}`}>
              "{generatedQuote.quote}"
            </p>
            <p className={`mt-6 text-xl md:text-2xl font-semibold opacity-90 drop-shadow-md ${generatedQuote.fontClass}`}>
              - {generatedQuote.source}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setQuotesModalOpen(true)}
          className="text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors shadow-lg"
        >
          My Saved Quotes ({savedQuotes.length})
        </button>
      </div>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Header />
          <main>
            <QuoteInput onSubmit={handleGenerate} isLoading={isLoading} />
            {error && (
              <div className="mt-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
            {isLoading && <LoadingSpinner />}
            {generatedQuote && !isLoading && (
              <QuoteDisplay 
                quoteData={generatedQuote}
                onDownload={handleDownload}
                onSave={handleSaveQuote}
                isSaved={isCurrentQuoteSaved}
                ref={quoteDisplayRef} 
              />
            )}
          </main>
        </div>
      </div>
      {isQuotesModalOpen && <SavedQuotesModal savedQuotes={savedQuotes} onClose={() => setQuotesModalOpen(false)} />}
    </>
  );
}

export default App;