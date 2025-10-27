#!/bin/bash

echo "🎨 SmartMart Frontend Deployment Script"
echo "======================================="

# Check if we're on dev branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "dev" ]; then
    echo "⚠️  Please switch to dev branch first: git checkout dev"
    exit 1
fi

echo "✅ On dev branch - ready for deployment"

# Add and commit any changes
echo "📦 Committing latest changes..."
git add .
git commit -m "🎨 Deploy: Latest frontend changes for cloud deployment" || echo "No changes to commit"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin dev

echo ""
echo "🎉 Ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import smrtmart-frontend repository"
echo "3. Choose 'dev' branch"
echo "4. Configure environment variables:"
echo "   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api/v1"
echo "   NEXT_PUBLIC_IMAGE_BASE_URL=https://your-railway-app.railway.app/uploads"
echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key"
echo ""
echo "Your website will be available at: https://your-app-name.vercel.app"