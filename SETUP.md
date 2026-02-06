# Gemini API Setup Guide

## Get Your Gemini API Key

### 1. Go to Google AI Studio
- Visit [https://aistudio.google.com](https://aistudio.google.com)
- Sign in with your Google account

### 2. Create API Key
- Click "Get API Key" in the left sidebar
- Click "Create API Key"
- Copy your API key (it starts with `AIza...`)

## Local Development Setup

### Option 1: Create .env.local file
Create a file named `.env.local` in the project root:
```
GEMINI_API_KEY=AIza...your_actual_api_key_here
```

### Option 2: Set in Terminal
```bash
export GEMINI_API_KEY=AIza...your_actual_api_key_here
npm run dev
```

### Option 3: Use .env file (not recommended for production)
Create `.env` file:
```
GEMINI_API_KEY=AIza...your_actual_api_key_here
```

## Production (Netlify) Setup

### 1. Go to Netlify Dashboard
- Visit [https://app.netlify.com](https://app.netlify.com)
- Select your "riqochet" project

### 2. Set Environment Variables
- Go to **Site settings** → **Build & deploy** → **Environment**
- Click **Add variable**
- **Key**: `GEMINI_API_KEY`
- **Value**: Your actual API key
- Click **Save**

### 3. Trigger New Deploy
- Go to **Deploys** tab
- Click **Trigger deploy** → **Deploy site**
- Or push changes to your Git repository

## Verify Setup

### Check Locally
```bash
# Start dev server
npm run dev

# Open browser console
# Look for: "No API Key found. Returning mock image."
# If you see this, API key is not set correctly
```

### Check Production
1. Visit your deployed app: https://riqochet.netlify.app
2. Open browser developer tools (F12)
3. Look in Console tab
4. Create a tournament
5. Check if you see real AI-generated images or mock images

## Troubleshooting

### "No API Key found" Error
- **Local**: Ensure `.env.local` exists and has correct variable name
- **Production**: Check environment variables in Netlify dashboard
- **Both**: Make sure variable is exactly `GEMINI_API_KEY`

### API Key Not Working
- Verify your API key is valid and active
- Check if you have sufficient quota
- Ensure the key has the correct permissions

### Images Still Mock
1. Check browser console for errors
2. Verify API key is set correctly
3. Check network tab for failed API requests
4. Ensure Gemini API is enabled for your project

## API Usage & Costs

### Free Tier
- **15 requests per minute**
- **1,500 requests per day**
- **Image generation**: Limited but available in free tier

### Monitoring
- Check usage at [Google AI Studio](https://aistudio.google.com)
- Monitor costs in Google Cloud Console

## Security Notes

⚠️ **Important**: Never commit API keys to Git!
- `.env.local` is in `.gitignore`
- Production keys should only be set in Netlify dashboard
- Never share your API key publicly

## Testing API Integration

### Quick Test
```javascript
// Test in browser console
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Generate a simple image" }] }]
  })
})
```

If this works, your API key is valid and the app should work correctly.
