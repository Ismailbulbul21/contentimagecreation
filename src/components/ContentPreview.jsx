import React, { useState, useRef, useEffect } from 'react';

const ContentPreview = ({ generatedContent, generatedImage, contentType, isLoading, includeTextInImage }) => {
  const [imageWithText, setImageWithText] = useState(null);
  const [textElements, setTextElements] = useState([]);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Default text element template
  const defaultTextElement = {
    text: '',
    fontSize: 42,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 4,
    xPosition: 50,
    yPosition: 25,
    fontFamily: 'Impact',
    textShadow: true,
  };
  
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
    if (generatedContent && textElements.length === 0) {
      const lines = generatedContent.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        // Try to find a headline
        let headline = '';
        for (const line of lines) {
          const lowerLine = line.toLowerCase();
          if (
            lowerLine.includes('headline:') || 
            lowerLine.includes('title:') || 
            lowerLine.includes('heading:') ||
            lowerLine.includes('cinwaan:') // Somali
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
        
        // Create initial text element
        const initialTextElement = {
          ...defaultTextElement,
          text: headline,
          yPosition: 25 // Top area
        };
        
        setTextElements([initialTextElement]);
        setActiveTextIndex(0);
      }
    }
  }, [generatedContent]);

  // Get the active text element
  const activeTextElement = textElements[activeTextIndex] || defaultTextElement;

  // Add a new text element
  const addTextElement = () => {
    const newText = {
      ...defaultTextElement,
      text: 'New Text',
      yPosition: 75 // Position at bottom by default
    };
    
    setTextElements([...textElements, newText]);
    setActiveTextIndex(textElements.length);
  };

  // Remove the active text element
  const removeTextElement = () => {
    if (textElements.length <= 1) {
      // Don't remove the last element, just clear it
      updateTextElement('text', '');
      return;
    }
    
    const newElements = textElements.filter((_, index) => index !== activeTextIndex);
    setTextElements(newElements);
    setActiveTextIndex(Math.min(activeTextIndex, newElements.length - 1));
  };

  // Update a property of the active text element
  const updateTextElement = (property, value) => {
    const updatedElements = textElements.map((element, index) => {
      if (index === activeTextIndex) {
        return { ...element, [property]: value };
      }
      return element;
    });
    
    setTextElements(updatedElements);
  };

  // Handle mouse down for text dragging
  const handleMouseDown = (e) => {
    if (!showTextEditor || includeTextInImage) return;
    
    const container = imageContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialX: activeTextElement.xPosition,
      initialY: activeTextElement.yPosition
    });
    
    // Prevent default behavior like selecting text
    e.preventDefault();
  };

  // Handle mouse move for text dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = imageContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    // Calculate the change in percentage based on container width/height
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100;
    
    // Update position with constraints to keep text within image
    const newX = Math.max(0, Math.min(100, dragStart.initialX + dx));
    const newY = Math.max(0, Math.min(100, dragStart.initialY + dy));
    
    updateTextElement('xPosition', newX);
    updateTextElement('yPosition', newY);
    
    // Prevent default behavior like selecting text
    e.preventDefault();
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (showTextEditor && !includeTextInImage) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [showTextEditor, includeTextInImage, isDragging]);

  // Handle keyboard arrow keys for fine adjustment
  const handleKeyDown = (e) => {
    if (!showTextEditor || includeTextInImage) return;
    
    // Define step size for movement (smaller when holding shift)
    const step = e.shiftKey ? 1 : 5;
    
    let newX = activeTextElement.xPosition;
    let newY = activeTextElement.yPosition;
    
    switch (e.key) {
      case 'ArrowLeft':
        newX = Math.max(0, activeTextElement.xPosition - step);
        break;
      case 'ArrowRight':
        newX = Math.min(100, activeTextElement.xPosition + step);
        break;
      case 'ArrowUp':
        newY = Math.max(0, activeTextElement.yPosition - step);
        break;
      case 'ArrowDown':
        newY = Math.min(100, activeTextElement.yPosition + step);
        break;
      default:
        return; // Exit if not using arrow keys
    }
    
    updateTextElement('xPosition', newX);
    updateTextElement('yPosition', newY);
    
    e.preventDefault(); // Prevent page scrolling
  };

  // Add keyboard event listener
  useEffect(() => {
    if (showTextEditor && !includeTextInImage) {
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showTextEditor, includeTextInImage, activeTextElement]);
  
  // Function to split text into multiple lines
  const renderMultilineText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineArray = [];
    
    for (let n = 0; n < words.length; n++) {
      testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lineArray.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    
    lineArray.push(line);
    
    // Calculate total height to position the block from the middle
    const totalHeight = lineArray.length * lineHeight;
    const startY = y - (totalHeight / 2) + lineHeight / 2;
    
    for (let i = 0; i < lineArray.length; i++) {
      const currentY = startY + (i * lineHeight);
      
      // Apply outline
      ctx.strokeText(lineArray[i], x, currentY);
      // Apply fill
      ctx.fillText(lineArray[i], x, currentY);
    }
  };

  // Generate image with text overlay
  useEffect(() => {
    if (!generatedImage || includeTextInImage || textElements.length === 0) return;
    
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
        
        if (showTextEditor) {
          // Draw each text element
          textElements.forEach((element, index) => {
            if (!element.text) return;
            
            // Calculate position based on percentages
            const x = (element.xPosition / 100) * canvas.width;
            const y = (element.yPosition / 100) * canvas.height;
            
            // Draw text with settings
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `bold ${element.fontSize}px ${element.fontFamily}`;
            
            // If text shadow is enabled, add shadow
            if (element.textShadow) {
              ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
              ctx.shadowBlur = element.fontSize / 6;
              ctx.shadowOffsetX = element.fontSize / 25;
              ctx.shadowOffsetY = element.fontSize / 25;
            }
            
            // Create multiple strokes for thicker outline
            const strokeWidth = element.strokeWidth || element.fontSize / 10;
            ctx.strokeStyle = element.strokeColor;
            ctx.lineWidth = strokeWidth;
            
            // Calculate maximum width for text wrapping (70% of canvas width)
            const maxWidth = canvas.width * 0.7;
            const lineHeight = element.fontSize * 1.2; // 120% of font size
            
            // Use multiline rendering if text contains line breaks or is long
            if (element.text.includes('\n') || ctx.measureText(element.text).width > maxWidth) {
              // Handle explicit line breaks first
              const textParts = element.text.split('\n');
              let yOffset = 0;
              
              textParts.forEach((part, index) => {
                // For each explicit line break, render with word wrapping
                renderMultilineText(
                  ctx, 
                  part, 
                  x, 
                  y + yOffset, 
                  maxWidth, 
                  lineHeight
                );
                
                // Calculate approximate lines for this part and adjust offset
                const metrics = ctx.measureText(part);
                const approxLines = Math.max(1, Math.ceil(metrics.width / maxWidth));
                yOffset += approxLines * lineHeight;
              });
            } else {
              // Simple case - just draw the text
              ctx.strokeText(element.text, x, y);
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
              ctx.fillStyle = element.color;
              ctx.fillText(element.text, x, y);
            }
            
            // Reset shadow for the fill
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          });
          
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
  }, [generatedImage, textElements, showTextEditor, includeTextInImage]);

  const handleTextChange = (e) => {
    updateTextElement('text', e.target.value);
  };

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs (for boolean values)
    if (type === 'checkbox') {
      updateTextElement(name, checked);
    } else {
      updateTextElement(name, value);
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
            <div 
              className="relative" 
              ref={imageContainerRef} 
              onMouseDown={handleMouseDown}
              style={{ cursor: showTextEditor && !includeTextInImage ? 'move' : 'default' }}
            >
              <img 
                src={displayImage} 
                alt="Generated promotional content" 
                className="w-full h-auto rounded-lg shadow-lg border border-gray-200" // Added border and stronger shadow
              />
              <canvas ref={canvasRef} className="hidden" /> {/* Hidden canvas for image processing */}
              
              {showTextEditor && !includeTextInImage && (
                <div className="absolute inset-0 select-none">
                  <div className="absolute top-0 left-0 right-0 text-xs text-center p-1 bg-black bg-opacity-50 text-white rounded-t-lg">
                    {isDragging ? 'Release to place text' : 'Drag to move text anywhere on the image'}
                  </div>
                  
                  {/* Position indicator for active text */}
                  {textElements.map((element, index) => (
                    <div 
                      key={index}
                      className={`absolute bg-blue-500 border-2 rounded-md pointer-events-none ${
                        index === activeTextIndex 
                          ? 'bg-opacity-20 border-blue-500 border-dashed'
                          : 'bg-opacity-0 border-green-500 border-dotted'
                      }`}
                      style={{
                        left: `${element.xPosition - 5}%`,
                        top: `${element.yPosition - 5}%`,
                        width: '10%',
                        height: '10%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Text Editor Panel */}
            {showTextEditor && !includeTextInImage && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">
                    Text Editor <span className="text-xs text-gray-500 ml-2">
                      Position: X: {Math.round(activeTextElement.xPosition)}%, Y: {Math.round(activeTextElement.yPosition)}%
                    </span>
                  </h3>
                  
                  <div className="flex gap-2">
                    {/* Text element selector */}
                    <select 
                      className="text-sm border rounded py-1 px-2"
                      value={activeTextIndex}
                      onChange={(e) => setActiveTextIndex(Number(e.target.value))}
                    >
                      {textElements.map((element, idx) => (
                        <option key={idx} value={idx}>
                          Text {idx + 1}: {element.text.substring(0, 10)}{element.text.length > 10 ? '...' : ''}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={addTextElement}
                      className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                      title="Add new text element"
                    >
                      + Add
                    </button>
                    
                    <button
                      onClick={removeTextElement}
                      className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                      title="Remove this text element"
                      disabled={textElements.length <= 1 && !activeTextElement.text}
                    >
                      - Remove
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <input 
                      type="text" 
                      value={activeTextElement.text} 
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
                        value={activeTextElement.fontFamily}
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
                        value={activeTextElement.fontSize} 
                        onChange={handleSettingChange}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center">{activeTextElement.fontSize}px</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Text Color</label>
                      <input 
                        type="color" 
                        name="color" 
                        value={activeTextElement.color} 
                        onChange={handleSettingChange}
                        className="w-full h-8"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Outline Color</label>
                      <input 
                        type="color" 
                        name="strokeColor" 
                        value={activeTextElement.strokeColor} 
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
                        value={activeTextElement.strokeWidth} 
                        onChange={handleSettingChange}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center">{activeTextElement.strokeWidth}px</div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="textShadow"
                        name="textShadow"
                        checked={activeTextElement.textShadow}
                        onChange={handleSettingChange}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="textShadow" className="text-sm font-medium">
                        Add Drop Shadow
                      </label>
                    </div>
                    
                    {/* Add preset position buttons */}
                    <div className="col-span-2 mt-2">
                      <label className="block text-sm font-medium mb-1">Quick Position</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => updateTextElement('yPosition', 15)}
                          className="py-1 px-2 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                        >
                          Top
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateTextElement('xPosition', 50);
                            updateTextElement('yPosition', 50);
                          }}
                          className="py-1 px-2 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                        >
                          Center
                        </button>
                        <button
                          type="button"
                          onClick={() => updateTextElement('yPosition', 85)}
                          className="py-1 px-2 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                        >
                          Bottom
                        </button>
                      </div>
                    </div>
                    
                    {/* Keyboard shortcut information */}
                    <div className="col-span-2 mt-3 text-xs text-gray-500 border-t pt-2">
                      <p className="font-medium mb-1">Keyboard Shortcuts:</p>
                      <ul className="space-y-1">
                        <li>• Arrow keys: Move text (5% steps)</li>
                        <li>• Shift + Arrow keys: Fine adjustment (1% steps)</li>
                        <li>• Click and drag: Direct positioning</li>
                      </ul>
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