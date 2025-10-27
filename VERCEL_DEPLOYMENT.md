# Vercel Deployment Configuration

## Required Environment Variables

Please set these environment variables in your Vercel project dashboard:

### Production Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.smrtmart.com/api/v1
NEXT_PUBLIC_IMAGE_BASE_URL=https://2a35af424f8734e497a5d707344d79d5.r2.cloudflarestorage.com/smrtmart
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QWpPTIce1IQpcM8C2SczSOUY2NEGMDcKWjLzvvPUe8LrfXUMZfyehcuDjc1nd663TAzVTFpt5LeddGk6y8hmosX00DNMfVP9i
```

## How to Set Environment Variables in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your `smartmart-next-frontend` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable above with the corresponding value
5. Make sure to set them for **Production**, **Preview**, and **Development** environments
6. After saving, redeploy the project

## Backend Status
✅ Backend API: https://api.smrtmart.com/api/v1/products
✅ CORS configured for: https://smrtmart.com and https://www.smrtmart.com
✅ Database: Supabase PostgreSQL
✅ Images: CloudFlare R2 Storage

## Current Issues
- Frontend is still using old hardcoded API URL because Vercel environment variables need to be updated
- Once environment variables are set in Vercel, products will load correctly

## Test Commands
```bash
# Test backend API
curl "https://api.smrtmart.com/api/v1/products?limit=1"

# Test CORS
curl -H "Origin: https://www.smrtmart.com" "https://api.smrtmart.com/api/v1/products?limit=1" -I
```