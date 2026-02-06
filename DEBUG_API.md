# Debugging Gemini API Key Issues

## 🔍 Current Issue

The error shows: `API key not valid` which means the environment variable isn't being passed correctly to the production build.

## 🛠️ Debug Steps

### 1. Check Browser Console
Visit: https://riqochet.netlify.app
Open Developer Tools (F12) → Console tab
Look for: `🔑 Environment Check:` message

### 2. Expected Console Output
You should see:
```
🔑 Environment Check: {
  hasApiKey: true,
  apiKeyLength: 39,
  apiKeyPrefix: "AIza..."
}
```

### 3. If You See This Instead
```
🔑 Environment Check: {
  hasApiKey: false,
  apiKeyLength: 0,
  apiKeyPrefix: "..."
}
```

## 🔧 How to Fix

### Option 1: Netlify Dashboard (Recommended)
1. Go to [Netlify Dashboard](https://app.netlify.com/projects/riqochet)
2. Site settings → Build & deploy → Environment
3. Add/Update variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key (starts with `AIza...`)
4. Save changes
5. Trigger new deploy (or wait for automatic)

### Option 2: Netlify CLI
```bash
# Set environment variable
netlify env:set GEMINI_API_KEY=your_actual_api_key_here

# Deploy
npm run deploy
```

### Option 3: Check Current Value
```bash
# Check what's currently set
netlify env:list
```

## 🎯 Verification

After fixing the API key:

1. **Deploy the app** (if not auto-deployed)
2. **Visit the app** and open console
3. **Create a tournament** with profile pictures
4. **Check console** for the debug message
5. **Generate poster** - should work with real AI images

## 📞 Common Issues

### API Key Format
- Must start with `AIza...`
- No extra spaces or quotes
- Must be valid and active

### Environment Variable Names
- **Netlify**: `GEMINI_API_KEY` (in dashboard)
- **Local**: `GEMINI_API_KEY` (in .env.local)

## ✅ Success Indicators

- ✅ Debug shows `hasApiKey: true`
- ✅ API key length > 30
- ✅ No "API key not valid" errors
- ✅ Real AI-generated posters appear
