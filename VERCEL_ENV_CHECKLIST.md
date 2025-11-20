# Vercel Environment Variables Checklist

## Critical: Required for Authentication to Work 100%

This checklist ensures all environment variables are properly configured in Vercel to prevent intermittent login failures.

### How to Set Environment Variables in Vercel:
1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below for **Production**, **Preview**, and **Development** environments
4. After adding/updating variables, **redeploy** your application

---

## ✅ Required Environment Variables

### Database Configuration
```bash
# PostgreSQL Database URL (Supabase or VPS)
# Example: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://postgres.mqkoydypybxgcwxioqzc:YOUR_PASSWORD@aws-0-eu-north-1.pooler.supabase.com:6543/postgres
```

### Better Auth Configuration
```bash
# Generate with: openssl rand -hex 32
# This MUST be the same across all environments
BETTER_AUTH_SECRET=YOUR_GENERATED_SECRET_HERE

# Your production domain
NEXT_PUBLIC_APP_URL=https://smrtmart.com
```

### OAuth Providers (Required for Social Login)

#### Google OAuth
```bash
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

**Important**: In Google Cloud Console, add these authorized redirect URIs:
- `https://smrtmart.com/api/auth/callback/google`
- `https://www.smrtmart.com/api/auth/callback/google`
- `https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google`

#### GitHub OAuth
```bash
# Get from: https://github.com/settings/developers
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
```

**Important**: In GitHub OAuth App settings, add these callback URLs:
- `https://smrtmart.com/api/auth/callback/github`
- `https://www.smrtmart.com/api/auth/callback/github`
- `https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/github`

### Email Service (Required for Magic Links)
```bash
# Get from: https://app.mailjet.com/account/api_keys
MAILJET_API_KEY=YOUR_MAILJET_API_KEY
MAILJET_SECRET_KEY=YOUR_MAILJET_SECRET_KEY
```

**Important**: Configure sender domain in Mailjet:
1. Add and verify `smrtmart.com` domain
2. Set up SPF and DKIM records for email deliverability

### API Configuration
```bash
# Your backend API URL
NEXT_PUBLIC_API_URL=https://api.smrtmart.com/api/v1

# Image storage URLs
NEXT_PUBLIC_IMAGE_BASE_URL=https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products
NEXT_PUBLIC_R2_PUBLIC_BASE=https://pub-f181c83ced9f499bbd048ab1e553216c.r2.dev
```

### Stripe Payment (Production)
```bash
# Get from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
# Note: Secret key is NOT needed in frontend
```

### Owner Email
```bash
# Admin user email
NEXT_PUBLIC_OWNER_EMAIL=liujaneyan@gmail.com
```

---

## 🔍 Verification Steps

### 1. Check All Variables Are Set
Run this command locally to see what's needed:
```bash
cd smartmart-next-frontend
grep "process.env" -r src/lib/auth.ts src/lib/email.ts
```

### 2. Test Authentication Flow
After deployment, test each login method:
- [ ] Google sign in works
- [ ] GitHub sign in works
- [ ] Magic link email is received and works
- [ ] Test multiple times (at least 5 attempts each) to ensure reliability
- [ ] Test from different devices/browsers

### 3. Monitor Vercel Logs
1. Go to **Deployments** → Select latest deployment
2. Click **Functions** tab
3. Monitor for any errors in `/api/auth/[...all]`

### 4. Check Database Connection
View logs for these messages:
- `[Database Pool] New client connected` - Good!
- `[Database Pool] Unexpected error` - Check DATABASE_URL
- `ECONNREFUSED` - Database not accessible
- `SSL` errors - Check SSL configuration in DATABASE_URL

---

## 🚨 Common Issues and Solutions

### Issue: "Service temporarily unavailable" error
**Solutions:**
1. Check DATABASE_URL is correct in Vercel
2. Verify database accepts connections from Vercel IPs
3. Check if using Supabase transaction pooler (port 6543, not 5432)
4. Ensure `sslmode=require` or SSL is properly configured

### Issue: Google/GitHub sign in fails sometimes
**Solutions:**
1. Verify GOOGLE_CLIENT_ID and GITHUB_CLIENT_ID are set
2. Check callback URLs match exactly (https vs http, trailing slashes)
3. Ensure NEXT_PUBLIC_APP_URL is set to production domain
4. Check OAuth app settings in Google/GitHub console

### Issue: Magic link emails not received
**Solutions:**
1. Verify MAILJET_API_KEY and MAILJET_SECRET_KEY are correct
2. Check Mailjet account is active and verified
3. Verify sender domain (smrtmart.com) in Mailjet
4. Check spam folder
5. Review Mailjet logs for delivery status

### Issue: Intermittent failures (works sometimes, fails other times)
**Causes:**
- Database connection pool exhaustion ✅ FIXED in this update
- Missing environment variables
- CORS issues ✅ FIXED in this update
- Network timeouts ✅ FIXED with retry logic

---

## 📋 Deployment Checklist

Before going live, verify:

- [ ] All environment variables are set in Vercel (Production, Preview, Development)
- [ ] BETTER_AUTH_SECRET is generated and set (use `openssl rand -hex 32`)
- [ ] DATABASE_URL points to production database
- [ ] OAuth redirect URIs configured in Google Console
- [ ] OAuth callback URLs configured in GitHub
- [ ] Mailjet domain verified and SPF/DKIM configured
- [ ] Test login with all three methods (Google, GitHub, Email)
- [ ] Test from multiple browsers
- [ ] Monitor Vercel logs for errors
- [ ] Database connection pool is working (check logs)
- [ ] No CORS errors in browser console

---

## 🔄 After Updating Environment Variables

**IMPORTANT**: After adding or changing any environment variables:

1. Go to Vercel dashboard
2. Navigate to **Deployments**
3. Click **Redeploy** on the latest deployment
4. OR push a new commit to trigger deployment
5. Wait for deployment to complete
6. Test authentication immediately

Environment variables are **only** loaded during build/deployment time, not on-the-fly!

---

## 📞 Need Help?

If authentication still fails after following this checklist:

1. Check Vercel Function logs for error messages
2. Check browser console for CORS or network errors
3. Verify all environment variables match this checklist
4. Test database connection directly using `psql` or database client
5. Check Mailjet logs for email delivery issues

---

## 🛡️ Security Notes

- Never commit `.env.local` or `.env.production` with real credentials to git
- Rotate secrets regularly (BETTER_AUTH_SECRET, OAuth secrets)
- Use different secrets for production vs. preview environments
- Enable 2FA on Mailjet, Google Console, and GitHub accounts
- Monitor Vercel logs for suspicious authentication attempts
