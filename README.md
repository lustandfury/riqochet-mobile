<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1OFXW8se6zMy4T8jXQtjASMlQJkCajG66

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`

2. Set up Gemini API (Required for AI image generation):
   
   **Option A: Get API Key**
   - Visit [Google AI Studio](https://aistudio.google.com)
   - Click "Get API Key" → "Create API Key"
   - Copy your key (starts with `AIza...`)
   
   **Option B: Set API Key**
   - Create `.env.local` file: `GEMINI_API_KEY=your_api_key_here`
   - Or set environment variable: `export GEMINI_API_KEY=your_api_key_here`

3. Run the app:
   `npm run dev`

4. Test API setup:
   `node test-api.js`

## Deploy to Netlify

1. **Set up API key in production:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Site settings → Build & deploy → Environment
   - Add `GEMINI_API_KEY` with your API key

2. **Deploy:**
   `./deploy.sh` or `npm run deploy`

📖 **For detailed setup:** See [SETUP.md](./SETUP.md)
