import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ContentForm from './components/ContentForm';
import ContentPreview from './components/ContentPreview';
import SavedTemplatesSection from './components/SavedTemplatesSection';
import { generatePromotionalContent } from './services/textGenerationService';
import { generatePromotionalImage } from './services/imageGenerationService';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [contentType, setContentType] = useState('social-post');
  const [formData, setFormData] = useState(null);
  const [includeTextInImage, setIncludeTextInImage] = useState(false);

  // Extract the headline from generated text content
  const extractHeadline = (content) => {
    if (!content) return '';
    
    // Try to find a headline - usually the first line or text after "Headline:" or "Title:"
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return '';
    
    // Check for explicit headline markers
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (
        lowerLine.includes('headline:') || 
        lowerLine.includes('title:') || 
        lowerLine.includes('heading:')
      ) {
        // Return the text after the colon
        return line.split(':')[1]?.trim() || '';
      }
    }
    
    // If no explicit marker, use the first line
    return lines[0].trim();
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setContentType(data.contentType);
    setFormData(data);
    setIncludeTextInImage(data.includeTextInImage || false);
    
    try {
      // First generate the text content
      const contentResult = await generatePromotionalContent({
        businessType: data.businessType,
        promotionDetails: data.promotionDetails,
        targetAudience: data.targetAudience,
        contentType: data.contentType,
        model: data.aiModel
      });
      
      setGeneratedContent(contentResult);
      
      // Extract headline from generated content
      const headline = extractHeadline(contentResult);
      
      // Then generate the image, optionally with text
      const imageResult = await generatePromotionalImage({
        businessType: data.businessType,
        promotionDetails: data.promotionDetails,
        style: data.imageStyle,
        contentType: data.contentType,
        includeText: data.includeTextInImage || false,
        headlineText: headline
      });
      
      setGeneratedImage(imageResult);
      
      // Save template to localStorage
      saveTemplate(data);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('An error occurred while generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadTemplate = (template) => {
    setFormData(template);
    // You might want to scroll to the form
    document.querySelector('#content-form').scrollIntoView({ behavior: 'smooth' });
  };

  // Save the current template to localStorage
  const saveTemplate = (template) => {
    const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    
    // Check if we already have this template
    const templateExists = savedTemplates.some(
      t => t.businessType === template.businessType && 
          t.promotionDetails === template.promotionDetails
    );
    
    if (!templateExists) {
      const updatedTemplates = [...savedTemplates, template];
      // Keep only the last 10 templates
      while (updatedTemplates.length > 10) {
        updatedTemplates.shift();
      }
      localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <SavedTemplatesSection onLoadTemplate={handleLoadTemplate} />
        
        <div id="content-form">
          <ContentForm onSubmit={handleFormSubmit} isLoading={isLoading} initialData={formData} />
        </div>
        
        <ContentPreview 
          generatedContent={generatedContent}
          generatedImage={generatedImage}
          contentType={contentType}
          isLoading={isLoading}
          includeTextInImage={includeTextInImage}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;