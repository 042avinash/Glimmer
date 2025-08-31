import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, SavedQuote, GeneratedQuote } from '../types';

interface AuthContextType {
  currentUser: User | null;
  savedQuotes: SavedQuote[];
  login: (username: string) => boolean;
  logout: () => void;
  register: (username: string) => boolean;
  saveQuote: (quote: GeneratedQuote) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);

  useEffect(() => {
    // Check for logged in user on component mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      loadSavedQuotes(user.username);
    }
  }, []);

  const loadSavedQuotes = useCallback((username: string) => {
    const storedQuotes = localStorage.getItem(`saved_quotes__${username}`);
    if (storedQuotes) {
      setSavedQuotes(JSON.parse(storedQuotes));
    } else {
      setSavedQuotes([]);
    }
  }, []);

  const login = useCallback((username: string): boolean => {
    const normalizedUsername = username.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Find the actual username key, ignoring case
    const existingUserKey = Object.keys(users).find(key => key.toLowerCase() === normalizedUsername);

    if (existingUserKey) {
      // Use the original cased key for consistency
      const user = { username: existingUserKey };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      loadSavedQuotes(existingUserKey);
      return true;
    }
    return false;
  }, [loadSavedQuotes]);

  const register = useCallback((username: string): boolean => {
    const normalizedUsername = username.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Find if a user already exists, ignoring case
    const existingUserKey = Object.keys(users).find(key => key.toLowerCase() === normalizedUsername);

    if (existingUserKey) {
      return false; // User already exists
    }

    // If not, register with the provided casing
    users[username] = {}; // Store user (no password for this mock)
    localStorage.setItem('users', JSON.stringify(users));
    
    // Automatically log in after registration
    const user = { username };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setSavedQuotes([]); // Start with empty quotes
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setSavedQuotes([]);
    localStorage.removeItem('currentUser');
  }, []);

  const saveQuote = useCallback((quote: GeneratedQuote) => {
    if (!currentUser) return;

    const newQuote: SavedQuote = {
      ...quote,
      id: new Date().toISOString(),
      createdAt: Date.now(),
    };

    setSavedQuotes(prevQuotes => {
      const updatedQuotes = [newQuote, ...prevQuotes];
      localStorage.setItem(`saved_quotes__${currentUser.username}`, JSON.stringify(updatedQuotes));
      return updatedQuotes;
    });
  }, [currentUser]);


  const value = { currentUser, savedQuotes, login, logout, register, saveQuote };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};