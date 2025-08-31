
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      <p className="mt-4 text-lg text-gray-400">AI is thinking...</p>
      <p className="mt-1 text-sm text-gray-500">Generating your masterpiece, please wait.</p>
    </div>
  );
};
