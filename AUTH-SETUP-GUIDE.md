# SmrtMart Authentication & Admin Setup Guide

## 🎉 What We've Built

### ✅ Authentication System with Better Auth
- **Multi-provider OAuth**: Google, GitHub, Facebook sign-in
- **Email/Password** authentication
- **Role-based access**: Customer vs Owner roles
- **Marketing consent** tracking
- **Beautiful UI** with responsive design

### ✅ Features Implemented
1. **Sign-in/Sign-up Page** (`/auth/signin`)
   - Social OAuth buttons (Google, GitHub, Facebook)
   - Email/password form
   - Automatic account creation
   - Beautiful gradient design

2. **Header with Authentication**
   - User avatar/initial display
   - Dropdown menu with profile
   - Owner badge for admin
   - Sign out functionality
   - Cart integration

3. **Database Integration**
   - Connected to your Supabase PostgreSQL
   - Auto-creates auth tables on first use
   - Stores user data, sessions, accounts

---

## 🔧 Configuration Steps

### Step 1: Set Up OAuth Providers

You need to create OAuth apps for each provider you want to use:

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
4. Application type: "Web application"
5. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://www.smrtmart.com/api/auth/callback/google
   ```
6. Copy Client ID and Client Secret to `.env.local`:
   ```
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   ```

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: SmrtMart
   - Homepage URL: `https://www.smrtmart.com`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Create and copy credentials to `.env.local`:
   ```
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret
   ```

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/apps)
2. Create a new app
3. Add "Facebook Login" product
4. Settings → Basic: Copy App ID and App Secret
5. Facebook Login → Settings → Valid OAuth Redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/facebook
   https://www.smrtmart.com/api/auth/callback/facebook
   ```
6. Add to `.env.local`:
   ```
   AUTH_FACEBOOK_ID=your_facebook_app_id
   AUTH_FACEBOOK_SECRET=your_facebook_app_secret
   ```

### Step 2: Update Environment Variables

Edit `/mnt/c/Users/BLUEH/projects/smrmart/smartmart-next-frontend/.env.local`:

```bash
# Replace with your actual Supabase password
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.mqkoydypybxgcwxioqzc.supabase.co:5432/postgres

# Add OAuth credentials (from Step 1)
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
AUTH_FACEBOOK_ID=...
AUTH_FACEBOOK_SECRET=...

# Set your wife's email as owner
NEXT_PUBLIC_OWNER_EMAIL=your_wife_email@gmail.com
```

### Step 3: Test the Authentication

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# Click "Sign In" button
# Try signing in with Google/GitHub/Facebook or email
```

---

## 📋 Next Steps (What We'll Build Next)

### 1. Owner Admin Dashboard (`/admin`)
For your wife to manage products easily:
- ✅ Simple product listing table
- ✅ "Add New Product" button
- ✅ Edit existing products
- ✅ Delete products
- ✅ Upload product images to CloudFlare R2

### 2. Product Management Form
Easy-to-use form with:
- Product name
- Description (rich text editor)
- Price
- Stock amount
- Category
- Image upload (drag & drop)
- Save/Publish button

### 3. Authentication Guards
Protect cart and checkout:
- Redirect to sign-in if not logged in
- Show "Sign in to add to cart" message
- After sign-in, return to previous page

### 4. User Profile & Marketing
- User profile page with order history
- Marketing consent checkbox
- Email collection for campaigns
- Export user data for marketing

---

## 🎯 Current File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts          # Better Auth API endpoint
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx              # Sign-in/Sign-up page
│   └── layout.tsx                     # Root layout with auth
│
├── components/
│   └── layout/
│       └── Header/
│           └── Header.tsx             # Header with auth menu
│
├── lib/
│   ├── auth.ts                        # Better Auth config (server)
│   ├── auth-client.ts                 # Better Auth client hooks
│   └── db/
│       └── schema.ts                  # Database schema
│
└── .env.local                         # Environment variables
```

---

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt
- ✅ Secure session cookies
- ✅ CSRF protection
- ✅ OAuth state verification
- ✅ Role-based access control
- ✅ HTTPS required in production

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` in `.env.local`
- Verify Supabase password is correct
- Ensure Supabase project is running

### "OAuth provider not working"
- Verify OAuth credentials in `.env.local`
- Check redirect URLs match exactly
- Restart dev server after adding credentials

### "Owner role not working"
- Verify `NEXT_PUBLIC_OWNER_EMAIL` matches exactly
- Sign out and sign in again
- Check in header dropdown for "Owner" badge

---

## 🚀 Ready to Continue?

Say "continue" and I'll build:
1. **Admin Dashboard** - Beautiful product management interface
2. **Product Form** - Easy product creation with image upload
3. **Cart Protection** - Require login for checkout
4. **User Profile** - Customer data collection

**Your SmartMart is getting smarter!** 🎉
