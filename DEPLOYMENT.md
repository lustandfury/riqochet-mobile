# Netlify Deployment Guide

## Prerequisites
- Netlify account (free)
- Git repository (GitHub, GitLab, or Bitbucket)

## Option 1: Deploy via Netlify CLI (Recommended)

### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Login to Netlify
```bash
netlify login
```

### 3. Deploy the app
```bash
npm run deploy
```

## Option 2: Deploy via Git (Automatic)

### 1. Push to Git Repository
Make sure your code is pushed to a Git repository.

### 2. Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider
4. Select this repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### 3. Set Environment Variables
In Netlify dashboard → Site settings → Build & deploy → Environment:
- `GEMINI_API_KEY`: Your Gemini API key (optional)

## Configuration Files Created

### `netlify.toml`
- Configures build settings
- Sets up redirects for SPA routing
- Specifies Node version

### `public/_redirects`
- Fallback for client-side routing
- Ensures all routes serve index.html

## Environment Variables

### For Development
Create `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### For Production
Set in Netlify dashboard:
- Go to Site settings → Build & deploy → Environment
- Add `GEMINI_API_KEY` with your API key

## Deployment Commands

```bash
# Build only
npm run build

# Preview build locally
npm run preview

# Deploy to production
npm run deploy

# Deploy to preview (staging)
npx netlify deploy --dir=dist
```

## Post-Deployment

1. **Custom Domain**: Configure in Netlify dashboard → Domain management
2. **HTTPS**: Automatically provided by Netlify
3. **Analytics**: Enable in Site settings → Analytics
4. **Forms**: Netlify forms work out of the box

## Troubleshooting

### Build Fails
- Check Node version in `netlify.toml`
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### Blank Page
- Ensure `_redirects` file is properly configured
- Check that `dist/index.html` exists
- Verify client-side routing setup

### Environment Variables Not Working
- Make sure variables are set in Netlify dashboard
- Check variable names match exactly
- Restart the site after adding variables

## Production Considerations

- The app uses mock images when `GEMINI_API_KEY` is not set
- All API calls are handled client-side
- No server-side rendering required
- Static site hosting is sufficient
