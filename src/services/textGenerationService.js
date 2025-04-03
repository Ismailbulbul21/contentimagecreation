import {
    GEMINI_API_KEY,
    DEEPSEEK_API_KEY,
    OPENROUTER_GEMINI_URL,
    OPENROUTER_DEEPSEEK_URL
} from './apiConfig';

// Fallback sample responses if API fails
const FALLBACK_RESPONSES = {
    en: {
        'social-post': `Headline: Limited Time Offer - Don't Miss Out!

Ready for the deal of a lifetime? Our special promotion is too good to pass up! 

For a limited time only, we're offering incredible savings on our best products and services. Perfect for anyone looking to upgrade their experience without breaking the bank.

Act now – this offer won't last forever! Click the link in bio to learn more and claim your exclusive discount.

#SpecialOffer #LimitedTime #DontMissOut`,

        'flyer': `SPECIAL PROMOTION!
        
Our Biggest Sale of the Year is HERE!

🔥 50% OFF All Products
🔥 Buy One Get One Free
🔥 Free Shipping on Orders over $50

This Weekend Only - Friday through Sunday
Visit our store or shop online using code: SPECIAL50

Don't miss this incredible opportunity to save on all your favorite products!

Contact us: 
Phone: (555) 123-4567
Email: sales@example.com
Website: www.example.com`,
    },
    so: {
        'social-post': `Cinwaan: Waqti Xaddidan - Ha Lumin!

Ma diyaar u tahay qiime yaab leh? Dhejintayada gaar ah aad ayey u fiican tahay si loo seego!

Waqti xaddidan, waxaan bixinaynaa kaydis cajiib ah oo ku saabsan alaabadayada iyo adeegyada ugu fiican. Waa mid ku habboon qof kasta oo raba inuu kor u qaado khibradooda iyada oo aan miisaaniyadda la jabin.

Haddaba rabo - furshadan ma soconeyso ilaa iyo weligeed! Riix xiriirka ku jira bayoolka si aad u barato wax badan oo aad ku sheegato qiimo-dhimidaada gaarka ah.

#DhejinGaar #WaqtiXadidan #HaLumin`,

        'flyer': `DHEJIN GAAR AH!
        
Iibitaankayaga Ugu Weyn ee Sanadka waa HALKAN!

🔥 50% KA DHIMIS Dhammaan Alaabooyinka
🔥 Iibso Mid Hel Mid Bilaash ah
🔥 Dhoofinta Bilaashka ah ee Dalabada ka badan $50

Dhammaadkan Todobaadka Oo keliya - Jimcaha ilaa Axadda
Booqo dukaankayaga ama ka adeego onlayn adoo isticmaalaya koodhka: SPECIAL50

Ha seegin fursadan cajiibka ah ee wax lagu keydsado dhammaan alaabooyinkaaga la jecel yahay!

Nala soo xiriir:
Telefoon: (555) 123-4567
Email: sales@example.com
Website: www.example.com`,
    }
};

/**
 * Generate text using the Gemini API
 * @param {string} prompt - The prompt to generate text from
 * @param {string} language - The language to generate content in ('en' or 'so')
 * @param {string} contentType - The type of content to generate
 * @returns {Promise<string>} - The generated text
 */
export const generateWithGemini = async (prompt, language = 'en', contentType = 'social-post') => {
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
        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Unexpected API response format:', data);
            throw new Error('The API returned an unexpected response format. Please try again.');
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating text with Gemini:', error);

        // Use fallback content if API fails
        if (process.env.NODE_ENV === 'production') {
            console.log('Using fallback content for:', contentType, language);
            return FALLBACK_RESPONSES[language]?.[contentType] ||
                FALLBACK_RESPONSES['en']['social-post']; // Default fallback
        }

        throw error;
    }
};

/**
 * Generate text using the DeepSeek API
 * @param {string} prompt - The prompt to generate text from
 * @param {string} language - The language to generate content in ('en' or 'so')
 * @param {string} contentType - The type of content to generate
 * @returns {Promise<string>} - The generated text
 */
export const generateWithDeepSeek = async (prompt, language = 'en', contentType = 'social-post') => {
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
        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Unexpected API response format:', data);
            throw new Error('The API returned an unexpected response format. Please try again.');
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating text with DeepSeek:', error);

        // Use fallback content if API fails
        if (process.env.NODE_ENV === 'production') {
            console.log('Using fallback content for:', contentType, language);
            return FALLBACK_RESPONSES[language]?.[contentType] ||
                FALLBACK_RESPONSES['en']['social-post']; // Default fallback
        }

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

    try {
        if (model.toLowerCase() === 'deepseek') {
            return await generateWithDeepSeek(prompt, language, contentType);
        } else {
            return await generateWithGemini(prompt, language, contentType);
        }
    } catch (error) {
        // In case both API calls fail and we're not in production
        if (process.env.NODE_ENV !== 'production') {
            // In development, use fallback content
            console.log('Fallback content used due to API failure');
            return FALLBACK_RESPONSES[language]?.[contentType] ||
                FALLBACK_RESPONSES['en']['social-post']; // Default fallback
        }
        throw error;
    }
}; 