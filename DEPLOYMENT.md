# Deployment Guide

This guide provides step-by-step instructions for deploying the AI Promotional Content Generator to various hosting platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build for Production](#build-for-production)
3. [Deploy to Vercel](#deploy-to-vercel)
4. [Deploy to Netlify](#deploy-to-netlify)
5. [Deploy to GitHub Pages](#deploy-to-github-pages)
6. [Environment Variables](#environment-variables)
7. [API Keys](#api-keys)

## Prerequisites

Before deploying, make sure you have:

- Node.js 16+ and npm installed
- Git installed (for version control)
- API keys for OpenRouter and Hugging Face
- Your code pushed to a Git repository (required for some deployment methods)

## Build for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` folder with optimized assets ready for deployment.

## Deploy to Vercel

Vercel offers the easiest deployment experience and is recommended for beginners.

### Using Vercel CLI

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Run the deployment command from your project root:

   ```bash
   vercel
   ```

3. Follow the prompts to log in and configure your project.

4. For subsequent deployments, use:
   ```bash
   vercel --prod
   ```

### Using Vercel Web Interface

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project" → "Import Git Repository"
4. Select your repository and follow the setup instructions
5. Set environment variables (see [Environment Variables](#environment-variables))
6. Deploy

## Deploy to Netlify

### Using Netlify CLI

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Build your project:

   ```bash
   npm run build
   ```

3. Deploy using Netlify CLI:

   ```bash
   netlify deploy
   ```

4. Follow the prompts to configure your site

5. For production deployment:
   ```bash
   netlify deploy --prod
   ```

### Using Netlify Web Interface

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider and select your repository
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"
6. Set environment variables in the site settings

## Deploy to GitHub Pages

1. Ensure your GitHub repository is public (or you have GitHub Pro for private repos)

2. Update the `vite.config.js` file (already done in this project):

   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

3. Push your code to GitHub

4. Enable GitHub Pages in your repository settings:

   - Go to Settings → Pages
   - Set the source to "GitHub Actions"

5. The existing GitHub workflow file will automatically build and deploy your site

## Environment Variables

For production deployment, you'll need to set the following environment variables:

- `VITE_GEMINI_API_KEY` - Your OpenRouter Gemini Pro API key
- `VITE_DEEPSEEK_API_KEY` - Your OpenRouter DeepSeek API key
- `VITE_HUGGINGFACE_API_KEY` - Your Hugging Face API key

### Setting Environment Variables

#### Vercel

- Go to your project on Vercel → Settings → Environment Variables
- Add each key-value pair

#### Netlify

- Go to your site on Netlify → Site settings → Build & deploy → Environment
- Add each key-value pair

#### GitHub Pages

- Go to your repository → Settings → Secrets and variables → Actions
- Add each key as a new repository secret

## API Keys

### OpenRouter API Keys

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Create API keys in your dashboard
3. Set spending limits to control costs

### Hugging Face API Keys

1. Create an account at [Hugging Face](https://huggingface.co/)
2. Go to Settings → Access Tokens
3. Create a new token with read access

## Additional Deployment Options

### Firebase Hosting

1. Install Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:

   ```bash
   firebase login
   firebase init hosting
   ```

3. Deploy to Firebase:
   ```bash
   npm run build
   firebase deploy
   ```

### DigitalOcean App Platform

1. Push your code to GitHub
2. Go to [DigitalOcean](https://cloud.digitalocean.com/apps)
3. Create a new app and select your repository
4. Configure as a static site with:
   - Build command: `npm run build`
   - Output directory: `dist`

## Troubleshooting

### 404 Errors on Refresh

If you experience 404 errors when refreshing pages, ensure your hosting is configured to redirect all requests to index.html. This is handled automatically in the deployment configurations provided.

### API Key Issues

If your API calls are failing, check that your environment variables are correctly set in your hosting environment.

### Build Failures

If the build fails, check the build logs for errors. Most hosting providers provide detailed logs.
