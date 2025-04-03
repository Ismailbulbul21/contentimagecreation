import React, { useState, useEffect } from 'react';
import AutocompleteInput from "./AutocompleteInput";
import { businessTypes, targetAudiences, getPromotionIdeas } from "../utils/autocompleteData";
import { useLanguage } from '../context/LanguageContext';

const ContentForm = ({ onSubmit, isLoading, initialData }) => {
  const { texts, currentLanguage } = useLanguage();
  
  // Content type options with translations
  const CONTENT_TYPES = [
    { value: 'social-post', label: currentLanguage === 'en' ? 'Social Media Post' : 'Boostada Baraha Bulshada' },
    { value: 'flyer', label: currentLanguage === 'en' ? 'Promotional Flyer' : 'Warqada Dhejinta' },
    { value: 'email', label: currentLanguage === 'en' ? 'Email Campaign' : 'Ololaha Emailka' },
    { value: 'ad-copy', label: currentLanguage === 'en' ? 'Advertisement Copy' : 'Qoraalka Xayeysiinta' },
    { value: 'tagline', label: currentLanguage === 'en' ? 'Business Tagline/Slogan' : 'Hadalqaadka Ganacsiga' }
  ];

  // Image style options with translations
  const IMAGE_STYLES = [
    { value: 'modern', label: currentLanguage === 'en' ? 'Modern & Clean' : 'Casri & Nadiif' },
    { value: 'vibrant', label: currentLanguage === 'en' ? 'Vibrant & Colorful' : 'Nuuraya & Midabaysan' },
    { value: 'vintage', label: currentLanguage === 'en' ? 'Vintage/Retro' : 'Hore/Dhaqameed' },
    { value: 'elegant', label: currentLanguage === 'en' ? 'Elegant & Sophisticated' : 'Qurux & Casri' },
    { value: 'friendly', label: currentLanguage === 'en' ? 'Friendly & Approachable' : 'Saaxiibtinimo & Fudud' }
  ];

  // AI model options with translations
  const AI_MODELS = [
    { value: 'gemini', label: 'Gemini AI' },
    { value: 'deepseek', label: 'DeepSeek AI' }
  ];

  const [formData, setFormData] = useState({
    businessType: '',
    promotionDetails: '',
    targetAudience: '',
    contentType: 'social-post',
    imageStyle: 'modern',
    aiModel: 'gemini',
    includeTextInImage: false
  });
  
  const [promotionSuggestions, setPromotionSuggestions] = useState([]);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  // Update promotion suggestions when business type changes
  useEffect(() => {
    if (formData.businessType) {
      setPromotionSuggestions(getPromotionIdeas(formData.businessType));
    }
  }, [formData.businessType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {currentLanguage === 'en' ? 'Create Promotional Content' : 'Samee Qoraalka Dhejinta'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <AutocompleteInput
            id="businessType"
            name="businessType"
            label={texts.businessType}
            value={formData.businessType}
            onChange={handleChange}
            placeholder={texts.businessTypePlaceholder}
            suggestions={businessTypes}
            required
          />
        </div>

        <div className="mb-4">
          <AutocompleteInput
            id="promotionDetails"
            name="promotionDetails"
            label={texts.promotionDetails}
            value={formData.promotionDetails}
            onChange={handleChange}
            placeholder={texts.promotionDetailsPlaceholder}
            suggestions={promotionSuggestions}
            required
            className="h-24" // Make this input taller like a textarea
          />
        </div>

        <div className="mb-4">
          <AutocompleteInput
            id="targetAudience"
            name="targetAudience"
            label={texts.targetAudience}
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder={texts.targetAudiencePlaceholder}
            suggestions={targetAudiences}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="contentType" className="block mb-2 font-medium">
              {texts.contentType}
            </label>
            <select
              id="contentType"
              name="contentType"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.contentType}
              onChange={handleChange}
            >
              {CONTENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imageStyle" className="block mb-2 font-medium">
              {texts.imageStyle}
            </label>
            <select
              id="imageStyle"
              name="imageStyle"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.imageStyle}
              onChange={handleChange}
            >
              {IMAGE_STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="aiModel" className="block mb-2 font-medium">
              {texts.aiModel}
            </label>
            <select
              id="aiModel"
              name="aiModel"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.aiModel}
              onChange={handleChange}
            >
              {AI_MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="includeTextInImage"
            name="includeTextInImage"
            className="mr-2 h-4 w-4 rounded focus:ring-2 focus:ring-blue-500"
            checked={formData.includeTextInImage}
            onChange={handleChange}
          />
          <label htmlFor="includeTextInImage" className="font-medium">
            {texts.includeTextInImage}
          </label>
          <span className="ml-2 text-xs text-gray-500">
            {currentLanguage === 'en' 
              ? '(The headline will be extracted from the generated content)' 
              : '(Cinwaanka waxaa laga soo saari doonaa qoraalka la sameeyay)'}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading 
            ? (currentLanguage === 'en' ? 'Generating...' : 'Waa la sameynayaa...') 
            : texts.generateContent}
        </button>
      </form>
    </div>
  );
};

export default ContentForm; 