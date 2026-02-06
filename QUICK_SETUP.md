# Quick Setup Checklist

## 🚀 Get Image Generator Working

### Local Development
- [ ] Get Gemini API key from [Google AI Studio](https://aistudio.google.com)
- [ ] Create `.env.local` file with: `GEMINI_API_KEY=AIza...`
- [ ] Run `npm run dev`
- [ ] Test with `node test-api.js`

### Production (Netlify)
- [ ] Go to [Netlify Dashboard](https://app.netlify.com/projects/riqochet)
- [ ] Site settings → Build & deploy → Environment
- [ ] Add variable: `GEMINI_API_KEY` = your_actual_key
- [ ] Run `npm run deploy`

## 🔍 Verify It's Working

### In Browser Console
You should NOT see:
```
"No API Key found. Returning mock image."
```

### You SHOULD see:
- Real AI-generated tournament posters
- No "mock image" warnings
- Images that match your tournament details

## 🛠️ Troubleshooting

### Still showing mock images?
1. Check `.env.local` exists and has correct key
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Check console for errors

### Production not working?
1. Verify environment variable in Netlify dashboard
2. Trigger new deploy
3. Check build logs for errors

## 📞 Need Help?
- Check [SETUP.md](./SETUP.md) for detailed instructions
- Test API with `node test-api.js`
- Check browser console for specific error messages

## ✅ Success Indicators
- ✅ Tournament poster generates with AI images
- ✅ No "mock image" warnings
- ✅ Images match tournament sport/mood
- ✅ App works locally and on Netlify
