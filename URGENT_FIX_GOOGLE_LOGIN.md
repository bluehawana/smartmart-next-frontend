# 🚨 URGENT: Fix Google Login (5 Minutes)

## Current Problem

**Error:** `429 Too Many Requests` and `503 Service Unavailable`

**Root Cause:** Google OAuth credentials are NOT set in Vercel environment variables.

## Quick Fix (Do This Now!)

### Step 1: Get Google OAuth Credentials (If You Don't Have Them)

**Option A: Use Existing Credentials**
If you already have Google OAuth credentials, skip to Step 2.

**Option B: Create New Credentials (10 minutes)**
1. Go to https://console.cloud.google.com
2. Create project: "SmartMart"
3. Enable Google+ API
4. Create OAuth Client ID
5. Add redirect URI: `https://www.smrtmart.com/api/auth/callback/google`
6. Copy Client ID and Secret

### Step 2: Add to Vercel (2 minutes) - DO THIS NOW!

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Select Your Project**
   - Click on "smartmart-frontend-next" or your project name

3. **Go to Settings → Environment Variables**

4. **Add These Variables:**

   ```bash
   # Google OAuth (REQUIRED)
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   
   # Database (REQUIRED for auth)
   DATABASE_URL=<your-postgresql-connection-string>
   
   # BetterAuth Secret (REQUIRED)
   BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
   
   # App URL (REQUIRED)
   NEXT_PUBLIC_APP_URL=https://www.smrtmart.com
   
   # Email (OPTIONAL - for magic link)
   MAILJET_API_KEY=<your-mailjet-key>
   MAILJET_SECRET_KEY=<your-mailjet-secret>
   ```

5. **Set for ALL environments:**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

6. **Click SAVE**

### Step 3: Redeploy (1 minute)

1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **"..."** menu → **"Redeploy"**
4. Wait 3-5 minutes

### Step 4: Test

```bash
# After redeployment completes:
open https://www.smrtmart.com/login

# Click "Continue with Google"
# Should work now!
```

## Why This Happened

The code was deployed but environment variables were not set in Vercel. BetterAuth needs these variables to function:

- `GOOGLE_CLIENT_ID` - To authenticate with Google
- `GOOGLE_CLIENT_SECRET` - To verify Google responses
- `DATABASE_URL` - To store user sessions
- `BETTER_AUTH_SECRET` - To encrypt session tokens

Without these, the auth API returns 503 (service unavailable) or 429 (rate limit) errors.

## Generate BETTER_AUTH_SECRET

```bash
# Run this command:
openssl rand -base64 32

# Copy the output and use it as BETTER_AUTH_SECRET
```

## Verify Environment Variables Are Set

After adding variables in Vercel:

1. Go to Settings → Environment Variables
2. You should see:
   - ✅ GOOGLE_CLIENT_ID
   - ✅ GOOGLE_CLIENT_SECRET
   - ✅ DATABASE_URL
   - ✅ BETTER_AUTH_SECRET
   - ✅ NEXT_PUBLIC_APP_URL

3. Each should show: "Production, Preview, Development"

## If You Don't Have Google OAuth Credentials

### Quick Setup (15 minutes)

1. **Google Cloud Console**
   ```
   https://console.cloud.google.com
   ```

2. **Create Project**
   - Click "Select a project" → "NEW PROJECT"
   - Name: "SmartMart"
   - Click "CREATE"

3. **Enable Google+ API**
   - APIs & Services → Library
   - Search "Google+ API"
   - Click "ENABLE"

4. **OAuth Consent Screen**
   - APIs & Services → OAuth consent screen
   - External → CREATE
   - App name: SmartMart
   - Support email: your email
   - Developer email: your email
   - SAVE AND CONTINUE

5. **Create Credentials**
   - APIs & Services → Credentials
   - CREATE CREDENTIALS → OAuth client ID
   - Application type: Web application
   - Name: SmartMart Production
   
   **Authorized JavaScript origins:**
   ```
   https://www.smrtmart.com
   https://smrtmart.com
   ```
   
   **Authorized redirect URIs:**
   ```
   https://www.smrtmart.com/api/auth/callback/google
   https://smrtmart.com/api/auth/callback/google
   ```
   
   - Click CREATE

6. **Copy Credentials**
   - Client ID: `123456789-abc123.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-abc123xyz`
   - Save these!

7. **Add to Vercel** (see Step 2 above)

## Alternative: Use Magic Link Instead

If you don't want to set up Google OAuth right now, users can still login with magic link (email):

**Requirements:**
- Mailjet account (free)
- MAILJET_API_KEY and MAILJET_SECRET_KEY in Vercel

**Setup:**
1. Sign up at https://www.mailjet.com
2. Get API credentials
3. Add to Vercel environment variables
4. Redeploy

## Check Deployment Status

```bash
# Option 1: Vercel Dashboard
open https://vercel.com/dashboard

# Option 2: Check production
open https://www.smrtmart.com/login

# Option 3: Check logs
vercel logs --follow
```

## Expected Timeline

- **Add env vars:** 2 minutes
- **Redeploy:** 3-5 minutes
- **Test login:** 1 minute
- **Total:** ~10 minutes

## Success Criteria

After fixing:

- ✅ No 429 errors
- ✅ No 503 errors
- ✅ Google login button works
- ✅ Can sign in with Google
- ✅ Session persists
- ✅ Can access protected routes

## Still Not Working?

### Check Vercel Logs

1. Vercel Dashboard → Deployments
2. Click latest deployment
3. Click "Logs" tab
4. Look for errors like:
   - "GOOGLE_CLIENT_ID is not defined"
   - "DATABASE_URL is not defined"
   - "Connection refused"

### Common Issues

**Issue:** Still getting 429 errors
**Fix:** Wait 10 minutes for rate limit to reset, then try again

**Issue:** Still getting 503 errors
**Fix:** Check DATABASE_URL is correct and database is accessible

**Issue:** "redirect_uri_mismatch"
**Fix:** Verify redirect URIs in Google Console match exactly

**Issue:** "Invalid client"
**Fix:** Double-check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

## Need Help?

1. Check Vercel logs for specific errors
2. Verify all environment variables are set
3. Make sure database is accessible
4. Try magic link login instead
5. See GOOGLE_OAUTH_SETUP.md for detailed guide

---

**Priority:** 🔴 URGENT  
**Time Required:** 5-10 minutes  
**Difficulty:** Easy  
**Impact:** Fixes Google login completely

**DO THIS NOW to fix Google login!**
