# AI Promotional Content Generator

An AI-powered tool for generating marketing and promotional content with images for businesses.

## Features

- **AI Content Generation**: Create professional marketing copy for various promotional formats
- **Image Generation**: Generate relevant marketing images to accompany your text
- **Text Overlay**: Add customizable text to generated images
- **Multiple Format Support**: Social media posts, flyers, email campaigns, ad copy, and taglines
- **Autocomplete Suggestions**: Smart suggestions for business types, promotions, and target audiences
- **Responsive Design**: Works on desktop and mobile devices
- **Template Saving**: Save your frequently used promotional templates

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/aimusic.git
   cd aimusic
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

## Deployment Options

### Deploy to Vercel

The easiest way to deploy your application is using Vercel:

1. Create an account on [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` from your project directory
4. Follow the prompts to deploy

### Deploy to Netlify

1. Create an account on [Netlify](https://netlify.com)
2. From the Netlify dashboard, click "New site from Git"
3. Connect to your GitHub repository
4. Set build command as `npm run build` and publish directory as `dist`
5. Click "Deploy site"

### Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Enable GitHub Actions in your repository settings
3. The included workflow file will build and deploy your site to GitHub Pages

## Environment Variables

For production deployment, set the following environment variables:

- `VITE_OPENAI_API_KEY` - Your OpenAI API key
- `VITE_HUGGINGFACE_API_KEY` - Your Hugging Face API key

## Project Structure

```
project-root/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   ├── utils/           # Utilities and helpers
│   ├── App.jsx          # Main application component
│   └── index.css        # Global styles
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Tech Stack

- React (v19)
- Tailwind CSS (v4)
- Vite (v6)
- OpenRouter API (for LLM access)
- Hugging Face API (for image generation)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter for providing AI model access
- Hugging Face for the image generation capabilities
- All contributors who have helped improve this project
