# GitHub Actions Auto-Deployment Setup

## 🚀 What's Been Configured

I've set up automatic Netlify deployments that trigger whenever you push to the `main` branch.

### Files Created
- **`.github/workflows/deploy.yml`** - GitHub Actions workflow
- **Updated `netlify.toml`** - Build configuration for CI/CD

## 🔑 Required Secrets

Add these secrets to your GitHub repository:

### 1. Netlify Credentials
Go to your GitHub repository → Settings → Secrets and variables → Actions

**Add these secrets**:
```
NETLIFY_SITE_ID=your_netlify_site_id_here
NETLIFY_AUTH_TOKEN=your_netlify_auth_token_here
```

### 2. Gemini API Key (Optional)
If you want AI image generation in production:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🔄 How It Works

### Automatic Deployment Flow
1. **Push to main** → Triggers GitHub Actions
2. **Build & Test** → Actions runs `npm ci && npm run build`
3. **Deploy to Netlify** → Automatic deployment to production
4. **Environment Variables** → Secrets are injected securely

### Manual Deployment Still Available
```bash
npm run deploy  # Still works for manual deployments
```

## 🛠️ Getting Netlify Credentials

### 1. Find Site ID
- Go to [Netlify Dashboard](https://app.netlify.com)
- Select your site: `riqochet`
- Site ID is in the URL: `app.netlify.com/sites/YOUR_SITE_ID`

### 2. Get Personal Access Token
- Netlify Dashboard → User settings → Applications
- Click "New personal access token"
- Give it a name like "GitHub Actions Deploy"
- Copy the generated token

## ✅ Benefits

- **Zero-Downtime Deployments**: Push and deploy automatically
- **Consistent Environment**: Same secrets across all deployments
- **Rollback Support**: Netlify maintains deployment history
- **Branch Protection**: Only main branch triggers deployments
- **Secure Secrets**: API keys stored in GitHub, not in code

## 🎯 First Time Setup

### 1. Add Secrets to GitHub
```bash
# Navigate to your repo
cd /path/to/riqochet

# Add GitHub secrets (you'll be prompted)
gh secret set NETLIFY_SITE_ID "your_site_id"
gh secret set NETLIFY_AUTH_TOKEN "your_auth_token"
gh secret set GEMINI_API_KEY "your_gemini_key"
```

### 2. Push to Trigger Deployment
```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

### 3. Monitor Deployment
- Check GitHub Actions tab for deployment status
- Check Netlify dashboard for live site

## 🔍 Troubleshooting

### Deployment Fails
1. **Check Secrets**: Ensure all required secrets are set correctly
2. **Check Permissions**: GitHub Actions needs write access to repository
3. **Check Site ID**: Verify NETLIFY_SITE_ID matches your Netlify site
4. **Check Branch**: Pushing to `main` branch (configurable)

### Environment Variables Not Working
1. **Check netlify.toml**: Environment variables are configured for build
2. **Check GitHub Secrets**: Variables are properly set in repository
3. **Check Workflow**: GitHub Actions is enabled and triggered

## 🚀 Ready to Deploy!

Once you add the secrets and push, your deployments will be fully automatic. Every push to main will:

1. ✅ Build the project
2. ✅ Run tests (if configured)
3. ✅ Deploy to Netlify
4. ✅ Update environment variables
5. ✅ Notify you of success/failure

**Manual deployments** still work with `npm run deploy` for quick updates!
