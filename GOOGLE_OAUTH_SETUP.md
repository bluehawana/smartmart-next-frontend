# 🔐 Google OAuth Setup for SmartMart

## Why You Can't Login with Google

Google OAuth requires credentials to be set up in both:
1. **Google Cloud Console** - Create OAuth credentials
2. **Vercel Dashboard** - Add credentials as environment variables

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create or Select Project**
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Name: "SmartMart" or "SmartMart Auth"
   - Click "CREATE"

3. **Enable Google+ API**
   - In the left sidebar, go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and click "ENABLE"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" (unless you have Google Workspace)
   - Click "CREATE"
   
   **Fill in:**
   - App name: `SmartMart`
   - User support email: Your email
   - Developer contact: Your email
   - Click "SAVE AND CONTINUE"
   
   **Scopes:**
   - Click "ADD OR REMOVE SCOPES"
   - Add: `email`, `profile`, `openid`
   - Click "UPDATE" then "SAVE AND CONTINUE"
   
   **Test users (for development):**
   - Add your email address
   - Click "SAVE AND CONTINUE"

5. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "SmartMart Production"
   
   **Authorized JavaScript origins:**
   ```
   https://www.smrtmart.com
   https://smrtmart.com
   http://localhost:3000
   ```
   
   **Authorized redirect URIs:**
   ```
   https://www.smrtmart.com/api/auth/callback/google
   https://smrtmart.com/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
   
   - Click "CREATE"

6. **Copy Credentials**
   - You'll see a popup with:
     - **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-abc123xyz`)
   - **SAVE THESE!** You'll need them in the next step

### Step 2: Add Credentials to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your SmartMart project

2. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add these variables:

   ```bash
   # Google OAuth
   GOOGLE_CLIENT_ID=<paste your Client ID here>
   GOOGLE_CLIENT_SECRET=<paste your Client Secret here>
   
   # Also ensure these are set:
   DATABASE_URL=<your PostgreSQL connection string>
   BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
   NEXT_PUBLIC_APP_URL=https://www.smrtmart.com
   ```

3. **Set for All Environments**
   - Check: Production, Preview, Development
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments"
   - Click on the latest deployment
   - Click "..." → "Redeploy"
   - Wait 3-5 minutes

### Step 3: Test Google Login

1. **Visit Production Site**
   ```bash
   open https://www.smrtmart.com/login
   ```

2. **Click "Continue with Google"**
   - Should open Google login popup
   - Select your account
   - Grant permissions
   - Should redirect back and be logged in

3. **If it doesn't work:**
   - Check browser console for errors
   - Check Vercel logs for errors
   - Verify redirect URIs match exactly
   - See troubleshooting below

## 🔧 Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URI doesn't match what's configured in Google Console

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click on your OAuth client
3. Add these EXACT URIs:
   ```
   https://www.smrtmart.com/api/auth/callback/google
   https://smrtmart.com/api/auth/callback/google
   ```
4. Save and try again

### Error: "Access blocked: This app's request is invalid"

**Problem:** OAuth consent screen not configured or app not verified

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Complete all required fields
3. Add test users (your email)
4. For production, submit for verification (takes 1-2 weeks)

### Error: "Popup blocked"

**Problem:** Browser is blocking the OAuth popup

**Solution:**
1. Allow popups for smrtmart.com
2. Try in a different browser
3. Disable popup blockers

### Error: "Invalid client"

**Problem:** Client ID or Secret is wrong

**Solution:**
1. Double-check credentials in Vercel
2. Make sure there are no extra spaces
3. Regenerate credentials if needed

## 📝 Environment Variables Checklist

Make sure ALL of these are set in Vercel:

```bash
# Required for Google OAuth
✓ GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
✓ GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz

# Required for BetterAuth
✓ DATABASE_URL=postgresql://user:pass@host:5432/db
✓ BETTER_AUTH_SECRET=<32+ random characters>
✓ NEXT_PUBLIC_APP_URL=https://www.smrtmart.com

# Optional but recommended
✓ MAILJET_API_KEY=<for magic link emails>
✓ MAILJET_SECRET_KEY=<for magic link emails>
```

## 🎯 Quick Test

After setup, test these:

1. **Google Login**
   ```bash
   open https://www.smrtmart.com/login
   # Click "Continue with Google"
   # Should work!
   ```

2. **Check Session**
   ```bash
   # After login, open browser console:
   document.cookie
   # Should see: better-auth.session_token=...
   ```

3. **Test Protected Routes**
   ```bash
   open https://www.smrtmart.com/account
   # Should show your account (not redirect to login)
   ```

## 🔐 Security Best Practices

1. **Never commit credentials to Git**
   - Always use environment variables
   - Keep `.env.local` in `.gitignore`

2. **Use different credentials for dev/prod**
   - Create separate OAuth clients
   - One for localhost
   - One for production

3. **Rotate secrets regularly**
   - Change BETTER_AUTH_SECRET every 6 months
   - Regenerate OAuth credentials if compromised

4. **Monitor OAuth usage**
   - Check Google Cloud Console for unusual activity
   - Review Vercel logs for failed auth attempts

## 📞 Need Help?

### Google Cloud Console Issues
- **Documentation:** https://developers.google.com/identity/protocols/oauth2
- **Support:** https://support.google.com/cloud

### Vercel Issues
- **Documentation:** https://vercel.com/docs/environment-variables
- **Support:** https://vercel.com/support

### BetterAuth Issues
- **Documentation:** https://www.better-auth.com/docs
- **See also:** `AUTH_TROUBLESHOOTING.md` in this directory

## ✅ Success Checklist

After completing setup:

- [ ] Google OAuth credentials created
- [ ] Redirect URIs configured correctly
- [ ] Environment variables added to Vercel
- [ ] Site redeployed
- [ ] Google login works on production
- [ ] Session persists after refresh
- [ ] No console errors
- [ ] Can access protected routes

---

**Estimated Time:** 15 minutes  
**Difficulty:** Easy  
**Cost:** Free (Google OAuth is free)

Once set up, Google login will work reliably for all users! 🎉
