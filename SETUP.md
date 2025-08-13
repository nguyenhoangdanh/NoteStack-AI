# AI Notes Setup Guide

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up Convex

```bash
# Install Convex CLI
npm install -g convex

# Initialize Convex project (follow prompts to create account)
npx convex dev
```

### 3. Configure Environment Variables

After running `npx convex dev`, copy your Convex URL and update `.env.local`:

```bash
# Copy from your Convex dashboard
VITE_CONVEX_URL=https://your-project.convex.cloud

# Optional: Add OpenAI for AI features
OPENAI_API_KEY=sk-your-openai-key

# Optional: Add Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

### 4. Start Development

```bash
# In one terminal: Start Convex
npx convex dev

# In another terminal: Start the app
pnpm dev
```

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized origins:
   - `http://localhost:8080` (development)
   - Your production domain
6. Add redirect URIs:
   - `http://localhost:8080/api/auth/callback/google`
   - Your production callback URL

## OpenAI Setup (Optional)

1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to your Convex environment:

```bash
npx convex env set OPENAI_API_KEY sk-your-key-here
```

## Features Available

### ✅ Currently Working

- **User Authentication**: Google OAuth + Email/Password via Convex Auth
- **Notes Management**: Create, edit, delete notes with real-time sync
- **Workspaces**: Automatic workspace creation for new users
- **Search**: Real-time search through notes
- **Responsive UI**: Beautiful interface that works on all devices
- **Tags**: Organize notes with tags
- **Auto-save**: Changes are saved automatically

### 🔄 Coming Soon (requires OpenAI setup)

- **AI Chat**: Ask questions about your notes
- **Semantic Search**: Vector-based search through note content
- **Smart Summaries**: AI-generated note summaries
- **Content Suggestions**: AI-powered writing assistance

## Deployment

### Deploy to Production

```bash
# Deploy Convex functions
npx convex deploy --prod

# Build frontend
pnpm build

# Deploy to your hosting platform (Netlify, Vercel, etc.)
```

### Environment Variables for Production

Set these in your Convex production environment:

```bash
npx convex env set OPENAI_API_KEY sk-your-production-key --prod
npx convex env set AUTH_GOOGLE_ID your-production-google-id --prod
npx convex env set AUTH_GOOGLE_SECRET your-production-secret --prod
```

## Troubleshooting

### "VITE_CONVEX_URL is not set"

- Make sure you've run `npx convex dev` and copied the URL to `.env.local`

### Authentication not working

- Check your Google OAuth configuration
- Verify redirect URIs match your domain exactly

### AI features not working

- Ensure `OPENAI_API_KEY` is set in your Convex environment
- Check your OpenAI account has sufficient credits

## Support

- **Convex Docs**: https://docs.convex.dev/
- **OpenAI Docs**: https://platform.openai.com/docs
- **GitHub Issues**: Create an issue for bugs or feature requests

---

🎉 **You're all set!** Your AI Notes app is ready to use with real-time synchronization and powerful note management features.
