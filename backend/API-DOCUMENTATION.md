# AI Notes Backend API Documentation

Comprehensive API documentation for the AI Notes backend system. This document provides detailed information about all available endpoints, request/response formats, and integration guidelines for frontend development.

## 🔗 Base URL
```
Development: http://localhost:3001/api
Production: https://your-api-domain.com/api
```

## 🔐 Authentication

All endpoints (except auth endpoints) require Bearer token authentication.

### Headers
```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

---

## 📚 API Endpoints Overview

### Core Features
- **Authentication**: Register, login, OAuth, token verification
- **Notes**: CRUD operations, search, RAG processing
- **Workspaces**: Workspace management
- **Vectors**: Semantic search functionality
- **Chat**: AI-powered chat with RAG
- **Settings**: User preferences and usage tracking

### Smart Features
- **Categories**: Auto-categorization, suggestions, assignments
- **Duplicates**: Detection, reporting, merging
- **Relations**: Related notes discovery
- **Summaries**: Auto-summary generation

### Future Features (Schema Ready)
- **Tasks**: Task management within notes
- **Pomodoro**: Focus timer integration
- **Calendar**: Event linking
- **Voice**: Speech-to-text transcription
- **Export**: Multi-format export system

---

## 🔑 Authentication Endpoints

### POST /auth/register
Register a new user with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm4abc123def",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null
  }
}
```

**Errors:**
- `400` - Validation error (invalid email, weak password)
- `409` - User already exists

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):** Same as register response.

**Errors:**
- `401` - Invalid credentials
- `400` - Missing required fields

### GET /auth/google
Initiate Google OAuth flow.

**Response:** Redirects to Google OAuth consent screen.

### GET /auth/google/callback
Handle Google OAuth callback (internal use).

**Response:** Redirects to frontend with token parameter.

### GET /auth/verify
Verify JWT token validity.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "cm4abc123def",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://lh3.googleusercontent.com/..."
  }
}
```

**Errors:**
- `401` - Invalid or expired token

### GET /auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Same user object as verify endpoint.

---

## 📝 Notes Management

### GET /notes
Get list of user notes with optional filtering.

**Query Parameters:**
- `workspaceId` (string, optional) - Filter by workspace ID
- `limit` (number, optional) - Limit results

**Response (200):**
```json
[
  {
    "id": "cm4note123",
    "title": "My Important Note",
    "content": "# Heading\n\nNote content in **markdown** format...",
    "tags": ["work", "important"],
    "workspaceId": "cm4workspace123",
    "ownerId": "cm4user123",
    "isDeleted": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z",
    "workspace": {
      "id": "cm4workspace123",
      "name": "My Workspace"
    }
  }
]
```

### POST /notes
Create a new note.

**Request:**
```json
{
  "title": "New Note Title",
  "content": "# Note Content\n\nMarkdown formatted content here...",
  "tags": ["tag1", "tag2"],
  "workspaceId": "cm4workspace123"
}
```

**Response (201):** Created note object (same structure as GET).

**Errors:**
- `404` - Workspace not found
- `400` - Validation error

### GET /notes/:id
Get a specific note by ID.

**Parameters:**
- `id` (string) - Note ID

**Response (200):** Single note object.

**Errors:**
- `404` - Note not found

### PATCH /notes/:id
Update an existing note.

**Parameters:**
- `id` (string) - Note ID

**Request:** (All fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["new", "tags"]
}
```

**Response (200):** Updated note object.

**Errors:**
- `404` - Note not found
- `400` - Validation error

### DELETE /notes/:id
Soft delete a note.

**Parameters:**
- `id` (string) - Note ID

**Response (204):** No content.

**Errors:**
- `404` - Note not found

### GET /notes/search
Search notes by query string.

**Query Parameters:**
- `q` (string, required) - Search query
- `limit` (number, optional, default: 10) - Results limit (1-100)

**Response (200):** Array of matching notes (same structure as GET /notes).

**Example:**
```
GET /notes/search?q=react&limit=5
```

### POST /notes/:id/process-rag
Process note for RAG (vector embeddings).

**Parameters:**
- `id` (string) - Note ID

**Response (202):**
```json
{
  "message": "Processing started"
}
```

**Note:** This endpoint starts background processing. The note will be available for AI chat once processing completes.

---

## 🏢 Workspaces

### GET /workspaces
List user workspaces.

**Response (200):**
```json
[
  {
    "id": "cm4workspace123",
    "name": "My Workspace",
    "ownerId": "cm4user123",
    "isDefault": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /workspaces/default
Get user's default workspace.

**Response (200):** Single workspace object or `null`.

### POST /workspaces
Create a new workspace.

**Request:**
```json
{
  "name": "New Workspace"
}
```

**Response (201):** Created workspace object.

---

## 🔍 Vector Search

### POST /vectors/semantic-search
Perform semantic search across user's notes.

**Request:**
```json
{
  "query": "machine learning concepts",
  "limit": 5
}
```

**Response (200):**
```json
[
  {
    "id": "cm4vector123",
    "noteId": "cm4note123",
    "chunkId": "cm4note123_chunk_1",
    "chunkContent": "Machine learning is a subset of artificial intelligence...",
    "chunkIndex": 1,
    "heading": "Introduction to ML",
    "embedding": [0.1, 0.2, ...], // Vector array or empty
    "ownerId": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "noteTitle": "AI Research Notes",
    "similarity": 0.87
  }
]
```

---

## 💬 AI Chat

### POST /chat/stream
Stream AI response for real-time chat experience.

**Request:**
```json
{
  "query": "What did I write about machine learning?",
  "model": "gemini-1.5-flash",
  "maxTokens": 4000
}
```

**Response:** 
- **Content-Type:** `text/plain; charset=utf-8`
- **Headers:** `X-Citations: [{"title":"Note Title","heading":"Section"}]`
- **Body:** Streaming text response

**Usage Example (JavaScript):**
```javascript
const response = await fetch('/api/chat/stream', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: 'What are my notes about AI?' })
});

const citations = JSON.parse(response.headers.get('X-Citations') || '[]');
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log(chunk); // Display streaming text
}
```

### POST /chat/complete
Get complete AI response (non-streaming).

**Request:**
```json
{
  "query": "Summarize my machine learning notes",
  "model": "gemini-1.5-flash",
  "maxTokens": 4000
}
```

**Response (200):**
```json
{
  "response": "Based on your notes, machine learning is...",
  "citations": [
    {
      "title": "ML Fundamentals",
      "heading": "Introduction"
    },
    {
      "title": "Neural Networks",
      "heading": "Deep Learning Basics"
    }
  ]
}
```

### POST /chat/suggest
Generate AI suggestions for content improvement.

**Request:**
```json
{
  "content": "Your note content here...",
  "selectedText": "specific text to improve",
  "suggestionType": "improve",
  "targetLanguage": "English"
}
```

**Suggestion Types:**
- `improve` - Enhance writing style and clarity
- `expand` - Add more detail and examples
- `summarize` - Create concise summary
- `restructure` - Reorganize for better flow
- `examples` - Add practical examples
- `grammar` - Fix grammar and spelling
- `translate` - Translate to target language

**Response (200):**
```json
{
  "originalText": "Text that was processed...",
  "suggestion": "Improved version of the text...",
  "type": "improve",
  "hasSelection": true
}
```

### POST /chat/apply-suggestion
Apply AI suggestion to note content.

**Request:**
```json
{
  "noteId": "cm4note123",
  "originalContent": "Full note content...",
  "suggestion": "AI generated suggestion...",
  "selectedText": "text to replace",
  "applyType": "replace",
  "position": 150
}
```

**Apply Types:**
- `replace` - Replace selected text or entire content
- `append` - Add to end of note
- `insert` - Insert at specific position

**Response (200):**
```json
{
  "newContent": "Content with suggestion applied...",
  "applied": true,
  "type": "replace"
}
```

---

## 🧠 Smart Categories

### GET /categories
List user categories.

**Query Parameters:**
- `includeAuto` (boolean, optional, default: true) - Include auto-generated categories

**Response (200):**
```json
[
  {
    "id": "cm4cat123",
    "name": "Technology",
    "description": "Tech-related notes and research",
    "color": "#3B82F6",
    "icon": "💻",
    "keywords": ["tech", "programming", "software", "ai"],
    "isAuto": false,
    "confidence": null,
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-10T09:00:00.000Z",
    "noteCategories": [
      {
        "note": {
          "id": "cm4note123",
          "title": "React Development Guide"
        }
      }
    ],
    "_count": {
      "noteCategories": 12
    }
  }
]
```

### POST /categories
Create a new category.

**Request:**
```json
{
  "name": "Personal Development",
  "description": "Self-improvement and learning notes",
  "color": "#10B981",
  "icon": "📚",
  "keywords": ["learning", "growth", "skills", "development"],
  "isAuto": false
}
```

**Response (201):** Created category object.

**Errors:**
- `400` - Validation error
- `409` - Category name already exists

### GET /categories/:id
Get category by ID with associated notes.

**Response (200):** Single category object with expanded note details.

### PATCH /categories/:id
Update category properties.

**Request:** (All fields optional)
```json
{
  "name": "Updated Category Name",
  "description": "Updated description",
  "color": "#EF4444",
  "keywords": ["new", "keywords"]
}
```

**Response (200):** Updated category object.

### DELETE /categories/:id
Delete category and remove all note assignments.

**Response (204):** No content.

**Note:** This will unassign the category from all notes but won't delete the notes themselves.

### POST /categories/suggest
Get AI-powered category suggestions for content.

**Request:**
```json
{
  "content": "This note discusses React components, state management, and hooks. It covers useEffect, useState, and custom hooks for building modern web applications..."
}
```

**Response (200):**
```json
[
  {
    "name": "Web Development",
    "confidence": 0.92,
    "matchingKeywords": ["react", "components", "hooks"],
    "exists": true,
    "existingCategoryId": "cm4cat456"
  },
  {
    "name": "Frontend Frameworks",
    "confidence": 0.78,
    "matchingKeywords": ["react", "web applications"],
    "exists": false
  },
  {
    "name": "JavaScript",
    "confidence": 0.85,
    "matchingKeywords": ["hooks", "useEffect", "useState"],
    "exists": true,
    "existingCategoryId": "cm4cat789"
  }
]
```

### POST /categories/auto-categorize/:noteId
Auto-categorize a specific note using AI.

**Parameters:**
- `noteId` (string) - Note ID to categorize

**Request:**
```json
{
  "threshold": 0.7
}
```

**Response (200):**
```json
[
  {
    "name": "Technology",
    "confidence": 0.85,
    "matchingKeywords": ["programming", "software"],
    "exists": true,
    "existingCategoryId": "cm4cat123",
    "assigned": true
  },
  {
    "name": "Web Development",
    "confidence": 0.78,
    "matchingKeywords": ["react", "frontend"],
    "exists": false,
    "assigned": false,
    "reason": "Confidence below threshold"
  }
]
```

### GET /categories/notes/:noteId
Get categories assigned to a specific note.

**Response (200):**
```json
[
  {
    "noteId": "cm4note123",
    "categoryId": "cm4cat123",
    "confidence": 0.85,
    "isAuto": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "category": {
      "id": "cm4cat123",
      "name": "Technology",
      "color": "#3B82F6",
      "icon": "💻"
    }
  }
]
```

### POST /categories/notes/:noteId/assign/:categoryId
Manually assign a category to a note.

**Parameters:**
- `noteId` (string) - Note ID
- `categoryId` (string) - Category ID

**Response (201):**
```json
{
  "noteId": "cm4note123",
  "categoryId": "cm4cat123",
  "confidence": null,
  "isAuto": false,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "category": {
    "id": "cm4cat123",
    "name": "Technology",
    "color": "#3B82F6"
  }
}
```

**Errors:**
- `404` - Note or category not found
- `409` - Category already assigned

### DELETE /categories/notes/:noteId/assign/:categoryId
Remove category assignment from a note.

**Response (204):** No content.

---

## 🔍 Duplicate Detection

### GET /duplicates/detect
Detect duplicate notes for the user.

**Query Parameters:**
- `noteId` (string, optional) - Check specific note for duplicates
- `threshold` (number, optional, default: 0.7) - Similarity threshold (0-1)

**Response (200):**
```json
[
  {
    "originalNoteId": "cm4note123",
    "duplicateNoteId": "cm4note456",
    "similarity": 0.87,
    "type": "CONTENT",
    "suggestedAction": "MERGE"
  },
  {
    "originalNoteId": "cm4note789",
    "duplicateNoteId": "cm4note012",
    "similarity": 0.72,
    "type": "TITLE",
    "suggestedAction": "REVIEW"
  }
]
```

**Detection Types:**
- `CONTENT` - Similar content detected
- `TITLE` - Similar titles
- `SEMANTIC` - Semantically similar using AI

**Suggested Actions:**
- `MERGE` - High similarity (>0.9), recommend merging
- `REVIEW` - Medium similarity (0.7-0.9), needs user review
- `KEEP_SEPARATE` - Low similarity, likely different content

### GET /duplicates/reports
Get existing duplicate reports.

**Query Parameters:**
- `status` (string, optional) - Filter by status: `PENDING`, `CONFIRMED`, `DISMISSED`, `MERGED`

**Response (200):**
```json
[
  {
    "id": "cm4dup123",
    "originalNoteId": "cm4note123",
    "duplicateNoteId": "cm4note456",
    "similarity": 0.87,
    "type": "CONTENT",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "resolvedAt": null,
    "originalNote": {
      "id": "cm4note123",
      "title": "React Hooks Guide",
      "content": "Hooks are functions that let you..."
    },
    "duplicateNote": {
      "id": "cm4note456",
      "title": "React Hooks Tutorial",
      "content": "React hooks allow you to..."
    }
  }
]
```

### POST /duplicates/reports
Create a manual duplicate report.

**Request:**
```json
{
  "originalNoteId": "cm4note123",
  "duplicateNoteId": "cm4note456",
  "similarity": 0.85,
  "type": "CONTENT"
}
```

**Response (201):** Created report object.

### PATCH /duplicates/reports/:id
Update duplicate report status.

**Request:**
```json
{
  "status": "CONFIRMED"
}
```

**Status Values:**
- `CONFIRMED` - User confirmed they are duplicates
- `DISMISSED` - User dismissed as not duplicates
- `MERGED` - Notes have been merged

**Response (200):** Updated report object.

### POST /duplicates/merge
Merge two duplicate notes.

**Request:**
```json
{
  "originalNoteId": "cm4note123",
  "duplicateNoteId": "cm4note456"
}
```

**Response (200):**
```json
{
  "mergedNote": {
    "id": "cm4note123",
    "title": "React Hooks Guide",
    "content": "Original content...\n\n---\n\nMerged content from duplicate...",
    "tags": ["react", "hooks", "tutorial", "guide"],
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "deletedNoteId": "cm4note456"
}
```

**Note:** The duplicate note is soft-deleted, and its content is appended to the original note.

### POST /duplicates/queue-detection
Queue background duplicate detection job.

**Request:**
```json
{
  "noteId": "cm4note123"
}
```

**Response (202):**
```json
{
  "message": "Duplicate detection queued"
}
```

---

## 🔗 Related Notes

### GET /relations/notes/:noteId/related
Find notes related to a specific note using AI.

**Parameters:**
- `noteId` (string) - Source note ID

**Query Parameters:**
- `limit` (number, optional, default: 5) - Maximum related notes to return

**Response (200):**
```json
[
  {
    "noteId": "cm4note456",
    "title": "Advanced React Patterns",
    "relevance": 0.89,
    "type": "SEMANTIC",
    "excerpt": "Higher-order components and render props are advanced patterns in React that allow for code reuse...",
    "reasons": ["Semantic similarity in content", "Shared topic: React development"]
  },
  {
    "noteId": "cm4note789",
    "title": "State Management with Redux",
    "relevance": 0.76,
    "type": "CONTEXTUAL",
    "excerpt": "Redux provides predictable state management for React applications...",
    "reasons": ["Shared tags: react, state", "Same workspace"]
  },
  {
    "noteId": "cm4note012",
    "title": "JavaScript ES6 Features",
    "relevance": 0.68,
    "type": "TEMPORAL",
    "excerpt": "Arrow functions, destructuring, and template literals are essential ES6 features...",
    "reasons": ["Created around same time (2 days apart)"]
  }
]
```

**Relation Types:**
- `SEMANTIC` - Similar meaning/content using AI
- `CONTEXTUAL` - Shared tags, workspace, or keywords
- `TEMPORAL` - Created around same time
- `REFERENCE` - One note references content from another

### GET /relations/notes/:noteId/stored
Get previously stored relations for a note.

**Response (200):** Same structure as related notes but from database.

### POST /relations/notes/:noteId/save-relation
Manually save a relation between notes.

**Request:**
```json
{
  "targetNoteId": "cm4note456",
  "relevance": 0.85,
  "type": "CONTEXTUAL"
}
```

**Response (201):** Created relation object.

### POST /relations/notes/:noteId/analyze
Queue background relation analysis for a note.

**Response (202):**
```json
{
  "message": "Relation analysis queued"
}
```

---

## 📋 Auto-Summary

### GET /summaries/notes/:noteId
Get existing summary for a note.

**Response (200):**
```json
{
  "id": "cm4sum123",
  "noteId": "cm4note123",
  "summary": "This comprehensive guide covers React Hooks, including useState for state management, useEffect for side effects, and custom hooks for reusable logic. It provides practical examples and best practices for modern React development.",
  "keyPoints": [
    "useState manages component state in functional components",
    "useEffect handles side effects and lifecycle methods",
    "Custom hooks enable logic reuse across components",
    "Rules of hooks must be followed for proper functionality"
  ],
  "wordCount": 1250,
  "readingTime": 6,
  "model": "gemini-1.5-flash",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "isStale": false
}
```

**Response (404):** If no summary exists for the note.

### POST /summaries/notes/:noteId/generate
Generate a new summary for a note.

**Request:** (All fields optional)
```json
{
  "minWords": 100,
  "maxSummaryLength": 300,
  "includeKeyPoints": true
}
```

**Response (200):** Generated summary object (same structure as GET).

**Errors:**
- `400` - Note too short (less than minWords)
- `404` - Note not found

### DELETE /summaries/notes/:noteId
Delete existing summary for a note.

**Response (204):** No content.

### POST /summaries/batch
Generate summaries for multiple notes.

**Request:**
```json
{
  "noteIds": ["cm4note123", "cm4note456", "cm4note789"]
}
```

**Response (200):**
```json
{
  "total": 3,
  "successful": 2,
  "failed": 1,
  "results": [
    {
      "noteId": "cm4note123",
      "success": true,
      "summary": {
        "id": "cm4sum123",
        "summary": "Generated summary...",
        "keyPoints": ["Point 1", "Point 2"]
      }
    },
    {
      "noteId": "cm4note456",
      "success": true,
      "summary": {
        "id": "cm4sum456",
        "summary": "Another summary...",
        "keyPoints": ["Point A", "Point B"]
      }
    },
    {
      "noteId": "cm4note789",
      "success": false,
      "error": "Note too short for summary generation"
    }
  ]
}
```

### POST /summaries/notes/:noteId/queue
Queue summary generation as background job.

**Response (202):**
```json
{
  "message": "Summary generation queued"
}
```

---

## ⚙️ Settings

### GET /settings
Get user settings and preferences.

**Response (200):**
```json
{
  "id": "cm4set123",
  "ownerId": "cm4user123",
  "model": "gemini-1.5-flash",
  "maxTokens": 4000,
  "autoReembed": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Available Models:**
- `gemini-1.5-flash` (Free, Google AI)
- `llama3-8b-8192` (Free, Groq)
- `gpt-3.5-turbo` (Paid, OpenAI)
- `gpt-4` (Paid, OpenAI)

### PATCH /settings
Update user settings.

**Request:** (All fields optional)
```json
{
  "model": "gpt-4",
  "maxTokens": 8000,
  "autoReembed": false
}
```

**Response (200):** Updated settings object.

### GET /settings/usage
Get usage statistics for API calls.

**Query Parameters:**
- `days` (number, optional, default: 30) - Number of days to retrieve

**Response (200):**
```json
[
  {
    "id": "cm4usage123",
    "ownerId": "cm4user123",
    "date": "2024-01-15",
    "embeddingTokens": 1250,
    "chatTokens": 3500,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T18:45:00.000Z"
  },
  {
    "id": "cm4usage124",
    "ownerId": "cm4user123",
    "date": "2024-01-14",
    "embeddingTokens": 800,
    "chatTokens": 2200,
    "createdAt": "2024-01-14T09:15:00.000Z",
    "updatedAt": "2024-01-14T16:30:00.000Z"
  }
]
```

---

## 👤 User Management

### GET /users/me
Get current user profile (same as `/auth/me`).

**Response (200):**
```json
{
  "id": "cm4user123",
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://lh3.googleusercontent.com/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-10T15:30:00.000Z"
}
```

### PATCH /users/me
Update user profile.

**Request:**
```json
{
  "name": "Updated Name",
  "image": "https://new-avatar-url.com/avatar.jpg"
}
```

**Response (200):** Updated user object.

---

## 🔧 Error Responses

### Standard Error Format
```json
{
  "message": "Detailed error message",
  "error": "Error Type",
  "statusCode": 400
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `202` - Accepted (async operation started)
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Validation Errors
```json
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 🚀 Frontend Integration Examples

### React Hook for API Calls
```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null
  });

  const call = useCallback(async (
    endpoint: string, 
    options?: RequestInit
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
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
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
      throw error;
    }
  }, []);

  return { ...state, call };
}
```

### Notes Service Example
```typescript
// services/notesService.ts
class NotesService {
  private baseUrl = '/api/notes';

  async getNotes(workspaceId?: string, limit?: number) {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspaceId', workspaceId);
    if (limit) params.append('limit', limit.toString());
    
    const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });
    
    return response.json();
  }

  async createNote(note: CreateNoteDto) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    });
    
    return response.json();
  }

  async searchNotes(query: string, limit = 10) {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    const response = await fetch(`${this.baseUrl}/search?${params}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });
    
    return response.json();
  }

  private getToken() {
    return localStorage.getItem('auth_token');
  }
}

export const notesService = new NotesService();
```

### Streaming Chat Component
```typescript
// components/ChatStream.tsx
import { useState, useRef } from 'react';

export function ChatStream() {
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (query: string) => {
    setLoading(true);
    setCurrentResponse('');
    
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      const citations = JSON.parse(response.headers.get('X-Citations') || '[]');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          setCurrentResponse(prev => prev + chunk);
        }
      }

      // Add complete message to history
      setMessages(prev => [...prev, {
        query,
        response: currentResponse,
        citations,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat UI implementation */}
    </div>
  );
}
```

---

## 📊 Rate Limits

### Current Limits
- **General API**: 100 requests per minute per user
- **AI Endpoints**: Subject to provider limits
- **File Upload**: 10MB max file size
- **Batch Operations**: 100 items max per request

### Headers for Rate Limiting
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642876800
```

---

## 🔒 Security Best Practices

### Token Handling
- Store JWT tokens securely (httpOnly cookies preferred)
- Implement token refresh logic
- Clear tokens on logout

### API Security
- Always validate user permissions
- Use HTTPS in production
- Implement CSRF protection
- Validate all input data

### Error Handling
- Don't expose sensitive information in errors
- Log errors for monitoring
- Provide user-friendly error messages

---

## 🧪 Testing

### Test User Account
```
Email: test@example.com
Password: testPassword123
```

### Example API Test
```bash
# Get auth token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testPassword123"}'

# Use token for authenticated request
curl -X GET http://localhost:3001/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📈 Performance Considerations

### Caching
- API responses cached for 5 minutes
- Vector embeddings cached until note updates
- User settings cached for 1 hour

### Pagination
- Large datasets automatically paginated
- Use `limit` and `offset` parameters where available
- Default page size: 20 items

### Optimization Tips
- Use specific field selections when possible
- Implement client-side caching
- Batch multiple operations when available
- Use streaming for real-time features

---

This comprehensive documentation covers all implemented endpoints and provides examples for seamless frontend integration. For questions or clarification, refer to the Swagger documentation at `/api/docs` or consult the source code.
