import React, { useState, useEffect } from 'react';
import AutocompleteInput from "./AutocompleteInput";
import { businessTypes, targetAudiences, getPromotionIdeas } from "../utils/autocompleteData";

const CONTENT_TYPES = [
  { value: 'social-post', label: 'Social Media Post' },
  { value: 'flyer', label: 'Promotional Flyer' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'ad-copy', label: 'Advertisement Copy' },
  { value: 'tagline', label: 'Business Tagline/Slogan' }
];

const IMAGE_STYLES = [
  { value: 'modern', label: 'Modern & Clean' },
  { value: 'vibrant', label: 'Vibrant & Colorful' },
  { value: 'vintage', label: 'Vintage/Retro' },
  { value: 'elegant', label: 'Elegant & Sophisticated' },
  { value: 'friendly', label: 'Friendly & Approachable' }
];

const AI_MODELS = [
  { value: 'gemini', label: 'Gemini AI' },
  { value: 'deepseek', label: 'DeepSeek AI' }
];

const ContentForm = ({ onSubmit, isLoading, initialData }) => {
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
      <h2 className="text-xl font-semibold mb-4">Create Promotional Content</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <AutocompleteInput
            id="businessType"
            name="businessType"
            label="Business Type"
            value={formData.businessType}
            onChange={handleChange}
            placeholder="e.g., Cafe, Boutique Store, Fitness Studio"
            suggestions={businessTypes}
            required
          />
        </div>

        <div className="mb-4">
          <AutocompleteInput
            id="promotionDetails"
            name="promotionDetails"
            label="Promotion Details"
            value={formData.promotionDetails}
            onChange={handleChange}
            placeholder="Describe your promotion, sale, event, or new product"
            suggestions={promotionSuggestions}
            required
            className="h-24" // Make this input taller like a textarea
          />
        </div>

        <div className="mb-4">
          <AutocompleteInput
            id="targetAudience"
            name="targetAudience"
            label="Target Audience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="e.g., Young professionals, Parents, Local community"
            suggestions={targetAudiences}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="contentType" className="block mb-2 font-medium">
              Content Type
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
              Image Style
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
              AI Text Model
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
            Add headline text to image
          </label>
          <span className="ml-2 text-xs text-gray-500">
            (The headline will be extracted from the generated content)
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
    </div>
  );
};

export default ContentForm; 