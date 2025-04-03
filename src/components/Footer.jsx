import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { currentLanguage } = useLanguage();
  
  const translations = {
    en: {
      poweredBy: "Powered by advanced AI technologies:",
      disclaimer: "This tool generates AI-powered marketing content for small businesses.",
      copyright: `© ${new Date().getFullYear()} KaHel. All generated content should be reviewed before use.`
    },
    so: {
      poweredBy: "Waxaa lagu dhisay tignoolajiyada AI ee horumarsan:",
      disclaimer: "Qalabkani wuxuu sameeya qoraal ganacsi oo lagu sameeyay AI ganacsiyada yaryar.",
      copyright: `© ${new Date().getFullYear()} KaHel. Dhammaan qoraalka la sameeyay waa in la eego ka hor inta aan la isticmaalin.`
    }
  };

  const text = translations[currentLanguage];

  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-lg font-bold mb-2">
              <span className="text-yellow-300">Ka</span>Hel
            </div>
            <p className="text-sm text-gray-400">
              {text.poweredBy}
            </p>
            <div className="flex space-x-4 mt-2">
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">Gemini AI</span>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">DeepSeek</span>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">Hugging Face</span>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400 mb-2">
              {text.disclaimer}
            </p>
            <p className="text-xs text-gray-500">
              {text.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 