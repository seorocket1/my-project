# 🚀 Netlify Deployment Guide

This guide will help you deploy your ImageGen AI application to Netlify.

## 📋 Prerequisites

- A GitHub account
- A Netlify account (free tier is fine)
- Your project code in a GitHub repository

## 🔧 Deployment Steps

### Step 1: Prepare Your Repository

Your project is already configured with:
- ✅ `netlify.toml` configuration file
- ✅ `_redirects` file for SPA routing
- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`

### Step 2: Connect to Netlify

#### Option A: Via Netlify Dashboard (Recommended)

1. **Go to Netlify**: https://app.netlify.com/
2. **Click**: "Add new site" → "Import an existing project"
3. **Connect to Git Provider**: Choose GitHub
4. **Authorize Netlify**: Allow access to your repositories
5. **Select Repository**: Choose your image-gen repository

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
```

### Step 3: Configure Build Settings

In the Netlify dashboard, set these build settings:

```
Base directory: (leave empty)
Build command: npm run build
Publish directory: dist
```

### Step 4: Add Environment Variables

**CRITICAL**: You must add these environment variables for the app to work:

1. Go to: **Site settings** → **Environment variables**
2. Click: **Add a variable** → **Add a single variable**
3. Add the following:

```
Key: VITE_SUPABASE_URL
Value: https://tlreizesfetoalcbcffz.supabase.co
Scope: All (or Production)
```

```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscmVpemVzZmV0b2FsY2JjZmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NjQ0MTcsImV4cCI6MjA2ODA0MDQxN30.UCansK7Laip-p79fTLk7OpvnKOgpOkj9qj-kJUW-IMQ
Scope: All (or Production)
```

⚠️ **Important**: The variable names MUST start with `VITE_` for Vite to recognize them!

### Step 5: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at: `https://[random-name].netlify.app`

### Step 6: Configure Custom Domain (Optional)

1. Go to: **Site settings** → **Domain management**
2. Click: **Add custom domain**
3. Follow the instructions to configure DNS

## 🔄 Continuous Deployment

Once connected, Netlify will automatically:
- Deploy when you push to your main branch
- Build preview deployments for pull requests
- Show deploy logs for debugging

## 🐛 Troubleshooting

### Issue: "Supabase client not initialized"
**Solution**: Make sure environment variables are set correctly in Netlify dashboard

### Issue: 404 on page refresh
**Solution**: The `_redirects` file should be in the `dist` folder (already configured)

### Issue: Build fails
**Solution**:
1. Check build logs in Netlify dashboard
2. Ensure Node.js version is 18+ (set in netlify.toml)
3. Try clearing cache and redeploying

### Issue: Environment variables not loading
**Solution**:
1. Variable names must be EXACTLY: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Clear cache and redeploy after adding variables
3. Check that scope is set to "All" or "Production"

## 📊 Build Configuration

Your `netlify.toml` file contains:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## 🎯 Post-Deployment Checklist

- [ ] Site deploys successfully
- [ ] Environment variables are set
- [ ] Sign-in/Sign-up works
- [ ] Image generation works
- [ ] All routes work (no 404s)
- [ ] Dashboard loads correctly
- [ ] History page works
- [ ] Bulk processing works

## 🔗 Useful Links

- Netlify Dashboard: https://app.netlify.com/
- Netlify Documentation: https://docs.netlify.com/
- Supabase Dashboard: https://supabase.com/dashboard

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console for errors
3. Verify environment variables are set
4. Try clearing cache and redeploying

---

🎉 **That's it!** Your ImageGen AI app should now be live on Netlify!
