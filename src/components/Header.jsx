import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { currentLanguage, texts, changeLanguage } = useLanguage();

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-3xl font-bold mr-2">
              <span className="text-yellow-300">Ka</span>Hel
            </div>
            <span className="text-sm bg-white/20 px-2 py-1 rounded">Beta</span>
          </div>
          
          <div className="flex items-center">
            <select 
              className="mr-4 px-2 py-1 text-sm text-gray-800 bg-white rounded border border-gray-300"
              value={currentLanguage}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="so">Somali</option>
            </select>
            
            <div className="text-center md:text-right">
              <h1 className="text-xl font-light mb-1">{texts.appTitle}</h1>
              <p className="text-sm text-white/80">{texts.appDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 