#!/bin/bash

echo "🎨 SmrtMart Frontend Deployment Script"
echo "======================================="

# Check if we're on master branch (production source)
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "master" ]; then
    echo "⚠️  Please switch to master branch first: git checkout master"
    exit 1
fi

echo "✅ On master branch - ready for deployment"

# Add and commit any changes
echo "📦 Committing latest changes..."
git add .
git commit -m "🎨 Deploy: Latest frontend changes for cloud deployment" || echo "No changes to commit"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin master

echo ""
echo "🎉 Ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Open https://vercel.com/alabs-projects-e124c746/smrtmart-frontend"
echo "2. Trigger a redeploy from the master branch"
echo "3. Confirm the Production environment variables are set:"
echo "   NEXT_PUBLIC_API_URL=https://smrtmart-backend-1757499174-0dfbd8d4731e.herokuapp.com/api/v1"
echo "   NEXT_PUBLIC_IMAGE_BASE_URL=https://2a35af424f8734e497a5d707344d79d5.r2.cloudflarestorage.com/smrtmart"
echo "   NEXT_PUBLIC_R2_PUBLIC_BASE=https://pub-f181c83ced9f499bbd048ab1e553216c.r2.dev"
echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QWpPTIce1IQpcM8C2SczSOUY2NEGMDcKWjLzvvPUe8LrfXUMZfyehcuDjc1nd663TAzVTFpt5LeddGk6y8hmosX00DNMfVP9i"
echo "4. Ensure domain aliases include smrtmart.com and www.smrtmart.com"
echo ""
echo "Production site: https://smrtmart.com"
