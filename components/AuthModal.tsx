import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
        setError("Username cannot be empty.");
        return;
    }

    let success = false;
    if (isLoginView) {
      success = login(username);
      if (!success) {
        setError("User does not exist. Please sign up.");
      }
    } else {
      success = register(username);
      if (!success) {
        setError("Username is already taken.");
      }
    }

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center mb-4">{isLoginView ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
            placeholder="Enter your username"
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button type="submit" className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">
            {isLoginView ? 'Login' : 'Create Account'}
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-4">
          Note: This is a client-side implementation. Clearing your browser cache for this site will delete your account and saved quotes.
        </p>
        <p className="text-center mt-4 text-sm text-gray-400">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => {setIsLoginView(!isLoginView); setError(null);}} className="text-indigo-400 hover:underline">
            {isLoginView ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};