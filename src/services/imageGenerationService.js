import { API_CONFIG } from './apiConfig';

/**
 * Generates a promotional image based on the provided parameters using Hugging Face's API
 * 
 * @param {Object} params - Parameters for image generation
 * @param {string} params.businessType - Type of business (e.g., "restaurant", "fitness studio")
 * @param {string} params.promotionDetails - Details about the promotion
 * @param {string} params.style - Visual style for the image (e.g., "modern", "vintage", "minimalist")
 * @param {string} params.contentType - Type of content (e.g., "social-post", "flyer")
 * @param {boolean} params.includeText - Whether to include text in the image
 * @param {string} params.headlineText - Text to include in the image if includeText is true
 * @returns {Promise<string>} - A promise that resolves to the image URL (data URL)
 */
export const generatePromotionalImage = async ({
    businessType,
    promotionDetails,
    style = 'modern',
    contentType = 'social-post',
    includeText = false,
    headlineText = ''
}) => {
    try {
        // Format our prompt for the image generation model
        let prompt = `High quality professional marketing image for a ${businessType} promotion. 
      The promotion is about: ${promotionDetails}. 
      Style: ${style}.`;

        // Add specific details based on content type
        switch (contentType) {
            case 'social-post':
                prompt += ' Format suitable for social media posts, square composition, vibrant colors.';
                break;
            case 'flyer':
                prompt += ' Format suitable for a promotional flyer, with clear visual hierarchy and eye-catching design.';
                break;
            case 'email':
                prompt += ' Clean and professional design suitable for email header image, horizontal format.';
                break;
            case 'ad-copy':
                prompt += ' Bold and attention-grabbing visual suitable for an advertisement.';
                break;
            case 'tagline':
                prompt += ' Simple, iconic imagery that works well with a business slogan.';
                break;
            default:
                prompt += ' Professional marketing design with clear visuals.';
        }

        // If we need to include text in the image, add text placement guidance
        if (includeText && headlineText) {
            prompt += ` Include text that reads: "${headlineText}". 
        Make sure the text is clearly visible, properly centered, and has good contrast with the background.`;
        } else {
            // If not including text, add guidance for space where text could be added later
            prompt += ' Leave some empty space for text to be added later.';
        }

        // Add a negative prompt to avoid common issues with AI-generated marketing images
        const negativePrompt = 'blurry, low quality, distorted text, misspelled words, bad typography, unprofessional, cluttered, confusing layout';

        // Call the Hugging Face API - using Stable Diffusion XL for high quality images
        const modelEndpoint = API_CONFIG.HUGGING_FACE_IMAGE_API;
        const apiKey = API_CONFIG.HUGGING_FACE_API_KEY;

        const response = await fetch(modelEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    negative_prompt: negativePrompt,
                    width: 1024, // Increased resolution for better quality
                    height: 1024,
                    num_inference_steps: 50, // More steps for higher quality
                    guidance_scale: 7.5, // More adherence to the prompt
                    seed: Math.floor(Math.random() * 1000000) // Random seed for variety
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Image generation failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
        }

        // Get the image as a blob
        const imageBlob = await response.blob();

        // Convert blob to base64 data URL for direct usage in the app
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageBlob);
        });

    } catch (error) {
        console.error('Error generating image:', error);

        // Fallback to a placeholder image if the API call fails
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkltYWdlIEdlbmVyYXRpb24gRmFpbGVkPC90ZXh0Pjwvc3ZnPg==';
    }
};

/**
 * Creates a simple placeholder image with text
 * 
 * @param {string} text - Text to display on the placeholder
 * @param {Object} options - Options for the placeholder
 * @param {number} options.width - Width of the placeholder
 * @param {number} options.height - Height of the placeholder
 * @param {string} options.backgroundColor - Background color
 * @param {string} options.textColor - Text color
 * @returns {string} - A data URL for the generated SVG image
 */
export const createPlaceholderImage = (
    text = 'Image Placeholder',
    { width = 512, height = 512, backgroundColor = '#f0f0f0', textColor = '#999' } = {}
) => {
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${text}</text>
  </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
}; 