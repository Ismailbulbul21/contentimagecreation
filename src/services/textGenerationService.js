import {
    GEMINI_API_KEY,
    DEEPSEEK_API_KEY,
    OPENROUTER_GEMINI_URL,
    OPENROUTER_DEEPSEEK_URL
} from './apiConfig';

/**
 * Generate text using the Gemini API
 * @param {string} prompt - The prompt to generate text from
 * @param {string} language - The language to generate content in ('en' or 'so')
 * @returns {Promise<string>} - The generated text
 */
export const generateWithGemini = async (prompt, language = 'en') => {
    try {
        console.log('Using API key (first 10 chars):', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'Key not found');
        console.log('Using API URL:', OPENROUTER_GEMINI_URL);

        // Modify prompt to include language instruction
        let finalPrompt = prompt;
        if (language === 'so') {
            finalPrompt = `Generate response in Somali language (af-Soomaali). ${prompt}`;
        }

        const response = await fetch(OPENROUTER_GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Local Business Promotional Content Creator'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-pro-exp-03-25:free',
                messages: [
                    {
                        role: 'user',
                        content: finalPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Response Error:', response.status, response.statusText, errorText);
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating text with Gemini:', error);
        throw error;
    }
};

/**
 * Generate text using the DeepSeek API
 * @param {string} prompt - The prompt to generate text from
 * @param {string} language - The language to generate content in ('en' or 'so')
 * @returns {Promise<string>} - The generated text
 */
export const generateWithDeepSeek = async (prompt, language = 'en') => {
    try {
        console.log('Using DeepSeek API key (first 10 chars):', DEEPSEEK_API_KEY ? DEEPSEEK_API_KEY.substring(0, 10) + '...' : 'Key not found');
        console.log('Using DeepSeek API URL:', OPENROUTER_DEEPSEEK_URL);

        // Modify prompt to include language instruction
        let finalPrompt = prompt;
        if (language === 'so') {
            finalPrompt = `Generate response in Somali language (af-Soomaali). ${prompt}`;
        }

        const response = await fetch(OPENROUTER_DEEPSEEK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Local Business Promotional Content Creator'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages: [
                    {
                        role: 'user',
                        content: finalPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('DeepSeek API Response Error:', response.status, response.statusText, errorText);
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating text with DeepSeek:', error);
        throw error;
    }
};

/**
 * Generate promotional content based on business type and promotion details
 * @param {Object} params - The parameters for generating content
 * @param {string} params.businessType - The type of business
 * @param {string} params.promotionDetails - Details about the promotion
 * @param {string} params.targetAudience - The target audience for the promotion
 * @param {string} params.contentType - The type of content to generate (social, flyer, etc.)
 * @param {string} params.model - The model to use (gemini or deepseek)
 * @param {string} params.language - The language to generate content in ('en' or 'so')
 * @returns {Promise<string>} - The generated promotional content
 */
export const generatePromotionalContent = async ({
    businessType,
    promotionDetails,
    targetAudience,
    contentType,
    model = 'gemini',
    language = 'en'
}) => {
    const prompt = `
    Generate compelling promotional content for the following:
    Business Type: ${businessType}
    Promotion Details: ${promotionDetails}
    Target Audience: ${targetAudience}
    Content Type: ${contentType}
    
    The content should be engaging, specific to the business type and target audience, 
    and designed to drive customer action. Include catchy headlines and persuasive language.
    
    For a ${contentType}, provide:
    - A headline/title
    - Main copy text
    - Call to action
    - Any additional relevant sections
    
    Format the response in a clean, organized structure.
  `;

    if (model.toLowerCase() === 'deepseek') {
        return generateWithDeepSeek(prompt, language);
    } else {
        return generateWithGemini(prompt, language);
    }
}; 