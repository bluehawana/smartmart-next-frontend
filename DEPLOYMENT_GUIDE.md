# 🚀 Deployment Guide - Push to Production

## Overview

SmartMart frontend is hosted on **Vercel** with automatic deployment from Git. When you push to the main branch, Vercel automatically builds and deploys to **smrtmart.com**.

## 📋 Pre-Deployment Checklist

### 1. Test Locally First

```bash
# Make sure everything works locally
cd smartmart-frontend-next

# Install dependencies
npm install

# Run development server
npm run dev

# Test in browser
open http://localhost:3000

# Test critical paths:
# ✓ Homepage loads
# ✓ Login works (try 2-3 times to verify fix)
# ✓ Products page loads
# ✓ Product detail page works
# ✓ Cart functionality
# ✓ Showcase page (/showcase)
```

### 2. Build Test

```bash
# Test production build locally
npm run build

# If build succeeds, you're good to deploy
npm run start

# Test the production build
open http://localhost:3000
```

### 3. Check Environment Variables

Before deploying, ensure these are set in Vercel:

**Required for Authentication:**
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Random secret (32+ chars)
- `NEXT_PUBLIC_APP_URL` - https://www.smrtmart.com
- `MAILJET_API_KEY` - For magic link emails
- `MAILJET_SECRET_KEY` - For magic link emails

**Optional (Social Login):**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

**Already Set:**
- `NEXT_PUBLIC_API_URL` - Backend API
- `NEXT_PUBLIC_IMAGE_BASE_URL` - Image storage
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe

## 🔧 Set Environment Variables in Vercel

### Option 1: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project (smartmart-frontend-next)
3. Go to **Settings** → **Environment Variables**
4. Add/update these variables:

```bash
# Authentication (REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/database
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXT_PUBLIC_APP_URL=https://www.smrtmart.com
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key

# Social Login (OPTIONAL)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

5. Set for: **Production**, **Preview**, and **Development**
6. Click **Save**

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to project
vercel link

# Add environment variables
vercel env add DATABASE_URL production
vercel env add BETTER_AUTH_SECRET production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add MAILJET_API_KEY production
vercel env add MAILJET_SECRET_KEY production
```

## 📤 Deploy to Production

### Step 1: Commit Your Changes

```bash
# Check what files changed
git status

# Review changes
git diff

# Stage all new files and changes
git add .

# Commit with descriptive message
git commit -m "feat: Add professional UI/UX improvements and fix authentication

- Add 13 new UI components (Button, Badge, Tooltip, etc.)
- Add 3 advanced features (EnhancedProductCard, SearchAutocomplete, ProductComparison)
- Fix BetterAuth login issues with singleton pattern and retry logic
- Optimize database connection pool for serverless
- Add comprehensive error handling and user feedback
- Improve performance with lazy loading and progressive images
- Add documentation and troubleshooting guides"
```

### Step 2: Push to Git

```bash
# Push to main branch (triggers automatic deployment)
git push origin main

# Or if you're on a different branch
git push origin your-branch-name
```

### Step 3: Monitor Deployment

1. **Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - You'll see the deployment in progress
   - Click on it to see build logs

2. **Watch for:**
   - ✅ Build started
   - ✅ Installing dependencies
   - ✅ Building application
   - ✅ Deployment ready
   - ✅ Domain assigned

3. **Typical deployment time:** 2-5 minutes

### Step 4: Verify Deployment

Once deployed, test on production:

```bash
# Open production site
open https://www.smrtmart.com

# Test critical paths:
# 1. Homepage loads with new components
# 2. Login page works on FIRST try
# 3. Products display correctly
# 4. Cart functionality works
# 5. No console errors
```

## 🧪 Testing on Production

### 1. Authentication Test

```bash
# Visit login page
open https://www.smrtmart.com/login

# Test:
✓ Page loads immediately (no retry needed!)
✓ Magic link email sends
✓ Social login works (if configured)
✓ Session persists after refresh
✓ Logout works
```

### 2. Component Test

```bash
# Visit showcase
open https://www.smrtmart.com/showcase

# Verify:
✓ All components render
✓ Animations work smoothly
✓ No console errors
✓ Mobile responsive
```

### 3. Performance Test

```bash
# Use Lighthouse
# Chrome DevTools → Lighthouse → Run audit

# Target scores:
✓ Performance: 90+
✓ Accessibility: 95+
✓ Best Practices: 95+
✓ SEO: 95+
```

## 🔄 Rollback (If Needed)

If something goes wrong:

### Option 1: Instant Rollback via Vercel

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments**
4. Find the previous working deployment
5. Click **⋯** → **Promote to Production**

### Option 2: Git Revert

```bash
# Find the commit to revert to
git log --oneline

# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>

# Force push (use with caution!)
git push origin main --force
```

## 📊 Post-Deployment Monitoring

### 1. Check Vercel Analytics

- Go to Vercel Dashboard → Analytics
- Monitor:
  - Page views
  - Response times
  - Error rates
  - Geographic distribution

### 2. Check Application Logs

```bash
# Via Vercel CLI
vercel logs

# Or in dashboard:
# Project → Deployments → Click deployment → Logs
```

### 3. Monitor Key Metrics

**First 24 Hours:**
- [ ] Login success rate
- [ ] Page load times
- [ ] Error rate
- [ ] User feedback

**First Week:**
- [ ] Conversion rate changes
- [ ] Bounce rate changes
- [ ] Average session duration
- [ ] Cart abandonment rate

## 🐛 Common Deployment Issues

### Issue: Build Fails

**Error:** `Module not found` or `Type error`

**Solution:**
```bash
# Clear cache and rebuild locally
rm -rf .next node_modules
npm install
npm run build

# If it works locally, push again
git push origin main
```

### Issue: Environment Variables Not Working

**Error:** `undefined` or `null` for env vars

**Solution:**
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure variables are set for **Production**
3. Redeploy: Deployments → Latest → **Redeploy**

### Issue: Database Connection Fails

**Error:** `Connection timeout` or `ECONNREFUSED`

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Check database is accessible from Vercel IPs
3. Ensure SSL settings match database requirements
4. Check connection pool settings in `auth.ts`

### Issue: Authentication Not Working

**Error:** Login page loads but fails

**Solution:**
1. Check `BETTER_AUTH_SECRET` is set
2. Verify `NEXT_PUBLIC_APP_URL` is correct
3. Check Mailjet credentials
4. Review logs for specific errors
5. See `AUTH_TROUBLESHOOTING.md`

## 🔐 Security Checklist

Before going live:

- [ ] All secrets are in Vercel env vars (not in code)
- [ ] `BETTER_AUTH_SECRET` is strong (32+ chars)
- [ ] Database uses SSL in production
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (TODO)
- [ ] No sensitive data in logs
- [ ] HTTPS is enforced
- [ ] Security headers are set

## 📝 Deployment Checklist

Use this checklist for each deployment:

### Pre-Deployment
- [ ] Code tested locally
- [ ] Production build succeeds
- [ ] All tests pass (if any)
- [ ] Environment variables verified
- [ ] Documentation updated
- [ ] Breaking changes documented

### Deployment
- [ ] Changes committed with clear message
- [ ] Pushed to correct branch
- [ ] Vercel build started
- [ ] Build completed successfully
- [ ] Deployment assigned to domain

### Post-Deployment
- [ ] Production site loads
- [ ] Login works on first try
- [ ] Critical paths tested
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Analytics tracking works

### Monitoring (First Hour)
- [ ] Check error logs
- [ ] Monitor response times
- [ ] Watch for user reports
- [ ] Verify analytics data

## 🎯 Quick Deploy Commands

```bash
# Full deployment workflow
cd smartmart-frontend-next
npm install                    # Install dependencies
npm run build                  # Test build
git add .                      # Stage changes
git commit -m "your message"   # Commit
git push origin main           # Deploy!

# Monitor deployment
vercel logs --follow

# Check production
open https://www.smrtmart.com
```

## 📞 Support

### If Deployment Fails

1. **Check Build Logs**
   - Vercel Dashboard → Deployments → Click failed deployment
   - Look for error messages

2. **Common Fixes**
   - Clear cache: Redeploy with "Clear Cache"
   - Check env vars: Settings → Environment Variables
   - Verify dependencies: Check package.json

3. **Get Help**
   - Vercel Support: https://vercel.com/support
   - Check documentation files
   - Review error logs

### Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Project Docs:** See all `.md` files in this directory

## 🎉 Success!

Once deployed, your improvements will be live on **smrtmart.com**:

✅ Fixed authentication (works on first try!)
✅ 13 new professional UI components
✅ 3 advanced features
✅ Performance optimizations
✅ Better user experience
✅ Comprehensive error handling

**Congratulations!** 🎊 SmartMart is now a professional, enterprise-level e-commerce platform!

---

**Last Updated:** January 2026  
**Deployment Method:** Vercel (Automatic from Git)  
**Production URL:** https://www.smrtmart.com  
**Status:** ✅ Ready to Deploy
