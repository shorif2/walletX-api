@echo off
echo 🚀 Starting Wallet-X deployment to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Installing...
    npm install -g vercel
)

REM Build the project
echo 📦 Building the project...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed!
    exit /b 1
)

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
vercel --prod

echo 🎉 Deployment completed!
echo 📋 Next steps:
echo 1. Configure environment variables in Vercel dashboard
echo 2. Update Google OAuth callback URL if using OAuth
echo 3. Test your API endpoints
echo 4. Check the deployment guide at DEPLOYMENT.md for more details 