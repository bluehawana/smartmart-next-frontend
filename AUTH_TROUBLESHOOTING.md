# BetterAuth Troubleshooting Guide

## 🔧 Fixed Issues

### Problem: Login page fails to load or requires multiple attempts

**Root Causes:**
1. Database connection pool exhaustion in serverless environment
2. Race conditions during auth initialization
3. Missing error handling and retry logic
4. CORS configuration issues

**Solutions Implemented:**

#### 1. Singleton Pattern for Database Pool
```typescript
// Before: New pool created on every request
const pool = new Pool({...})

// After: Singleton pattern
let poolInstance: Pool | null = null
function getPool() {
  if (!poolInstance) {
    poolInstance = new Pool({...})
  }
  return poolInstance
}
```

#### 2. Optimized Pool Settings
```typescript
{
  max: 5,                      // Reduced from 10 for serverless
  min: 0,                      // No minimum connections
  idleTimeoutMillis: 20000,    // Faster cleanup (was 30s)
  connectionTimeoutMillis: 5000, // Fail faster (was 10s)
  statement_timeout: 10000,    // Prevent hanging queries
}
```

#### 3. Retry Logic in API Routes
```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 500
): Promise<T>
```

#### 4. Enhanced Error Handling
- Client-side error boundaries
- Detailed error messages
- Retry counter for user feedback
- Graceful degradation

#### 5. Session Check Before Login
- Prevents unnecessary login attempts
- Redirects if already authenticated
- Shows loading state during check

## 🚀 Quick Fixes

### Issue: "Authentication service temporarily unavailable"

**Solution 1: Check Database Connection**
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"
```

**Solution 2: Verify Environment Variables**
```bash
# Required variables
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
NEXT_PUBLIC_APP_URL=...
```

**Solution 3: Restart Development Server**
```bash
# Kill all node processes
pkill -f "next"

# Restart
npm run dev
```

### Issue: Magic link not sending

**Check 1: Mailjet Configuration**
```bash
# Verify Mailjet credentials
echo $MAILJET_API_KEY
echo $MAILJET_SECRET_KEY
```

**Check 2: Email Service Logs**
```bash
# Check server logs for email errors
# Look for: "[Better Auth] ❌ Failed to send magic link email"
```

**Check 3: Test Email Function**
```typescript
// Test in isolation
import { sendMagicLinkEmail } from '@/lib/email'
await sendMagicLinkEmail({
  email: 'test@example.com',
  url: 'https://example.com/verify'
})
```

### Issue: Social login popup blocked

**Solution:**
1. Allow popups in browser settings
2. Try different browser
3. Disable popup blockers
4. Check browser console for errors

### Issue: CORS errors

**Check CORS Headers:**
```typescript
// Verify origin is in allowed list
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://www.smrtmart.com',
  // Add your domain
]
```

## 🔍 Debugging Steps

### 1. Enable Detailed Logging

Add to `.env.local`:
```bash
NODE_ENV=development
DEBUG=better-auth:*
```

### 2. Check Database Tables

```sql
-- Verify auth tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%auth%';

-- Check user table
SELECT * FROM "user" LIMIT 5;

-- Check session table
SELECT * FROM "session" LIMIT 5;
```

### 3. Test Auth API Directly

```bash
# Test health endpoint
curl http://localhost:3000/api/auth/session

# Test with credentials
curl -X POST http://localhost:3000/api/auth/sign-in/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 4. Check Browser Console

Look for:
- Network errors (failed requests)
- CORS errors
- JavaScript errors
- Cookie issues

### 5. Verify Cookie Settings

```javascript
// In browser console
document.cookie
// Should see: better-auth.session_token=...
```

## 🛠️ Common Error Messages

### "Failed to send magic link"

**Causes:**
- Mailjet credentials invalid
- Email service down
- Network timeout

**Fix:**
1. Verify Mailjet API keys
2. Check Mailjet dashboard for errors
3. Test with different email provider

### "Network error. Please check your connection"

**Causes:**
- API route not responding
- Database connection failed
- Timeout

**Fix:**
1. Check if dev server is running
2. Verify DATABASE_URL is correct
3. Check database is accessible
4. Increase timeout in API route

### "Service temporarily unavailable"

**Causes:**
- Database pool exhausted
- Too many concurrent requests
- Database down

**Fix:**
1. Restart development server
2. Check database status
3. Reduce pool max connections
4. Check for connection leaks

## 📊 Performance Monitoring

### Check Pool Status

Add to `auth.ts`:
```typescript
setInterval(() => {
  console.log('[Pool Stats]', {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  })
}, 30000) // Every 30 seconds
```

### Monitor API Response Times

```typescript
// In API route
const start = Date.now()
const response = await handlers.POST(request)
console.log(`[Auth API] Request took ${Date.now() - start}ms`)
```

## 🔐 Security Checklist

- [ ] BETTER_AUTH_SECRET is random and secure (32+ characters)
- [ ] DATABASE_URL uses SSL in production
- [ ] CORS origins are properly configured
- [ ] Cookies are secure in production (HTTPS only)
- [ ] Session expiry is reasonable (7 days)
- [ ] Magic link expiry is short (10 minutes)
- [ ] Rate limiting is enabled (TODO)
- [ ] Email verification is working

## 🚨 Emergency Fixes

### Complete Reset

```bash
# 1. Stop server
pkill -f "next"

# 2. Clear Next.js cache
rm -rf .next

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Reset database tables (CAUTION: Deletes data!)
psql $DATABASE_URL -c "DROP TABLE IF EXISTS \"user\", \"session\", \"account\", \"verification\" CASCADE;"

# 5. Restart server
npm run dev
```

### Rollback to Previous Version

```bash
# If new changes broke auth
git log --oneline src/lib/auth.ts
git checkout <previous-commit> src/lib/auth.ts
git checkout <previous-commit> src/lib/auth-client.ts
```

## 📞 Getting Help

### Information to Provide

When reporting issues, include:

1. **Error Message**: Exact error from console/logs
2. **Environment**: Development or production
3. **Browser**: Chrome, Firefox, Safari, etc.
4. **Steps to Reproduce**: What you did before error
5. **Logs**: Server logs and browser console
6. **Environment Variables**: (Redact secrets!)

### Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check database connection
psql $DATABASE_URL -c "\conninfo"

# View recent logs
tail -f .next/server/app/api/auth/[...all]/route.log

# Check port usage
lsof -i :3000
```

## ✅ Verification Checklist

After implementing fixes, verify:

- [ ] Login page loads on first try
- [ ] Magic link email sends successfully
- [ ] Magic link redirects correctly
- [ ] Social login (Google/GitHub) works
- [ ] Session persists after page refresh
- [ ] Logout works correctly
- [ ] Protected routes redirect to login
- [ ] No console errors
- [ ] No network errors
- [ ] Database connections are released

## 🎯 Best Practices

1. **Always use singleton pattern** for database connections
2. **Implement retry logic** for transient failures
3. **Add comprehensive error handling** at every layer
4. **Log errors** but not sensitive data
5. **Test in multiple browsers** before deploying
6. **Monitor database pool** in production
7. **Set up alerts** for auth failures
8. **Keep dependencies updated** (especially better-auth)
9. **Use environment-specific configs** (dev vs prod)
10. **Document any custom changes** to auth flow

## 📚 Additional Resources

- [BetterAuth Documentation](https://www.better-auth.com/docs)
- [PostgreSQL Connection Pooling](https://node-postgres.com/features/pooling)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

---

**Last Updated:** January 2026  
**Version:** 2.0.0
