# Auto-Summary Generation API

AI-powered automatic summary generation with multiple models, templates, and batch processing capabilities.

## 📋 Overview

The auto-summary system generates intelligent summaries of notes using various AI models (OpenAI, Gemini, Groq). It supports different summary templates, batch processing, and maintains summary history with automatic updates when notes are modified.

### Features
- ✅ Multi-model AI summary generation (OpenAI, Gemini, Groq)
- ✅ Template-based summaries (Executive, Academic, Meeting, Research, Project)
- ✅ Intelligent key points extraction
- ✅ Batch processing for multiple notes
- ✅ Background processing with queue system
- ✅ Automatic stale summary detection and updates
- ✅ Summary statistics and analytics
- ✅ Configurable word count thresholds
- ✅ Model migration and regeneration

## 🔐 Endpoints

### GET /summaries/notes/:noteId

Get existing summary for a specific note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID to get summary for

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "summary": {
    "id": "cm4sum123",
    "noteId": "cm4note123",
    "summary": "This comprehensive guide covers React hooks, focusing on useState and useEffect. The content explains how hooks revolutionize state management in functional components, providing practical examples and best practices for implementation.",
    "keyPoints": [
      "React hooks enable state in functional components",
      "useState manages local component state",
      "useEffect handles side effects and lifecycle",
      "Custom hooks promote code reusability",
      "Proper dependency arrays prevent infinite loops"
    ],
    "wordCount": 1250,
    "readingTime": 7,
    "model": "gemini-1.5-flash",
    "ownerId": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "isStale": false
  },
  "message": "Summary retrieved successfully"
}
```

**Response Fields:**
- `readingTime`: Estimated reading time in minutes (based on 200 words/minute)
- `isStale`: Boolean indicating if summary is outdated (note updated after summary)
- `wordCount`: Word count of original note content

**Not Found Response (200):**
```json
{
  "success": false,
  "noteId": "cm4note123",
  "summary": null,
  "message": "No summary found for this note"
}
```

---

### POST /summaries/notes/:noteId/generate

Generate AI summary for a specific note.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `noteId` (string) - Note ID to generate summary for

**Request Body:**
```json
{
  "minWords": 100,
  "maxSummaryLength": 300,
  "includeKeyPoints": true,
  "model": "gemini-1.5-flash"
}
```

**Request Fields:**
- `minWords`: Minimum words required in note (50-500, default: 100)
- `maxSummaryLength`: Maximum summary length (100-1000, default: 300)
- `includeKeyPoints`: Include key points extraction (default: true)
- `model`: Override default AI model (optional)

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "summary": {
    "summary": "This comprehensive guide covers React hooks, focusing on useState and useEffect...",
    "keyPoints": [
      "React hooks enable state in functional components",
      "useState manages local component state",
      "useEffect handles side effects and lifecycle"
    ],
    "wordCount": 1250,
    "readingTime": 7,
    "model": "gemini-1.5-flash"
  },
  "message": "Summary generated successfully"
}
```

**Error Responses:**
```json
// 400 - Note too short
{
  "success": false,
  "noteId": "cm4note123",
  "message": "Failed to generate summary",
  "error": "Note too short for summary. Minimum 100 words required."
}

// 404 - Note not found
{
  "success": false,
  "noteId": "invalid_id",
  "message": "Failed to generate summary",
  "error": "Note not found"
}
```

---

### DELETE /summaries/notes/:noteId

Delete summary for a specific note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Success Response (204):**
No content returned.

---

### POST /summaries/batch

Generate summaries for multiple notes.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "noteIds": ["cm4note123", "cm4note456", "cm4note789"],
  "minWords": 100,
  "skipExisting": false
}
```

**Request Fields:**
- `noteIds`: Array of note IDs (max 50 per request)
- `minWords`: Minimum words required (default: 100)
- `skipExisting`: Skip notes that already have summaries (default: false)

**Success Response (200):**
```json
{
  "success": true,
  "total": 3,
  "successful": 2,
  "failed": 1,
  "results": [
    {
      "noteId": "cm4note123",
      "success": true,
      "summary": {
        "wordCount": 1250,
        "model": "gemini-1.5-flash"
      }
    },
    {
      "noteId": "cm4note456",
      "success": true,
      "skipped": true,
      "reason": "Summary already exists"
    },
    {
      "noteId": "cm4note789",
      "success": false,
      "error": "Note too short for summary generation"
    }
  ],
  "message": "Batch processing completed. 2/3 summaries generated."
}
```

---

### POST /summaries/notes/:noteId/queue

Queue summary generation for background processing.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `noteId` (string) - Note ID

**Request Body (Optional):**
```json
{
  "minWords": 100,
  "maxSummaryLength": 300,
  "includeKeyPoints": true,
  "model": "gemini-1.5-flash"
}
```

**Success Response (202):**
```json
{
  "success": true,
  "jobId": "job_cm4sum123",
  "noteId": "cm4note123",
  "userId": "cm4user123",
  "message": "Summary generation queued successfully"
}
```

---

### GET /summaries/user/stats

Get summary statistics for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalSummaries": 45,
    "recentSummaries": 8,
    "averageWordCount": 1150,
    "summariesByModel": {
      "gemini-1.5-flash": 25,
      "gpt-3.5-turbo": 12,
      "llama3-8b-8192": 8
    }
  }
}
```

**Response Fields:**
- `recentSummaries`: Summaries created in the last 7 days
- `averageWordCount`: Average word count of summarized notes
- `summariesByModel`: Distribution of summaries by AI model used

---

### GET /summaries/templates

Get available summary templates.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "templates": [
    {
      "id": "executive",
      "name": "Executive Summary",
      "description": "Brief, high-level overview focusing on key decisions and outcomes",
      "prompt": "Create a brief executive summary highlighting key decisions, outcomes, and action items."
    },
    {
      "id": "academic",
      "name": "Academic Summary",
      "description": "Structured summary with main arguments, evidence, and conclusions",
      "prompt": "Provide an academic-style summary with main arguments, supporting evidence, and conclusions."
    },
    {
      "id": "meeting",
      "name": "Meeting Summary", 
      "description": "Focus on decisions made, action items, and next steps",
      "prompt": "Summarize this meeting content focusing on decisions made, action items, and next steps."
    },
    {
      "id": "research",
      "name": "Research Summary",
      "description": "Methodology, findings, and implications for research notes",
      "prompt": "Create a research summary covering methodology, key findings, and implications."
    },
    {
      "id": "project",
      "name": "Project Summary",
      "description": "Project status, milestones, risks, and next phases",
      "prompt": "Summarize project status, completed milestones, identified risks, and upcoming phases."
    }
  ]
}
```

---

### POST /summaries/notes/:noteId/template/:templateId

Generate summary using a specific template.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID
- `templateId` (string) - Template ID (`executive`, `academic`, `meeting`, `research`, `project`)

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "templateId": "meeting",
  "summary": {
    "summary": "Meeting Summary: Discussed React implementation strategy. Key decisions: adopt hooks-based architecture, implement state management with Context API. Action items: create component library by next sprint, conduct training sessions for team members.",
    "keyPoints": [
      "Decision: Adopt hooks-based architecture",
      "Decision: Use Context API for state management",
      "Action: Create component library by next sprint",
      "Action: Conduct team training sessions"
    ],
    "wordCount": 1250,
    "readingTime": 7,
    "model": "gemini-1.5-flash"
  },
  "message": "Template-based summary generated successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid template ID"
}
```

---

### GET /summaries/notes/:noteId/versions

Get summary version history for a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Query Parameters:**
- `limit` (number, optional, default: 10) - Number of versions to retrieve

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "versions": [
    {
      "id": "cm4sum123",
      "version": 1,
      "summary": "This comprehensive guide covers React hooks...",
      "keyPoints": [
        "React hooks enable state in functional components",
        "useState manages local component state"
      ],
      "wordCount": 1250,
      "model": "gemini-1.5-flash",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "isCurrent": true
    }
  ],
  "count": 1
}
```

## 🔧 AI Model Configuration

### Supported Models

1. **Google Gemini**
   - Model: `gemini-1.5-flash`
   - Best for: General purpose, fast generation
   - Configuration: Temperature 0.3, Max tokens 1000

2. **Groq (Llama)**
   - Model: `llama3-8b-8192`
   - Best for: Open-source alternative, good quality
   - Configuration: Temperature 0.3, Max tokens 1000

3. **OpenAI**
   - Model: `gpt-3.5-turbo`
   - Best for: Consistent quality, structured output
   - Configuration: Temperature 0.3, Max tokens 1000

### Model Selection Priority
1. User-specified model (if provided)
2. Gemini (if API key available)
3. Groq (if API key available)
4. OpenAI (if API key available)
5. Fallback to extractive summary

## 🚀 Background Processing

### Queue System
- **Queue Name**: `auto-summary`
- **Default Options**: 2 attempts, exponential backoff
- **Job Types**:
  - `generate-summary`: Single note summary
  - `batch-generate-summaries`: Multiple notes processing
  - `update-stale-summaries`: Refresh outdated summaries
  - `cleanup-old-summaries`: Remove summaries for deleted notes
  - `regenerate-with-new-model`: Migrate to new AI model

### Job Processing Examples
```typescript
{
  "generate-summary": {
    "noteId": "cm4note123",
    "userId": "cm4user456",
    "options": {
      "minWords": 100,
      "maxSummaryLength": 300,
      "includeKeyPoints": true,
      "model": "gemini-1.5-flash"
    }
  },
  "batch-generate-summaries": {
    "userId": "cm4user456",
    "noteIds": ["cm4note1", "cm4note2", "cm4note3"],
    "options": {
      "minWords": 100,
      "skipExisting": false
    }
  }
}
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Generate summary:**
```bash
curl -X POST http://localhost:3001/api/summaries/notes/cm4note123/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "minWords": 100,
    "maxSummaryLength": 300,
    "includeKeyPoints": true,
    "model": "gemini-1.5-flash"
  }'
```

**Batch generate summaries:**
```bash
curl -X POST http://localhost:3001/api/summaries/batch \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noteIds": ["cm4note123", "cm4note456"],
    "minWords": 100,
    "skipExisting": false
  }'
```

**Generate with template:**
```bash
curl -X POST http://localhost:3001/api/summaries/notes/cm4note123/template/meeting \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Queue background processing:**
```bash
curl -X POST http://localhost:3001/api/summaries/notes/cm4note123/queue \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "minWords": 150,
    "model": "gpt-3.5-turbo"
  }'
```

## 🎯 Advanced Features

### Smart Summary Updates
- **Stale Detection**: Automatically detects when note content changes
- **Background Updates**: Queues summary regeneration for modified notes
- **Version History**: Tracks summary changes (future enhancement)
- **Model Migration**: Bulk regeneration with new AI models

### Summary Quality Features
- **Content Analysis**: Validates note length and structure
- **Fallback System**: Extractive summary when AI fails
- **Compression Ratio**: Tracks summary efficiency
- **Key Points Extraction**: Intelligent bullet point generation

### Template System
```typescript
const summaryPrompts = {
  executive: `Create a brief executive summary highlighting key decisions, outcomes, and action items.`,
  academic: `Provide an academic-style summary with main arguments, supporting evidence, and conclusions.`,
  meeting: `Summarize this meeting content focusing on decisions made, action items, and next steps.`,
  research: `Create a research summary covering methodology, key findings, and implications.`,
  project: `Summarize project status, completed milestones, identified risks, and upcoming phases.`
};
```

### Performance Optimizations
- **Caching**: Reuse recent summaries when note unchanged
- **Batch Processing**: Efficient handling of multiple notes
- **Rate Limiting**: Prevents API quota exhaustion
- **Progressive Enhancement**: Graceful degradation when AI unavailable

## ❌ Common Issues and Solutions

### Issue: "Note too short for summary"
**Cause:** Note content below minimum word threshold
**Solution:** Adjust `minWords` parameter or combine with other notes

### Issue: "AI API quota exceeded"
**Cause:** Too many requests to AI service
**Solution:** Use background processing and implement delays

### Issue: "Summary seems outdated"
**Cause:** Note updated after summary generated
**Solution:** Check `isStale` flag and regenerate if needed

### Issue: "Poor summary quality"
**Cause:** AI model not suitable for content type
**Solution:** Try different models or use specific templates

## 📈 Analytics and Insights

### Summary Metrics
- **Generation Rate**: Summaries created per day/week
- **Model Performance**: Quality and speed by AI model
- **Content Analysis**: Average compression ratios
- **User Adoption**: Summary usage patterns

### Quality Indicators
- **Compression Ratio**: Original words / Summary words
- **Key Points Coverage**: Percentage of main topics covered
- **Template Effectiveness**: Success rate by summary type
- **User Feedback**: Manual quality ratings (future)

## 🔄 Maintenance Operations

### Automated Maintenance
- **Stale Summary Updates**: Weekly scan for outdated summaries
- **Cleanup Old Data**: Remove summaries for deleted notes
- **Model Performance**: Track and optimize AI model selection
- **Usage Analytics**: Monitor API costs and performance

### Manual Operations
```typescript
// Queue stale summary updates
await summariesService.queueStaleSummaryUpdate(userId, 30); // 30 days old

// Cleanup old summaries
await summariesService.queueCleanupOldSummaries(userId, 90); // 90 days old

// Migrate to new model
await summariesService.queueModelMigration(userId, 'gpt-4', noteIds);
```

---

**Next:** [Enhanced Search API](./05-search.md)
