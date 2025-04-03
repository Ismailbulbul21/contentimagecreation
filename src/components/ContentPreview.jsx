import React, { useState, useRef, useEffect } from 'react';

const ContentPreview = ({ generatedContent, generatedImage, contentType, isLoading, includeTextInImage }) => {
  const [imageWithText, setImageWithText] = useState(null);
  const [customTextSettings, setCustomTextSettings] = useState({
    text: '',
    fontSize: 42, // Increased from 36
    color: '#ffffff', // White text
    strokeColor: '#000000', // Black outline
    strokeWidth: 4, // New setting for outline thickness
    xPosition: 50, // percentage - center
    yPosition: 25, // percentage - moved down a bit from top
    fontFamily: 'Impact', // Default font changed to Impact which is great for memes/promotions
    textShadow: true, // New setting for adding drop shadow
  });
  const [showTextEditor, setShowTextEditor] = useState(false);
  const canvasRef = useRef(null);

  // Available fonts for the text editor
  const availableFonts = [
    { value: 'Impact', label: 'Impact' },
    { value: 'Arial Black', label: 'Arial Black' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Comic Sans MS', label: 'Comic Sans' },
  ];

  // Extract headline from generated content for default text overlay
  useEffect(() => {
    if (generatedContent && !customTextSettings.text) {
      const lines = generatedContent.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        // Try to find a headline
        let headline = '';
        for (const line of lines) {
          const lowerLine = line.toLowerCase();
          if (
            lowerLine.includes('headline:') || 
            lowerLine.includes('title:') || 
            lowerLine.includes('heading:')
          ) {
            headline = line.split(':')[1]?.trim() || '';
            break;
          }
        }
        // If no explicit headline found, use the first line
        if (!headline) headline = lines[0].trim();
        
        // Limit headline length to avoid text overflow in image
        const maxLength = 50;
        if (headline.length > maxLength) {
          headline = headline.substring(0, maxLength) + '...';
        }
        
        setCustomTextSettings(prev => ({ ...prev, text: headline }));
      }
    }
  }, [generatedContent]);

  // Generate image with text overlay
  useEffect(() => {
    if (!generatedImage || includeTextInImage) return;
    
    const drawTextOnImage = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        if (showTextEditor && customTextSettings.text) {
          // Calculate position based on percentages
          const x = (customTextSettings.xPosition / 100) * canvas.width;
          const y = (customTextSettings.yPosition / 100) * canvas.height;
          
          // Draw text with settings
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = `bold ${customTextSettings.fontSize}px ${customTextSettings.fontFamily}`;
          
          // If text shadow is enabled, add shadow
          if (customTextSettings.textShadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = customTextSettings.fontSize / 6;
            ctx.shadowOffsetX = customTextSettings.fontSize / 25;
            ctx.shadowOffsetY = customTextSettings.fontSize / 25;
          }
          
          // Create multiple strokes for thicker outline
          const strokeWidth = customTextSettings.strokeWidth || customTextSettings.fontSize / 10;
          ctx.strokeStyle = customTextSettings.strokeColor;
          ctx.lineWidth = strokeWidth;
          ctx.strokeText(customTextSettings.text, x, y);
          
          // Reset shadow for the fill
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          // Draw text fill
          ctx.fillStyle = customTextSettings.color;
          ctx.fillText(customTextSettings.text, x, y);
          
          // Convert canvas to data URL and set as new image source
          const dataUrl = canvas.toDataURL('image/png');
          setImageWithText(dataUrl);
        } else {
          setImageWithText(generatedImage);
        }
      };
      
      img.src = generatedImage;
    };
    
    drawTextOnImage();
  }, [generatedImage, customTextSettings, showTextEditor, includeTextInImage]);

  const handleTextChange = (e) => {
    setCustomTextSettings(prev => ({ ...prev, text: e.target.value }));
  };

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs (for boolean values)
    if (type === 'checkbox') {
      setCustomTextSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setCustomTextSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleTextEditor = () => {
    setShowTextEditor(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="bg-gray-200 h-48 w-full mb-4 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!generatedContent && !generatedImage) {
    return null;
  }

  // Get the content type label for display
  const getContentTypeLabel = (type) => {
    const contentTypeMap = {
      'social-post': 'Social Media Post',
      'flyer': 'Promotional Flyer',
      'email': 'Email Campaign',
      'ad-copy': 'Advertisement Copy',
      'tagline': 'Business Tagline/Slogan'
    };
    return contentTypeMap[type] || type;
  };

  // Determine which image to display
  const displayImage = imageWithText || generatedImage;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        Generated {getContentTypeLabel(contentType)}
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {generatedImage && (
          <div className="md:w-1/2">
            <div className="mb-2 font-medium flex justify-between items-center">
              <span>Promotional Image</span>
              {!includeTextInImage && (
                <button 
                  onClick={toggleTextEditor} 
                  className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
                >
                  {showTextEditor ? 'Hide Text Editor' : 'Add/Edit Text'}
                </button>
              )}
            </div>
            <div className="relative">
              <img 
                src={displayImage} 
                alt="Generated promotional content" 
                className="w-full h-auto rounded-lg shadow-lg border border-gray-200" // Added border and stronger shadow
              />
              <canvas ref={canvasRef} className="hidden" /> {/* Hidden canvas for image processing */}
            </div>
            
            {/* Text Editor Panel */}
            {showTextEditor && !includeTextInImage && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3">Text Editor</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <input 
                      type="text" 
                      value={customTextSettings.text} 
                      onChange={handleTextChange} 
                      className="w-full p-2 border rounded"
                      placeholder="Enter text to overlay"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Font</label>
                      <select
                        name="fontFamily"
                        value={customTextSettings.fontFamily}
                        onChange={handleSettingChange}
                        className="w-full p-2 border rounded"
                      >
                        {availableFonts.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Font Size</label>
                      <input 
                        type="range" 
                        name="fontSize" 
                        min="24" 
                        max="96" 
                        value={customTextSettings.fontSize} 
                        onChange={handleSettingChange}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center">{customTextSettings.fontSize}px</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Text Color</label>
                      <input 
                        type="color" 
                        name="color" 
                        value={customTextSettings.color} 
                        onChange={handleSettingChange}
                        className="w-full h-8"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Outline Color</label>
                      <input 
                        type="color" 
                        name="strokeColor" 
                        value={customTextSettings.strokeColor} 
                        onChange={handleSettingChange}
                        className="w-full h-8"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Outline Width</label>
                      <input 
                        type="range" 
                        name="strokeWidth" 
                        min="1" 
                        max="10" 
                        value={customTextSettings.strokeWidth} 
                        onChange={handleSettingChange}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center">{customTextSettings.strokeWidth}px</div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="textShadow"
                        name="textShadow"
                        checked={customTextSettings.textShadow}
                        onChange={handleSettingChange}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="textShadow" className="text-sm font-medium">
                        Add Drop Shadow
                      </label>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Position</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs">X: {customTextSettings.xPosition}%</label>
                          <input 
                            type="range" 
                            name="xPosition" 
                            min="0" 
                            max="100" 
                            value={customTextSettings.xPosition} 
                            onChange={handleSettingChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs">Y: {customTextSettings.yPosition}%</label>
                          <input 
                            type="range" 
                            name="yPosition" 
                            min="0" 
                            max="100" 
                            value={customTextSettings.yPosition} 
                            onChange={handleSettingChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-2 flex justify-end">
              <a 
                href={displayImage} 
                download="promotional-image.png"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Image
              </a>
            </div>
          </div>
        )}
        
        {generatedContent && (
          <div className={`${generatedImage ? 'md:w-1/2' : 'w-full'}`}>
            <div className="mb-2 font-medium">Generated Text</div>
            <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200"> {/* Added border */}
              {/* Apply the text with formatting preserved */}
              {generatedContent.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  alert('Content copied to clipboard!');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center mr-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Text
              </button>
              
              {/* Create a download link for the text */}
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(generatedContent)}`}
                download="promotional-content.txt"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Text
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPreview; 