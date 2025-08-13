# AI Notes - Intelligent Note-Taking App

A production-ready AI-powered note-taking application built with React, Vite, Convex, and OpenAI. Features real-time synchronization, semantic search, and AI chat over your notes using RAG (Retrieval-Augmented Generation).

## ✨ Features

- **Smart Markdown Editor**: Rich text editing with markdown support
- **AI-Powered Search**: Semantic search through your notes using vector embeddings
- **AI Chat**: Ask questions about your notes and get contextual answers
- **Real-time Sync**: Notes sync instantly across all devices
- **Google OAuth**: Secure authentication with Google
- **File Import/Export**: Import .md/.txt files, export to markdown
- **Keyboard Shortcuts**: Speed up your workflow with hotkeys
- **Dark Mode**: Beautiful UI with light/dark theme support
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key
- Google OAuth credentials

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-notes
pnpm install
```

### 2. Set up Convex

```bash
# Install Convex CLI globally
npm install -g convex

# Initialize Convex project
npx convex dev

# Follow the prompts to create a new Convex project
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Convex
VITE_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key

# Google OAuth (for Convex Auth)
AUTH_GOOGLE_ID=your-google-oauth-client-id.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-oauth-client-secret

# Auth Secret for JWT signing
AUTH_SECRET=your-random-secret-key-here
```

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://your-app.convex.site` (for production)
7. Add authorized redirect URIs:
   - `http://localhost:5173/api/auth/callback/google`
   - `https://your-app.convex.site/api/auth/callback/google`
8. Copy the Client ID and Client Secret to your `.env.local`

### 5. Deploy Convex Functions

```bash
npx convex deploy
```

### 6. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173` to see your app!

## 📁 Project Structure

```
ai-notes/
├── client/                     # React frontend
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── NoteEditor.tsx    # Markdown editor
│   │   ├── ChatPanel.tsx     # AI chat interface
│   │   ├── SearchBar.tsx     # Search component
│   │   └── Sidebar.tsx       # Navigation sidebar
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and stores
│   │   ├── store.ts          # Zustand state management
│   │   ├── query.tsx         # React Query setup
│   │   └── fileUtils.ts      # Import/export utilities
│   ├── pages/                # Main application pages
│   │   ├── Notes.tsx         # Main notes interface
│   │   └── Settings.tsx      # Settings page
│   └── App.tsx               # Root component
├── convex/                    # Convex backend
│   ├── auth.config.ts        # Authentication config
│   ├── schema.ts             # Database schema
│   ├── users.ts              # User management
│   ├── notes.ts              # Notes CRUD operations
│   ├── vectors.ts            # Vector/RAG operations
│   ├── chat.ts               # AI chat endpoints
│   ├── lib/
│   │   └── rag.ts            # RAG utilities
│   └── http.ts               # HTTP route handlers
└── shared/                    # Shared types (if needed)
```

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm typecheck    # Run TypeScript checking
pnpm test         # Run tests
```

### Environment Setup

For development, you'll need:

1. **Convex Development Environment**:
   ```bash
   npx convex dev
   ```

2. **Vite Development Server**:
   ```bash
   pnpm dev
   ```

## 🔑 Configuration

### Convex Auth Setup

The app uses Convex Auth with Google OAuth. Make sure to:

1. Configure your OAuth URLs correctly in Google Cloud Console
2. Set the correct environment variables
3. Deploy your auth configuration to Convex

### OpenAI API Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file
3. The app uses `text-embedding-3-small` for embeddings and configurable models for chat

### Vector Search Configuration

The app automatically:
- Chunks notes into 300-600 token pieces
- Generates embeddings using OpenAI
- Stores vectors in Convex with user isolation
- Performs semantic search with MMR re-ranking

## 🚀 Deployment

### Deploy to Convex

```bash
# Build and deploy backend
npx convex deploy --prod

# Update environment variables for production
npx convex env set OPENAI_API_KEY sk-your-production-key
npx convex env set AUTH_GOOGLE_ID your-production-google-id
npx convex env set AUTH_GOOGLE_SECRET your-production-google-secret
npx convex env set AUTH_SECRET your-production-auth-secret
```

### Deploy Frontend

The frontend can be deployed to any static hosting service:

#### Netlify
```bash
pnpm build
# Upload dist/ folder to Netlify
```

#### Vercel
```bash
pnpm build
# Deploy dist/ folder to Vercel
```

#### Convex Hosting
```bash
# Convex can host your frontend automatically
npx convex deploy --prod
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + N` | Create new note |
| `Cmd/Ctrl + S` | Save current note |
| `Cmd/Ctrl + J` | Toggle chat panel |
| `Cmd/Ctrl + ,` | Open settings |
| `/` | Quick search |
| `?` | Show keyboard shortcuts |
| `Esc` | Close dialogs |

## 🔒 Security

- All data is isolated by user ID
- Google OAuth for secure authentication
- Convex handles auth tokens and sessions
- OpenAI API calls are server-side only
- Input sanitization and validation throughout

## 📊 Usage Analytics

The app tracks:
- Token usage for embeddings and chat
- Daily usage statistics
- Performance metrics

Access usage data in Settings → Usage & Analytics.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

1. **"VITE_CONVEX_URL is not set"**
   - Make sure you've run `npx convex dev` and copied the URL to `.env.local`

2. **Google OAuth not working**
   - Check your redirect URIs in Google Cloud Console
   - Ensure AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET are correct

3. **OpenAI API errors**
   - Verify your OPENAI_API_KEY is valid and has sufficient credits
   - Check that you have access to the embedding models

4. **Vector search not working**
   - Make sure notes are being processed (check the auto-reembed setting)
   - Verify embeddings are being generated (check usage analytics)

### Getting Help

- Check the [Convex Documentation](https://docs.convex.dev/)
- Review [OpenAI API Documentation](https://platform.openai.com/docs)
- Open an issue on GitHub for bugs or feature requests

## 🎯 Roadmap

- [ ] PDF import support
- [ ] Collaborative notes
- [ ] Note sharing with public links
- [ ] Mobile app (React Native)
- [ ] Advanced AI features (summarization, etc.)
- [ ] Integration with other note apps
- [ ] Offline mode improvements

---

Built with ���️ using React, Vite, Convex, and OpenAI.
