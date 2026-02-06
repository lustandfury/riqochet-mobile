#!/bin/bash

echo "🚀 Deploying Riqochet to Netlify..."

# Check if user is logged in to Netlify
if ! netlify whoami &>/dev/null; then
    echo "❌ You need to login to Netlify first:"
    echo "   netlify login"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
npx netlify deploy --prod --dir=dist

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your app is now live on Netlify!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
