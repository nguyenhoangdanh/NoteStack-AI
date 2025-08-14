# Related Notes Discovery API

AI-powered system for discovering and managing relationships between notes using semantic analysis and contextual connections.

## 📋 Overview

The related notes system automatically identifies meaningful connections between notes using multiple analysis methods including semantic similarity, contextual relationships, temporal patterns, and explicit references.

### Features
- ✅ Multi-method relationship detection (semantic, contextual, temporal, reference)
- ✅ AI-powered relevance scoring with confidence levels
- ✅ Bidirectional relationship mapping
- ✅ Real-time relationship updates when notes change
- ✅ Manual relationship management and curation
- ✅ Background processing for large datasets
- ✅ Relationship analytics and insights
- ✅ Relation graph visualization support

## 🔐 Endpoints

### GET /relations/notes/:noteId/related

Discover notes related to a specific note using AI analysis.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Target note ID to find relationships for

**Query Parameters:**
- `limit` (number, optional, default: 5, max: 20) - Maximum number of related notes to return

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "count": 3,
  "relatedNotes": [
    {
      "noteId": "cm4note456",
      "title": "React State Management",
      "relevance": 0.89,
      "type": "SEMANTIC",
      "excerpt": "This guide covers state management in React applications using hooks and context...",
      "reasons": [
        "Semantic similarity: 89.2%",
        "Content analysis using AI embeddings"
      ]
    },
    {
      "noteId": "cm4note789",
      "title": "Frontend Development Best Practices",
      "relevance": 0.76,
      "type": "CONTEXTUAL",
      "excerpt": "Best practices for building modern frontend applications with React and TypeScript...",
      "reasons": [
        "Shared tags: react, javascript, frontend",
        "Same workspace",
        "Similar keywords"
      ]
    },
    {
      "noteId": "cm4note101",
      "title": "Component Architecture Notes",
      "relevance": 0.65,
      "type": "TEMPORAL",
      "excerpt": "Notes on React component architecture patterns and design principles...",
      "reasons": [
        "Created around same time (2 days apart)"
      ]
    }
  ],
  "message": "Found 3 related note(s)"
}
```

**Response Fields:**
- `relevance`: Relationship strength score (0-1)
- `type`: Relationship type (`SEMANTIC`, `CONTEXTUAL`, `TEMPORAL`, `REFERENCE`)
- `excerpt`: Content preview from related note (200 characters max)
- `reasons`: Array of human-readable explanations for the relationship

**Error Response (404):**
```json
{
  "success": false,
  "noteId": "invalid_id",
  "count": 0,
  "relatedNotes": [],
  "message": "Note not found or access denied"
}
```

---

### GET /relations/notes/:noteId/stored

Get previously stored/cached relations for a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Query Parameters:**
- `limit` (number, optional, default: 10, max: 50) - Maximum number of stored relations

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "count": 2,
  "relations": [
    {
      "noteId": "cm4note456",
      "title": "React Hooks Advanced",
      "relevance": 0.92,
      "type": "SEMANTIC",
      "excerpt": "Advanced patterns and techniques for using React hooks effectively...",
      "reasons": [
        "Stored relation: semantic"
      ]
    },
    {
      "noteId": "cm4note789",
      "title": "JavaScript ES6 Features",
      "relevance": 0.78,
      "type": "CONTEXTUAL",
      "excerpt": "Modern JavaScript features introduced in ES6 and their applications...",
      "reasons": [
        "Stored relation: contextual"
      ]
    }
  ],
  "message": "Found 2 stored relation(s)"
}
```

---

### POST /relations/notes/:noteId/save-relation

Manually create or update a relationship between two notes.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `noteId` (string) - Source note ID

**Request Body:**
```json
{
  "targetNoteId": "cm4note456",
  "relevance": 0.85,
  "type": "CONTEXTUAL"
}
```

**Request Fields:**
- `targetNoteId`: ID of the target note to relate to
- `relevance`: Relationship strength (0-1, required)
- `type`: Relationship type (`SEMANTIC`, `CONTEXTUAL`, `TEMPORAL`, `REFERENCE`)

**Success Response (201):**
```json
{
  "success": true,
  "relation": {
    "id": "cm4rel123",
    "sourceNoteId": "cm4note123",
    "targetNoteId": "cm4note456",
    "relevance": 0.85,
    "type": "CONTEXTUAL",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Relation saved successfully"
}
```

**Error Responses:**
```json
// 400 - Invalid relation (same note)
{
  "success": false,
  "message": "Cannot create relation from note to itself"
}

// 404 - Note not found
{
  "success": false,
  "message": "One or both notes not found or not owned by user"
}
```

---

### POST /relations/notes/:noteId/analyze

Queue background relation analysis for a specific note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID to analyze

**Success Response (202):**
```json
{
  "success": true,
  "message": "Relation analysis job queued successfully",
  "noteId": "cm4note123"
}
```

**Background Processing:**
The system will:
1. Analyze note content using multiple methods
2. Find related notes with relevance scores
3. Store high-confidence relations (relevance ≥ 0.5)
4. Update existing relations if better scores found

---

### GET /relations/notes/:noteId/graph

Get relation graph data for network visualization.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Center note ID for the graph

**Query Parameters:**
- `depth` (number, optional, default: 2, max: 3) - Graph traversal depth

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "depth": 2,
  "nodes": [
    {
      "id": "cm4note123",
      "title": "React Hooks Guide",
      "depth": 0,
      "createdAt": "2024-01-10T09:00:00.000Z"
    },
    {
      "id": "cm4note456",
      "title": "State Management",
      "depth": 1,
      "createdAt": "2024-01-12T14:30:00.000Z"
    },
    {
      "id": "cm4note789",
      "title": "Component Patterns",
      "depth": 2,
      "createdAt": "2024-01-14T11:15:00.000Z"
    }
  ],
  "edges": [
    {
      "id": "cm4note123-cm4note456",
      "source": "cm4note123",
      "target": "cm4note456",
      "type": "SEMANTIC",
      "relevance": 0.89
    },
    {
      "id": "cm4note456-cm4note789",
      "source": "cm4note456",
      "target": "cm4note789",
      "type": "CONTEXTUAL",
      "relevance": 0.76
    }
  ],
  "totalNodes": 3,
  "totalEdges": 2
}
```

**Use Cases:**
- Network graph visualization
- Relationship mapping
- Knowledge discovery
- Content navigation

---

### GET /relations/stats/:userId

Get relationship statistics for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalRelations": 47,
    "relationsByType": {
      "SEMANTIC": 23,
      "CONTEXTUAL": 15,
      "TEMPORAL": 6,
      "REFERENCE": 3
    },
    "topConnectedNotes": [
      {
        "noteId": "cm4note123",
        "connectionCount": 8
      },
      {
        "noteId": "cm4note456",
        "connectionCount": 6
      },
      {
        "noteId": "cm4note789",
        "connectionCount": 5
      }
    ]
  }
}
```

---

### DELETE /relations/notes/:sourceNoteId/relations/:targetNoteId

Delete a relationship between two notes.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `sourceNoteId` (string) - Source note ID
- `targetNoteId` (string) - Target note ID

**Success Response (204):**
No content returned.

**Note:** This endpoint removes bidirectional relationships if they exist.

## 🔧 Relationship Detection Methods

### 1. Semantic Similarity
- **Method**: Vector embeddings with cosine similarity
- **Threshold**: ≥ 0.75 relevance score
- **Boost Factor**: 1.2x (semantic relationships are prioritized)
- **Features**:
  - AI-powered content understanding
  - Language-agnostic concept matching
  - Context-aware similarity scoring

### 2. Contextual Relationships
- **Tag Similarity**: Shared tags increase relevance
- **Workspace Proximity**: Same workspace adds 0.2 relevance
- **Keyword Matching**: Porter stemming + Jaccard similarity
- **Threshold**: ≥ 0.3 base relevance required

### 3. Temporal Relationships
- **Time Window**: ±7 days from target note creation
- **Decay Function**: Linear decay over time window
- **Weight**: 0.6x multiplier (lower priority)
- **Use Case**: Related research sessions, project phases

### 4. Reference Relationships
- **Key Phrase Extraction**: Important terms from note titles
- **Content Scanning**: Direct references to extracted phrases
- **Relevance**: Based on phrase match percentage
- **Weight**: 0.8x multiplier for direct references

## 🚀 Background Processing

### Queue System
- **Queue Name**: `related-notes`
- **Default Options**: 2 attempts, exponential backoff
- **Job Types**: 
  - `analyze-relations`: Single note analysis
  - `batch-relation-analysis`: Multiple notes processing
  - `update-relation-scores`: Recalculate existing relations
  - `cleanup-weak-relations`: Remove low-confidence relations
  - `rebuild-semantic-relations`: Refresh semantic embeddings

### Job Processing
```typescript
// Example job data structures
{
  "analyze-relations": {
    "noteId": "cm4note123",
    "userId": "cm4user456",
    "analysisType": "full", // or "semantic", "contextual", "temporal"
    "maxRelations": 10
  },
  "batch-relation-analysis": {
    "userId": "cm4user456", 
    "noteIds": ["cm4note1", "cm4note2", "..."],
    "analysisType": "full"
  },
  "cleanup-weak-relations": {
    "userId": "cm4user456",
    "minRelevance": 0.3,
    "olderThanDays": 30
  }
}
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Find related notes:**
```bash
curl -X GET "http://localhost:3001/api/relations/notes/cm4note123/related?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Save manual relation:**
```bash
curl -X POST http://localhost:3001/api/relations/notes/cm4note123/save-relation \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetNoteId": "cm4note456",
    "relevance": 0.85,
    "type": "CONTEXTUAL"
  }'
```

**Queue analysis:**
```bash
curl -X POST http://localhost:3001/api/relations/notes/cm4note123/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get relationship graph:**
```bash
curl -X GET "http://localhost:3001/api/relations/notes/cm4note123/graph?depth=2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎯 Advanced Features

### Intelligent Scoring Algorithm
```typescript
const scoringFactors = {
  exactKeywordMatch: 0.4,    // Direct keyword matches
  semanticSimilarity: 0.3,   // AI embeddings similarity  
  titleMatch: 0.2,           // Title keyword overlap
  userHistory: 0.1           // Based on user interaction patterns
};

// Combined relevance calculation
const finalScore = Object.values(scoringFactors).reduce((sum, weight, index) => {
  return sum + (factorScores[index] * weight);
}, 0);
```

### Adaptive Learning
- **User Feedback**: Manual relations improve future suggestions
- **Usage Patterns**: Frequently accessed relations get higher priority
- **Content Evolution**: Relation scores update when notes are modified
- **Decay System**: Old, unused relations gradually lose relevance

### Performance Optimizations
- **Caching Strategy**: Store computed relations for fast retrieval
- **Batch Processing**: Analyze multiple notes efficiently
- **Index Optimization**: Database indexes on relation fields
- **Progressive Loading**: Load relation data incrementally

## ❌ Common Issues and Solutions

### Issue: "Poor relation quality"
**Cause:** Insufficient content or very short notes
**Solution:** Increase minimum content length threshold, combine with user tagging

### Issue: "Too many weak relations"
**Cause:** Low relevance threshold
**Solution:** Raise minimum relevance score, implement periodic cleanup

### Issue: "Missing obvious connections"
**Cause:** Different writing styles or terminology
**Solution:** Enable fuzzy matching, expand keyword synonym dictionary

### Issue: "Performance slow with many notes"
**Cause:** Real-time analysis of large note collection
**Solution:** Use background processing, implement result caching

## 📈 Analytics and Insights

### Relationship Metrics
- **Connection Density**: Average relations per note
- **Strongest Clusters**: Highly interconnected note groups
- **Isolated Notes**: Notes with few or no relations
- **Relation Quality**: Distribution of relevance scores

### User Behavior Analysis
- **Most Connected Topics**: Notes with highest relation counts
- **Exploration Patterns**: How users navigate between related notes
- **Manual vs Auto Relations**: User preference for relationship types
- **Time-based Trends**: Relationship creation over time

---

**Next:** [Auto-Summary Generation API](./04-summaries.md)
