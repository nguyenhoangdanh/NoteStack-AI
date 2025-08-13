# AI Notes - Intelligent Note-Taking App

A production-ready AI-powered note-taking application built with React, Vite, NestJS, and OpenAI. Features real-time synchronization, semantic search, and AI chat over your notes using RAG (Retrieval-Augmented Generation).

## ✨ Features

- **Smart Markdown Editor**: Rich text editing with markdown support
- **AI-Powered Search**: Semantic search through your notes using vector embeddings
- **AI Chat**: Ask questions about your notes and get contextual answers
- **Google OAuth**: Secure authentication with Google
- **File Import/Export**: Import .md/.txt files, export to markdown
- **Keyboard Shortcuts**: Speed up your workflow with hotkeys
- **Dark Mode**: Beautiful UI with light/dark theme support
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm
- OpenAI API key
- Google OAuth credentials

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-notes

# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install
```

### 2. Set up Database

```bash
# Install PostgreSQL and create database
createdb ai_notes

# Or use Docker
docker run --name ai-notes-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### 3. Configure Backend Environment

Create `backend/.env`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_notes?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-oauth-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback` (for development)
   - `https://your-api.domain.com/auth/google/callback` (for production)
7. Copy the Client ID and Client Secret to your `.env`

### 5. Initialize Database

```bash
cd backend

# Generate Prisma client
pnpm prisma:generate

# Push database schema
pnpm prisma:push

# Optional: View database in Prisma Studio
pnpm prisma:studio
```

### 6. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
pnpm start:dev

# Terminal 2: Start frontend
cd frontend
pnpm dev
```

Visit `http://localhost:3000` to see your app!

## 📁 Project Structure

```
ai-notes/
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and stores
│   │   └── App.tsx           # Root component
│   └── package.json
├── backend/                   # NestJS backend
│   ├── src/
│   │   ├── auth/             # Authentication module
│   │   ├── notes/            # Notes CRUD operations
│   │   ├── chat/             # AI chat endpoints
│   │   ├── vectors/          # Vector/RAG operations
│   │   ├── users/            # User management
│   │   ├── workspaces/       # Workspace management
│   │   ├── settings/         # User settings
│   │   └── prisma/           # Database service
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
└── README.md
```

## 🛠️ Development

### Backend Commands

```bash
cd backend

pnpm start:dev      # Start development server
pnpm build          # Build for production
pnpm start:prod     # Start production server
pnpm test           # Run tests
pnpm prisma:studio  # Open database GUI
```

### Frontend Commands

```bash
cd frontend

pnpm dev            # Start development server
pnpm build          # Build for production
pnpm preview        # Preview production build
```

## 🚀 Deployment

### Backend Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Set up PostgreSQL database
3. **Deploy**: Use platforms like Railway, Heroku, or DigitalOcean

```bash
# Build backend
cd backend
pnpm build

# Run migrations in production
pnpm prisma:migrate

# Start production server
pnpm start:prod
```

### Frontend Deployment

```bash
cd frontend
pnpm build
# Deploy dist/ folder to Netlify, Vercel, etc.
```

## 🔑 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback

### Notes
- `GET /notes` - List notes
- `POST /notes` - Create note
- `GET /notes/:id` - Get note
- `PATCH /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `GET /notes/search?q=query` - Search notes

### Chat
- `POST /chat/stream` - Stream AI chat response
- `POST /chat/complete` - Get complete AI response

### Vectors
- `POST /vectors/semantic-search` - Semantic search

## 🔒 Security

- JWT authentication with Google OAuth
- Database queries filtered by user ID
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)

## ⌨️ Keyboard Shortcuts

| Shortcut       | Action                  |
| -------------- | ----------------------- |
| `Cmd/Ctrl + K` | Open command palette    |
| `Cmd/Ctrl + N` | Create new note         |
| `Cmd/Ctrl + S` | Save current note       |
| `Cmd/Ctrl + J` | Toggle chat panel       |
| `Cmd/Ctrl + ,` | Open settings           |
| `/`            | Quick search            |
| `Esc`          | Close dialogs           |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in `.env`

2. **Google OAuth not working**
   - Check redirect URIs in Google Cloud Console
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

3. **OpenAI API errors**
   - Verify OPENAI_API_KEY is valid
   - Check API usage limits

4. **CORS errors**
   - Ensure CORS_ORIGIN matches frontend URL
   - Check frontend is making requests to correct backend URL

### Getting Help

- Check API documentation at `http://localhost:3001/api/docs`
- Review [NestJS Documentation](https://docs.nestjs.com/)
- Review [Prisma Documentation](https://www.prisma.io/docs)
- Open an issue on GitHub

---

Built with ❤️ using React, NestJS, Prisma, and OpenAI.
