#!/bin/bash

echo "🚀 Starting Wallet-X deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment completed!"
echo "📋 Next steps:"
echo "1. Configure environment variables in Vercel dashboard"
echo "2. Update Google OAuth callback URL if using OAuth"
echo "3. Test your API endpoints"
echo "4. Check the deployment guide at DEPLOYMENT.md for more details" 