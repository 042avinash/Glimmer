import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center my-8 pt-12 sm:pt-4">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 mb-2 font-['Orbitron']">
        Glimmer
      </h1>
      <p className="text-lg text-gray-400">
        Turn your ideas into stunning, shareable quote images.
      </p>
    </header>
  );
};