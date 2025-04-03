import React, { useState, useEffect } from 'react';

const SavedTemplatesSection = ({ onLoadTemplate }) => {
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load saved templates from localStorage when component mounts
  useEffect(() => {
    const templates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    setSavedTemplates(templates);
  }, []);

  const handleDeleteTemplate = (index) => {
    const updatedTemplates = [...savedTemplates];
    updatedTemplates.splice(index, 1);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
  };

  if (savedTemplates.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-semibold">
          Your Saved Templates ({savedTemplates.length})
        </h2>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedTemplates.map((template, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2">{template.businessType}</h3>
              <p className="text-sm text-gray-600 mb-2 truncate">{template.promotionDetails}</p>
              <p className="text-xs text-gray-500 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {template.contentType === 'social-post' 
                    ? 'Social Media' 
                    : template.contentType.charAt(0).toUpperCase() + template.contentType.slice(1)}
                </span>
                <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {template.imageStyle.charAt(0).toUpperCase() + template.imageStyle.slice(1)}
                </span>
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => onLoadTemplate(template)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Load
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(index);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTemplatesSection; 