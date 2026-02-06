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

### Option 1: GitHub Actions (Recommended)
**Automatic deployments on every push to main branch**

1. **Set up Secrets** (one-time setup):
   ```bash
   # Add Netlify credentials
   gh secret set NETLIFY_SITE_ID "your_site_id"
   gh secret set NETLIFY_AUTH_TOKEN "your_auth_token"
   # Optional: Add Gemini API key
   gh secret set GEMINI_API_KEY "your_gemini_key"
   ```

2. **Push to trigger deployment**:
   ```bash
   git add .
   git commit -m "Add GitHub Actions deployment"
   git push origin main
   ```

3. **Monitor deployment**:
   - GitHub Actions tab for build status
   - Netlify dashboard for live site

📖 **For detailed setup**: See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md)

### Option 2: Manual Deploy
```bash
npm run deploy
```

### Option 3: Step by Step
1. Login to Netlify (first time only)
   `netlify login`

2. Set up API key in production:
   - Go to [Netlify Dashboard](https://app.netlify.com/projects/riqochet)
   - Site settings → Build & deploy → Environment
   - Add variable: `GEMINI_API_KEY` = your actual API key

3. Deploy:
   `npm run deploy`

📖 **For detailed setup:** See [SETUP.md](./SETUP.md)
