// API configuration for our content generation services

// OpenRouter API keys for LLM services 
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

// Hugging Face API for text-to-image generation
export const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';

// API endpoints
export const OPENROUTER_GEMINI_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const OPENROUTER_DEEPSEEK_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const HUGGINGFACE_TEXT_TO_IMAGE_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

// Consolidated API config for easier imports
export const API_CONFIG = {
    GEMINI_API_KEY,
    DEEPSEEK_API_KEY,
    HUGGING_FACE_API_KEY: HUGGINGFACE_API_KEY,
    OPENROUTER_GEMINI_URL,
    OPENROUTER_DEEPSEEK_URL,
    HUGGING_FACE_IMAGE_API: HUGGINGFACE_TEXT_TO_IMAGE_URL
}; 