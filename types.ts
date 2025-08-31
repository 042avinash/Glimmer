// FIX: Define the missing User type, which is used in AuthContext.tsx.
export interface User {
  username: string;
}

export interface QuoteDetails {
  quote: string;
  source: string;
  imagePrompt: string;
  fontSuggestion: string;
}

export interface GeneratedQuote {
  quote: string;
  source: string;
  imageUrl: string;
  fontClass: string;
}

export interface SavedQuote extends GeneratedQuote {
  id: string;
  createdAt: number;
}
