# AI Notes - Deployment Guide

This guide covers deploying AI Notes to production using Convex hosting and other platforms.

## 🎯 Deployment Options

### Option 1: Convex Hosting (Recommended)
Convex can host both your backend and frontend, providing a seamless deployment experience.

### Option 2: Separate Hosting
Deploy backend to Convex and frontend to Netlify, Vercel, or other static hosting.

## 🚀 Convex Hosting Deployment

### 1. Prepare for Production

```bash
# Build the application
pnpm build

# Make sure all dependencies are installed
pnpm install
```

### 2. Configure Production Environment

Set production environment variables in Convex:

```bash
# Set OpenAI API key
npx convex env set OPENAI_API_KEY sk-your-production-openai-key

# Set Google OAuth credentials
npx convex env set AUTH_GOOGLE_ID your-production-google-id.googleusercontent.com
npx convex env set AUTH_GOOGLE_SECRET your-production-google-secret

# Set authentication secret (generate a secure random string)
npx convex env set AUTH_SECRET your-production-auth-secret
```

### 3. Update Google OAuth for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 credentials
3. Add production authorized JavaScript origins:
   ```
   https://your-app-name.convex.site
   ```
4. Add production authorized redirect URIs:
   ```
   https://your-app-name.convex.site/api/auth/callback/google
   ```

### 4. Deploy to Convex

```bash
# Deploy backend functions and host frontend
npx convex deploy --prod

# Your app will be available at:
# https://your-app-name.convex.site
```

## 🌐 Separate Frontend Hosting

If you prefer to host the frontend separately:

### Deploy to Netlify

1. **Build the application:**
   ```bash
   pnpm build
   ```

2. **Update environment variables for production:**
   Create a production `.env.local` with your production Convex URL:
   ```bash
   VITE_CONVEX_URL=https://your-production-project.convex.cloud
   ```

3. **Deploy to Netlify:**
   - Upload the `dist/` folder to Netlify
   - Or connect your GitHub repo for automatic deployments
   - Add environment variables in Netlify dashboard

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   pnpm build
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**

## 🔒 Production Security Checklist

### ✅ Environment Variables
- [ ] Use production-specific API keys
- [ ] Generate new AUTH_SECRET for production
- [ ] Use production Convex deployment
- [ ] Verify all environment variables are set

### ✅ Google OAuth
- [ ] Update authorized JavaScript origins
- [ ] Update redirect URIs for production domain
- [ ] Test OAuth flow in production
- [ ] Consider using separate OAuth app for production

### ✅ API Security
- [ ] Verify OpenAI API key has appropriate rate limits
- [ ] Monitor usage and set up billing alerts
- [ ] Review Convex security rules
- [ ] Test all authentication flows

### ✅ Performance
- [ ] Verify vector search is working
- [ ] Test real-time synchronization
- [ ] Check loading times
- [ ] Monitor error rates

## 📊 Monitoring and Maintenance

### Convex Dashboard
Monitor your deployment at: https://dashboard.convex.dev

Key metrics to watch:
- Function execution times
- Database operations
- Authentication events
- Error rates

### OpenAI Usage
Monitor at: https://platform.openai.com/usage

Track:
- Token usage (embeddings + chat)
- Cost per day/month
- Rate limit hits

### Application Health

Set up monitoring for:
- User authentication success rate
- Note save/sync success rate
- AI chat response times
- Vector search performance

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'pnpm'
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build application
      run: pnpm build
    
    - name: Deploy to Convex
      env:
        CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
      run: |
        npx convex deploy --prod
```

## 🚨 Troubleshooting Production Issues

### Common Production Issues

1. **OAuth Redirect Mismatch**
   - Verify redirect URIs in Google Cloud Console
   - Check that domains match exactly (no trailing slashes)

2. **Environment Variables Not Set**
   - Check Convex dashboard for missing variables
   - Verify frontend has correct VITE_CONVEX_URL

3. **API Rate Limits**
   - Monitor OpenAI usage dashboard
   - Implement proper error handling for rate limits

4. **Vector Search Not Working**
   - Check that embeddings are being generated
   - Verify OpenAI API key has embedding access

### Performance Optimization

1. **Enable Compression**
   Most hosting platforms enable gzip compression automatically.

2. **CDN Configuration**
   Convex hosting includes CDN automatically.

3. **Caching Strategy**
   - Convex handles backend caching
   - Frontend uses React Query for client-side caching

## 📝 Post-Deployment Checklist

After deploying to production:

- [ ] Test user registration flow
- [ ] Create and edit notes
- [ ] Test AI chat functionality
- [ ] Verify file import/export
- [ ] Test real-time sync across multiple tabs
- [ ] Check keyboard shortcuts work
- [ ] Verify mobile responsiveness
- [ ] Test settings and preferences
- [ ] Monitor error logs for the first few hours

## 🆘 Support

If you encounter issues during deployment:

1. Check the [Convex Documentation](https://docs.convex.dev/)
2. Review [OpenAI API Documentation](https://platform.openai.com/docs)
3. Check Google Cloud Console for OAuth setup
4. Monitor application logs in respective dashboards
5. Open an issue on GitHub for deployment-specific problems

---

For additional help, refer to the main [README.md](README.md) or open an issue.
