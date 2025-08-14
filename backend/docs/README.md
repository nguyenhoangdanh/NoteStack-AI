# AI Notes Backend API Documentation

Comprehensive API documentation for the AI Notes backend system, organized by development phases and features.

## 🏗️ Architecture Overview

### Tech Stack
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL with vector support
- **AI Services**: OpenAI GPT, Google Gemini, Groq (multiple providers)
- **Queue**: BullMQ for background processing
- **Storage**: Cloudflare R2 + Local fallback

### Base URL
```
Development: http://localhost:3001/api
Production: https://your-api-domain.com/api
```

## 📚 Documentation Structure

### Phase 1: Core Foundation
- **[Authentication](./phase1/01-authentication.md)** - Registration, login, OAuth, JWT
- **[Users](./phase1/02-users.md)** - User management and profiles
- **[Workspaces](./phase1/03-workspaces.md)** - Workspace CRUD operations
- **[Notes](./phase1/04-notes.md)** - Core note management
- **[Vectors](./phase1/05-vectors.md)** - Semantic search and embeddings
- **[Chat](./phase1/06-chat.md)** - AI chat with RAG
- **[Settings](./phase1/07-settings.md)** - User preferences and usage

### Phase 2A: Smart Features
- **[Categories](./phase2a/01-categories.md)** - Auto-categorization system
- **[Duplicates](./phase2a/02-duplicates.md)** - Duplicate detection and merging
- **[Relations](./phase2a/03-relations.md)** - Related notes discovery
- **[Summaries](./phase2a/04-summaries.md)** - Auto-summary generation
- **[Search](./phase2a/05-search.md)** - Enhanced search capabilities

### Phase 2B: Collaboration & Sharing
- **[Collaboration](./phase2b/01-collaboration.md)** - Real-time collaboration
- **[Sharing](./phase2b/02-sharing.md)** - Public sharing and permissions
- **[Versions](./phase2b/03-versions.md)** - Version control system
- **[Activities](./phase2b/04-activities.md)** - User activity tracking
- **[Tags](./phase2b/05-tags.md)** - Advanced tagging system
- **[Templates](./phase2b/06-templates.md)** - Note templates
- **[Attachments](./phase2b/07-attachments.md)** - File upload system

### Phase 3: Productivity & Mobile (Future)
- **Tasks** - Task management integration
- **Pomodoro** - Focus timer system
- **Calendar** - Calendar integration
- **Voice** - Speech-to-text features
- **Mobile** - Mobile-specific APIs
- **Export** - Advanced export options

## 🔐 Global Authentication

All endpoints require Bearer token authentication unless specified otherwise.

### Request Headers
```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

### Error Response Format
```json
{
  "message": "Error description",
  "error": "Error Type",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/endpoint"
}
```

## 🎯 Quick Start Guide

### 1. Authentication Flow
```javascript
// 1. Login and get token
const auth = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { access_token } = await auth.json();

// 2. Use token for subsequent requests
const headers = {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
};
```

### 2. Basic Note Operations
```javascript
// Create note
const note = await fetch('/api/notes', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    title: "My Note",
    content: "Note content",
    tags: ["tag1"],
    workspaceId: "workspace_id"
  })
});

// Search notes
const results = await fetch('/api/notes/search?q=query&limit=10', {
  headers
});

// AI Chat
const response = await fetch('/api/chat/stream', {
  method: 'POST',
  headers,
  body: JSON.stringify({ query: "What are my notes about?" })
});
```

## 📊 Response Standards

### Success Responses
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### List Responses
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "count": 25,
  "total": 100,
  "page": 1,
  "limit": 25
}
```

### Error Responses
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* additional error info */ }
}
```

## 🔧 Common Query Parameters

### Pagination
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `offset` (number) - Alternative to page-based pagination

### Filtering
- `search` (string) - Text search across relevant fields
- `tags` (string[]) - Filter by tags (comma-separated)
- `category` (string) - Filter by category
- `workspace` (string) - Filter by workspace ID
- `dateFrom` (ISO string) - Filter from date
- `dateTo` (ISO string) - Filter to date

### Sorting
- `sortBy` (string) - Field to sort by
- `sortOrder` (asc|desc, default: desc) - Sort direction

## 🚨 Rate Limiting

### Limits
- **General API**: 100 requests/minute per user
- **AI Endpoints**: 20 requests/minute per user
- **File Upload**: 5 uploads/minute per user
- **Search**: 30 requests/minute per user

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642876800
Retry-After: 60
```

## 🔍 Testing & Development

### Swagger Documentation
Interactive API documentation available at:
- Development: `http://localhost:3001/api/docs`
- Production: `https://your-api.domain.com/api/docs`

### Test Account
```
Email: test@example.com
Password: testPassword123
```

### Development Commands
```bash
# Start backend
cd backend
npm run start:dev

# Generate Prisma client
npm run prisma:generate

# Database migrations
npm run prisma:migrate

# View database
npm run prisma:studio
```

## 📱 Frontend Integration

### React Hook Example
```typescript
// hooks/useApi.ts
export function useApiCall<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API Error');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { call, loading, error };
}
```

## 🔐 Security Guidelines

### Token Management
- Store JWT tokens securely (httpOnly cookies preferred)
- Implement token refresh logic
- Clear tokens on logout/session end

### Request Security
- Always validate user input
- Use HTTPS in production
- Implement CSRF protection for state-changing operations
- Sanitize user content before storage

## 📈 Performance Tips

### Caching Strategy
- API responses: 5 minutes default
- Vector embeddings: Until note updates
- User settings: 1 hour
- Search results: 2 minutes

### Optimization
- Use pagination for large datasets
- Implement client-side caching
- Batch operations when possible
- Use streaming for real-time features

## 🐛 Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check token validity and format
2. **404 Not Found**: Verify endpoint URL and resource ID
3. **429 Rate Limited**: Implement retry logic with exponential backoff
4. **500 Internal Error**: Check server logs and API status

### Debug Headers
Add these headers for debugging:
```javascript
{
  "X-Debug": "true",
  "X-Request-ID": "unique-request-id"
}
```

---

**Last Updated**: 2024-01-15  
**API Version**: 1.0  
**Contact**: api-support@ai-notes.com
