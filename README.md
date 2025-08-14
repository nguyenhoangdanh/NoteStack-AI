# AI Notes - Intelligent Note-Taking App

A production-ready AI-powered note-taking application built with React, Vite, NestJS, and OpenAI. Features real-time synchronization, semantic search, AI chat over your notes using RAG (Retrieval-Augmented Generation), and advanced smart features for productivity.

## ✨ Features

### Core Features
- **Smart Markdown Editor**: Rich text editing with markdown support
- **AI-Powered Search**: Semantic search through your notes using vector embeddings
- **AI Chat**: Ask questions about your notes and get contextual answers
- **Google OAuth**: Secure authentication with Google
- **File Import/Export**: Import .md/.txt files, export to multiple formats
- **Keyboard Shortcuts**: Speed up your workflow with hotkeys
- **Dark Mode**: Beautiful UI with light/dark theme support
- **Responsive Design**: Works perfectly on desktop and mobile

### 🧠 Smart Features
- **Auto-Categorization**: AI automatically categorizes notes based on content
- **Duplicate Detection**: Smart detection of duplicate or similar notes
- **Related Notes**: AI-powered suggestions for related content
- **Auto-Summary**: Generate summaries and key points automatically
- **Smart Tagging**: AI suggests relevant tags for your notes

### 🚀 Productivity Features
- **Pomodoro Timer**: Built-in focus timer integrated with notes
- **Task Management**: Create and track tasks within your notes
- **Calendar Integration**: Link notes to calendar events
- **Review Prompts**: Daily/weekly/monthly review reminders
- **Voice Notes**: Record and transcribe voice memos
- **Location Notes**: Geo-tag notes with location data

### 🔍 Enhanced Search
- **Full-Text Search**: Advanced search with relevance ranking
- **Smart Filters**: Filter by time, tags, workspace, location, and more
- **Search History**: Track and reuse your search queries
- **Saved Searches**: Save frequently used search combinations
- **OCR Search**: Search text within images and attachments

### 📤 Export Options
- **PDF Export**: Custom-styled PDF generation
- **EPUB Support**: Export for e-readers
- **Platform Integration**: Export to Notion, Obsidian formats
- **Cloud Backup**: Automated backup to cloud storage
- **Batch Export**: Export multiple notes or entire workspaces

### 📱 Mobile Features
- **Offline Sync**: Work offline with automatic synchronization
- **Voice Transcription**: Convert speech to text automatically
- **Camera OCR**: Extract text from handwritten notes and documents
- **Location Tracking**: Automatic location tagging
- **Touch Optimized**: Fully responsive mobile interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm
- OpenAI API key
- Google OAuth credentials
- Optional: Google Cloud Vision API (for OCR)
- Optional: Google Speech-to-Text API (for voice transcription)

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

# Google Cloud Services (Optional)
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_KEY_FILE="path/to/service-account.json"

# Voice & OCR Services
SPEECH_TO_TEXT_ENABLED=true
OCR_ENABLED=true

# Export Services
EXPORT_STORAGE_PATH="./exports"
EXPORT_CLEANUP_DAYS=7

# Mobile Features
OFFLINE_SYNC_ENABLED=true
LOCATION_TRACKING_ENABLED=true

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

### Production Environment Variables

Add these additional variables for production:

```bash
# Performance
REDIS_URL="redis://localhost:6379"
ELASTICSEARCH_URL="http://localhost:9200"

# File Storage
STORAGE_PROVIDER="aws" # aws, gcp, azure, local
AWS_S3_BUCKET="ai-notes-storage"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
LOG_LEVEL="info"

# Features
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
MAX_FILE_SIZE=50MB
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
- `GET /notes/:id/related` - Get related notes
- `POST /notes/:id/summarize` - Generate auto-summary

### Smart Features
- `GET /categories` - List categories
- `POST /categories/auto-categorize/:noteId` - Auto-categorize note
- `GET /duplicates` - List duplicate reports
- `POST /duplicates/check` - Check for duplicates
- `GET /notes/:id/suggestions` - Get AI suggestions

### Productivity
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `GET /pomodoro/sessions` - List pomodoro sessions
- `POST /pomodoro/start` - Start pomodoro session
- `GET /calendar/events` - List calendar events
- `POST /calendar/events` - Create calendar event

### Search Enhancement
- `GET /search/history` - Get search history
- `POST /search/save` - Save search query
- `GET /search/suggestions` - Get search suggestions

### Export
- `POST /export/pdf` - Export to PDF
- `POST /export/epub` - Export to EPUB
- `POST /export/notion` - Export to Notion format
- `GET /export/history` - Get export history

### Mobile Features
- `POST /voice/upload` - Upload voice note
- `GET /voice/:id/transcription` - Get transcription
- `POST /ocr/process` - Process image OCR
- `POST /sync/offline` - Sync offline changes

### Chat
- `POST /chat/stream` - Stream AI chat response
- `POST /chat/complete` - Get complete AI response

### Vectors
- `POST /vectors/semantic-search` - Semantic search

## ⌨️ Keyboard Shortcuts

| Shortcut         | Action                    |
| ---------------- | ------------------------- |
| `Cmd/Ctrl + K`   | Open command palette      |
| `Cmd/Ctrl + N`   | Create new note           |
| `Cmd/Ctrl + S`   | Save current note         |
| `Cmd/Ctrl + J`   | Toggle chat panel         |
| `Cmd/Ctrl + T`   | Start pomodoro timer      |
| `Cmd/Ctrl + L`   | Add location to note      |
| `Cmd/Ctrl + R`   | Voice recording           |
| `Cmd/Ctrl + E`   | Export current note       |
| `Cmd/Ctrl + D`   | Check for duplicates      |
| `Cmd/Ctrl + G`   | Auto-categorize note      |
| `Cmd/Ctrl + ,`   | Open settings             |
| `/`              | Quick search              |
| `Esc`            | Close dialogs             |

## 📊 Smart Features Details

### Auto-Categorization
- Uses AI to analyze note content and suggest categories
- Learns from your manual categorizations
- Confidence scoring for automatic suggestions
- Custom category creation and keyword management

### Duplicate Detection
- Content-based similarity detection
- Title matching with fuzzy logic
- Semantic similarity using embeddings
- Merge suggestions and conflict resolution

### Related Notes
- Semantic relationship detection
- Contextual connections
- Temporal relationships (notes created around same time)
- Reference-based linking

### Productivity Integration
- **Pomodoro Timer**: 25-minute focus sessions with break tracking
- **Task Management**: Extract tasks from note content automatically
- **Calendar Sync**: Link notes to meetings and events
- **Review System**: Scheduled prompts for note review and reflection

### Advanced Search
- **Ranking Algorithm**: Results ranked by relevance, recency, and user behavior
- **Filter Combinations**: Complex filtering with AND/OR logic
- **Search Analytics**: Track popular searches and improve suggestions
- **Context-Aware**: Search results influenced by current workspace and recent activity

## 🔒 Security

- JWT authentication with Google OAuth
- Database queries filtered by user ID
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)

## 🔧 Advanced Configuration

### Smart Features Configuration

```javascript
// Smart features settings
const smartConfig = {
  autoCategorizationThreshold: 0.7,
  duplicateDetectionThreshold: 0.8,
  relatedNotesLimit: 5,
  autoSummaryMinWords: 100,
  aiSuggestionsEnabled: true
};
```

### Performance Optimization

- **Caching**: Redis for search results and AI responses
- **Indexing**: Elasticsearch for advanced search capabilities
- **Queue**: Bull queue for background processing
- **CDN**: CloudFront for static assets and exports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commits
- Test mobile responsiveness

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

## 📱 Mobile App Development

The schema supports a companion mobile app with:
- Offline-first architecture
- Voice note recording and transcription
- Camera OCR for document scanning
- Location-based note organization
- Push notifications for reminders

---

Built with ❤️ using React, NestJS, Prisma, OpenAI, and advanced AI technologies.
