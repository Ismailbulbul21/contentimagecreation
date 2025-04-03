import React, { useState, useEffect, useRef } from "react";

const AutocompleteInput = ({
  value,
  onChange,
  suggestions,
  placeholder,
  label,
  id,
  name,
  required = false,
  className = "",
  getSuggestionText = (item) => item, // Function to get text to display in dropdown (for objects)
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const wrapperRef = useRef(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (!value) {
      setFilteredSuggestions([]);
      return;
    }

    const lowerCaseInput = value.toLowerCase();
    const filtered = suggestions
      .filter((suggestion) => {
        // Handle both string and object suggestions
        const text = typeof suggestion === "string" 
          ? suggestion.toLowerCase() 
          : getSuggestionText(suggestion).toLowerCase();
        
        return text.includes(lowerCaseInput);
      })
      .slice(0, 8); // Limit to 8 suggestions

    setFilteredSuggestions(filtered);
  }, [value, suggestions, getSuggestionText]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleChange = (e) => {
    onChange(e);
    setShowSuggestions(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    // Handle both string and object suggestions
    const suggestionValue = typeof suggestion === "string" 
      ? suggestion 
      : getSuggestionText(suggestion);
    
    // Create a synthetic event object to mimic an input change
    const event = {
      target: {
        name,
        value: suggestionValue,
      },
    };
    
    onChange(event);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="block mb-2 font-medium">
          {label}
        </label>
      )}
      <input
        type="text"
        id={id}
        name={name}
        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => {
          setInputFocus(true);
          setShowSuggestions(true);
        }}
        onBlur={() => {
          // Delayed to allow suggestion click to register
          setTimeout(() => setInputFocus(false), 200);
        }}
        required={required}
      />
      
      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && inputFocus && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => {
            // Get text to display
            const suggestionText = typeof suggestion === "string" 
              ? suggestion 
              : getSuggestionText(suggestion);
              
            return (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestionText}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput; 