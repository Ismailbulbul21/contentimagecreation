import React, { createContext, useState, useContext, useEffect } from 'react';

// Create translations
const translations = {
  en: {
    appTitle: 'Local Business Promotional Content Creator',
    appDescription: 'Create engaging marketing materials with the power of AI',
    businessType: 'Business Type',
    promotionDetails: 'Promotion Details',
    targetAudience: 'Target Audience',
    contentType: 'Content Type',
    generateContent: 'Generate Content',
    imageStyle: 'Image Style',
    includeTextInImage: 'Include text in image',
    aiModel: 'AI Model',
    loading: 'Creating your promotional content...',
    savedTemplates: 'Saved Templates',
    useTemplate: 'Use',
    generatedContent: 'Generated Text',
    promotionalImage: 'Promotional Image',
    copyText: 'Copy Text',
    downloadText: 'Download Text',
    downloadImage: 'Download Image',
    addEditText: 'Add/Edit Text',
    hideTextEditor: 'Hide Text Editor',
    textEditor: 'Text Editor',
    text: 'Text',
    font: 'Font',
    fontSize: 'Font Size',
    textColor: 'Text Color',
    outlineColor: 'Outline Color',
    outlineWidth: 'Outline Width',
    addDropShadow: 'Add Drop Shadow',
    position: 'Position',
    businessTypePlaceholder: 'Enter your business type',
    promotionDetailsPlaceholder: 'Describe your promotion or special offer',
    targetAudiencePlaceholder: 'Who is your target audience?',
  },
  so: {
    appTitle: 'Abuurka Waxa Lagu Dhejiyo Ganacsiga Maxaliga ah',
    appDescription: 'Samee waxyaabo ganacsi oo soo jiita adigoo isticmaalaya xoogga AI',
    businessType: 'Nooca Ganacsiga',
    promotionDetails: 'Faahfaahinta Dhejinta',
    targetAudience: 'Dadka Loo Jeedo',
    contentType: 'Nooca Qoraalka',
    generateContent: 'Samee Qoraal',
    imageStyle: 'Qaabka Sawirka',
    includeTextInImage: 'Ku dar qoraal sawirka',
    aiModel: 'Nooca AI',
    loading: 'Waxaa lagu sameynayaa qoraalkaaga...',
    savedTemplates: 'Qaababka La Keydsaday',
    useTemplate: 'Isticmaal',
    generatedContent: 'Qoraalka La Sameeyay',
    promotionalImage: 'Sawirka Dhejinta',
    copyText: 'Koobiyee Qoraalka',
    downloadText: 'Dajiso Qoraalka',
    downloadImage: 'Dajiso Sawirka',
    addEditText: 'Ku dar/Wax ka Bedel Qoraalka',
    hideTextEditor: 'Qari Qoraalka',
    textEditor: 'Hagaajiye Qoraal',
    text: 'Qoraal',
    font: 'Far',
    fontSize: 'Xajmiga Farta',
    textColor: 'Midabka Qoraalka',
    outlineColor: 'Midabka Xarriiqda',
    outlineWidth: 'Ballaca Xarriiqda',
    addDropShadow: 'Ku dar Hooska',
    position: 'Goobta',
    businessTypePlaceholder: 'Geli nooca ganacsigaaga',
    promotionDetailsPlaceholder: 'Sharax dhejintaada ama bandhigaaga gaarka ah',
    targetAudiencePlaceholder: 'Yay yihiin dadka aad u jeeddo?',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [texts, setTexts] = useState(translations.en);

  useEffect(() => {
    // Update texts when language changes
    setTexts(translations[currentLanguage]);
  }, [currentLanguage]);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, texts, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext; 