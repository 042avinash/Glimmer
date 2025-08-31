
import React, { useState } from 'react';

interface QuoteInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const examplePrompts = [
  "An inspiring quote about space exploration",
  "A quote from the movie The Matrix",
  "A stoic quote about overcoming adversity",
  "Something funny said by a comedian",
];

export const QuoteInput: React.FC<QuoteInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };
  
  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <form onSubmit={handleSubmit}>
        <label htmlFor="quote-prompt" className="block mb-2 text-lg font-medium text-gray-300">
          What kind of quote are you looking for?
        </label>
        <textarea
          id="quote-prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-white placeholder-gray-500"
          placeholder="e.g., give me an uplifting quote from a philosopher"
          disabled={isLoading}
        />
        <div className="mt-2 text-sm text-gray-500">
            Feeling stuck? Try one of these:
            <div className="flex flex-wrap gap-2 mt-2">
                {examplePrompts.map(ex => (
                    <button 
                        key={ex} 
                        type="button" 
                        onClick={() => handleExampleClick(ex)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded-full transition-colors"
                        disabled={isLoading}
                    >
                        {ex}
                    </button>
                ))}
            </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </button>
      </form>
    </div>
  );
};
