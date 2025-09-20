# Vercel Deployment Guide

## Project Link
- Dashboard: https://vercel.com/alabs-projects-e124c746/smrtmart-frontend
- Git branch: `master`
- Production domains: `smrtmart.com`, `www.smrtmart.com`

## Required Environment Variables
Set these values in **Settings → Environment Variables**. Apply them to Production, Preview, and Development.

```
NEXT_PUBLIC_API_URL=https://smrtmart-backend-1757499174-0dfbd8d4731e.herokuapp.com/api/v1
NEXT_PUBLIC_IMAGE_BASE_URL=https://2a35af424f8734e497a5d707344d79d5.r2.cloudflarestorage.com/smrtmart
NEXT_PUBLIC_R2_PUBLIC_BASE=https://pub-f181c83ced9f499bbd048ab1e553216c.r2.dev
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QWpPTIce1IQpcM8C2SczSOUY2NEGMDcKWjLzvvPUe8LrfXUMZfyehcuDjc1nd663TAzVTFpt5LeddGk6y8hmosX00DNMfVP9i
```

After saving, trigger **Redeploy > Redeploy Production**.

## Domain Configuration Checklist
- [ ] Add `smrtmart.com` and `www.smrtmart.com` under **Settings → Domains**
- [ ] Assign the domain to this project (remove it from any other Vercel projects)
- [ ] If DNS is managed outside Vercel, set A/AAAA or CNAME records pointing to Vercel as instructed in the UI
- [ ] Request an HTTPS certificate after DNS propagates (Vercel prompts automatically)

## Verification Steps
1. Visit https://smrtmart.com after redeploy. It should resolve to the production build.
2. Use the Network tab to confirm API calls go to `...herokuapp.com/api/v1` and return `200`.
3. Run the health check locally if needed:
   ```bash
   curl "https://smrtmart-backend-1757499174-0dfbd8d4731e.herokuapp.com/api/v1/products?limit=1"
   ```
4. Check Vercel logs for the production deployment if anything fails:
   ```bash
   vercel logs smrtmart-frontend --prod
   ```

## Notes
- The fallback API base in code now points to the Heroku backend, so missing env vars will no longer break production.
- Image URLs are rewritten to use Cloudflare R2 when the storage filenames differ, preventing broken product images.
