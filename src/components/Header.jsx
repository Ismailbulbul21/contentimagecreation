import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-3xl font-bold mr-2">
              <span className="text-yellow-300">Promo</span>Gen
            </div>
            <span className="text-sm bg-white/20 px-2 py-1 rounded">Beta</span>
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-xl font-light mb-1">Local Business Promotional Content Creator</h1>
            <p className="text-sm text-white/80">Create engaging marketing materials with the power of AI</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 