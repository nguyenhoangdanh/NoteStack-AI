# Tags Management API

Advanced tagging system with AI-powered suggestions, hierarchical organization, and bulk operations.

## 📋 Overview

The tags management system provides comprehensive tagging capabilities with AI-powered suggestions, hierarchical organization, color coding, and advanced analytics. It enables efficient note organization and discovery through smart tagging.

### Features
- ✅ Hierarchical tag structure with parent-child relationships
- ✅ AI-powered tag suggestions based on content analysis
- ✅ Color-coded tags with custom visualization
- ✅ Bulk tag operations across multiple notes
- ✅ Tag usage analytics and trending tags
- ✅ Smart tag merging and cleanup utilities
- ✅ Background tag processing and optimization
- ✅ Tag-based search and filtering enhancements

## 🔐 Endpoints

### GET /tags

Get all tags for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `search` (string, optional) - Search tags by name
- `includeUsage` (boolean, optional, default: true) - Include usage statistics
- `sortBy` (string, optional, default: 'usage') - Sort by: `name`, `usage`, `created`
- `limit` (number, optional, default: 100) - Maximum tags to return

**Success Response (200):**
```json
{
  "success": true,
  "tags": [
    {
      "id": "cm4tag123",
      "name": "javascript",
      "color": "#F7DF1E",
      "description": "JavaScript programming language related content",
      "ownerId": "cm4user123",
      "createdAt": "2024-01-10T09:00:00.000Z",
      "usageCount": 45,
      "recentUsage": 12,
      "trending": true,
      "relatedTags": [
        {
          "name": "react",
          "similarity": 0.85
        },
        {
          "name": "frontend",
          "similarity": 0.72
        }
      ]
    },
    {
      "id": "cm4tag456",
      "name": "react",
      "color": "#61DAFB",
      "description": "React library and ecosystem",
      "ownerId": "cm4user123",
      "createdAt": "2024-01-12T14:30:00.000Z",
      "usageCount": 38,
      "recentUsage": 8,
      "trending": false,
      "relatedTags": []
    }
  ],
  "total": 2,
  "trending": [
    {
      "name": "javascript",
      "growthRate": 1.4
    },
    {
      "name": "ai",
      "growthRate": 2.1
    }
  ]
}
```

**Response Fields:**
- `usageCount`: Total number of notes using this tag
- `recentUsage`: Usage in the last 7 days
- `trending`: Boolean indicating if tag is trending upward
- `relatedTags`: AI-suggested related tags with similarity scores

---

### POST /tags

Create a new tag.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "machine-learning",
  "color": "#10B981",
  "description": "Machine learning algorithms, models, and applications"
}
```

**Request Fields:**
- `name`: Tag name (required, 1-50 characters, lowercase, alphanumeric + hyphens)
- `color`: Hex color code (optional, defaults to auto-generated)
- `description`: Tag description (optional, max 200 characters)

**Success Response (201):**
```json
{
  "success": true,
  "tag": {
    "id": "cm4tag789",
    "name": "machine-learning",
    "color": "#10B981",
    "description": "Machine learning algorithms, models, and applications",
    "ownerId": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "usageCount": 0,
    "recentUsage": 0,
    "trending": false
  },
  "message": "Tag created successfully"
}
```

**Error Responses:**
```json
// 409 - Tag already exists
{
  "success": false,
  "message": "Tag with this name already exists",
  "statusCode": 409
}

// 400 - Invalid tag name
{
  "success": false,
  "message": "Tag name must be lowercase and contain only letters, numbers, and hyphens",
  "statusCode": 400
}
```

---

### PUT /tags/:tagId

Update an existing tag.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `tagId` (string) - Tag ID

**Request Body:**
```json
{
  "name": "ml-algorithms",
  "color": "#059669",
  "description": "Updated description for machine learning algorithms"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "tag": {
    "id": "cm4tag789",
    "name": "ml-algorithms",
    "color": "#059669",
    "description": "Updated description for machine learning algorithms",
    "ownerId": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z",
    "usageCount": 3,
    "recentUsage": 1
  },
  "message": "Tag updated successfully"
}
```

---

### DELETE /tags/:tagId

Delete a tag and remove it from all notes.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `tagId` (string) - Tag ID

**Query Parameters:**
- `transferTo` (string, optional) - Transfer usage to another tag ID

**Success Response (200):**
```json
{
  "success": true,
  "deletedTag": {
    "id": "cm4tag789",
    "name": "ml-algorithms",
    "usageCount": 3
  },
  "notesUpdated": 3,
  "transferredTo": "cm4tag456",
  "message": "Tag deleted and transferred to 'machine-learning'"
}
```

**Without Transfer Response:**
```json
{
  "success": true,
  "deletedTag": {
    "id": "cm4tag789",
    "name": "ml-algorithms",
    "usageCount": 3
  },
  "notesUpdated": 3,
  "message": "Tag deleted and removed from 3 notes"
}
```

---

### POST /tags/suggest/:noteId

Get AI-powered tag suggestions for a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID to analyze

**Query Parameters:**
- `limit` (number, optional, default: 5) - Maximum suggestions
- `threshold` (number, optional, default: 0.7) - Confidence threshold (0-1)

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "suggestions": [
    {
      "name": "javascript",
      "confidence": 0.92,
      "exists": true,
      "tagId": "cm4tag123",
      "reasons": [
        "High keyword frequency (15 occurrences)",
        "Code examples detected",
        "Related to existing tags: react, frontend"
      ],
      "suggestedColor": "#F7DF1E"
    },
    {
      "name": "algorithms",
      "confidence": 0.78,
      "exists": false,
      "reasons": [
        "Technical content about sorting algorithms",
        "Mathematical concepts detected"
      ],
      "suggestedColor": "#8B5CF6"
    },
    {
      "name": "web-development",
      "confidence": 0.85,
      "exists": true,
      "tagId": "cm4tag456",
      "reasons": [
        "HTML/CSS references found",
        "Browser API usage"
      ],
      "suggestedColor": "#3B82F6"
    }
  ],
  "appliedTags": [
    "javascript",
    "web-development"
  ],
  "message": "Applied 2 high-confidence tags automatically"
}
```

**Response Fields:**
- `confidence`: AI confidence score (0-1)
- `exists`: Whether tag already exists for this user
- `tagId`: Existing tag ID (if exists)
- `reasons`: Human-readable explanations for the suggestion
- `appliedTags`: Tags automatically applied (confidence > 0.9)

---

### POST /tags/bulk-apply

Apply tags to multiple notes in bulk.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "noteIds": ["cm4note123", "cm4note456", "cm4note789"],
  "tagIds": ["cm4tag123", "cm4tag456"],
  "operation": "ADD"
}
```

**Request Fields:**
- `noteIds`: Array of note IDs (max 100)
- `tagIds`: Array of tag IDs to apply
- `operation`: `ADD` (add tags) or `REMOVE` (remove tags)

**Success Response (200):**
```json
{
  "success": true,
  "operation": "ADD",
  "processed": {
    "total": 3,
    "successful": 3,
    "failed": 0
  },
  "results": [
    {
      "noteId": "cm4note123",
      "success": true,
      "tagsAdded": 2,
      "tagsSkipped": 0
    },
    {
      "noteId": "cm4note456",
      "success": true,
      "tagsAdded": 1,
      "tagsSkipped": 1
    },
    {
      "noteId": "cm4note789",
      "success": true,
      "tagsAdded": 2,
      "tagsSkipped": 0
    }
  ],
  "message": "Bulk operation completed successfully"
}
```

---

### POST /tags/merge

Merge multiple tags into a single tag.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sourceTags": ["cm4tag123", "cm4tag456", "cm4tag789"],
  "targetTag": {
    "name": "web-technologies",
    "color": "#3B82F6",
    "description": "Web development technologies and frameworks"
  }
}
```

**Request Fields:**
- `sourceTags`: Array of tag IDs to merge
- `targetTag`: New tag properties or existing tag ID

**Success Response (200):**
```json
{
  "success": true,
  "mergedTag": {
    "id": "cm4tag999",
    "name": "web-technologies",
    "color": "#3B82F6",
    "description": "Web development technologies and frameworks",
    "usageCount": 47
  },
  "sourceTags": [
    {
      "id": "cm4tag123",
      "name": "javascript",
      "usageCount": 23
    },
    {
      "id": "cm4tag456",
      "name": "react",
      "usageCount": 15
    },
    {
      "id": "cm4tag789",
      "name": "html",
      "usageCount": 9
    }
  ],
  "notesUpdated": 35,
  "message": "Successfully merged 3 tags into 'web-technologies'"
}
```

---

### GET /tags/analytics

Get comprehensive tag usage analytics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period` (string, optional, default: 'month') - Analysis period
- `limit` (number, optional, default: 20) - Top tags limit

**Success Response (200):**
```json
{
  "success": true,
  "period": "month",
  "analytics": {
    "totalTags": 156,
    "activeTags": 89,
    "averageTagsPerNote": 3.2,
    "tagGrowthRate": 0.15,
    "topTags": [
      {
        "id": "cm4tag123",
        "name": "javascript",
        "usageCount": 45,
        "growthRate": 0.23,
        "color": "#F7DF1E"
      },
      {
        "id": "cm4tag456",
        "name": "react",
        "usageCount": 38,
        "growthRate": 0.18,
        "color": "#61DAFB"
      }
    ],
    "trendingTags": [
      {
        "name": "ai",
        "growthRate": 2.1,
        "newUsages": 12
      },
      {
        "name": "machine-learning",
        "growthRate": 1.8,
        "newUsages": 8
      }
    ],
    "unusedTags": [
      {
        "id": "cm4tag789",
        "name": "old-framework",
        "lastUsed": "2023-11-15T10:30:00.000Z"
      }
    ],
    "tagDistribution": {
      "1-5": 23,
      "6-10": 34,
      "11-20": 18,
      "21+": 14
    }
  }
}
```

**Response Fields:**
- `tagGrowthRate`: Overall tag usage growth rate
- `tagDistribution`: Distribution by usage count ranges
- `trendingTags`: Tags with highest growth rates
- `unusedTags`: Tags not used recently (candidates for cleanup)

---

### POST /tags/cleanup

Clean up unused and low-usage tags.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rules": {
    "removeUnused": true,
    "unusedDays": 90,
    "mergeSimilar": true,
    "similarityThreshold": 0.8,
    "minUsageCount": 2
  },
  "dryRun": true
}
```

**Request Fields:**
- `removeUnused`: Remove tags not used for specified days
- `unusedDays`: Days threshold for unused tags
- `mergeSimilar`: Merge similar tags automatically
- `similarityThreshold`: Similarity threshold for merging
- `minUsageCount`: Minimum usage to keep tags
- `dryRun`: Preview changes without applying them

**Success Response (200):**
```json
{
  "success": true,
  "dryRun": true,
  "analysis": {
    "tagsToRemove": [
      {
        "id": "cm4tag789",
        "name": "old-framework",
        "reason": "Unused for 120 days",
        "lastUsed": "2023-10-01T10:30:00.000Z"
      }
    ],
    "tagsToMerge": [
      {
        "sourceTags": ["javascript", "js"],
        "targetTag": "javascript",
        "similarity": 0.95,
        "combinedUsage": 67
      }
    ],
    "lowUsageTags": [
      {
        "id": "cm4tag101",
        "name": "experimental",
        "usageCount": 1,
        "action": "flagged_for_review"
      }
    ]
  },
  "summary": {
    "tagsAnalyzed": 156,
    "tagsToRemove": 5,
    "mergeOperations": 3,
    "potentialSpaceSaved": "15% reduction"
  },
  "message": "Tag cleanup analysis completed (dry run)"
}
```

---

### GET /tags/search

Advanced tag search with filters and suggestions.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `q` (string, required) - Search query
- `color` (string, optional) - Filter by color
- `minUsage` (number, optional) - Minimum usage count
- `trending` (boolean, optional) - Only trending tags
- `limit` (number, optional, default: 20) - Results limit

**Success Response (200):**
```json
{
  "success": true,
  "query": "java",
  "results": [
    {
      "id": "cm4tag123",
      "name": "javascript",
      "color": "#F7DF1E",
      "description": "JavaScript programming language",
      "usageCount": 45,
      "matchType": "substring",
      "relevance": 0.95
    },
    {
      "id": "cm4tag456", 
      "name": "java",
      "color": "#ED8B00",
      "description": "Java programming language",
      "usageCount": 28,
      "matchType": "exact",
      "relevance": 1.0
    }
  ],
  "suggestions": [
    {
      "name": "javafx",
      "reason": "Related to Java development",
      "confidence": 0.78
    },
    {
      "name": "programming",
      "reason": "Common parent category",
      "confidence": 0.65
    }
  ],
  "total": 2
}
```

---

### POST /tags/auto-organize

Automatically organize and suggest tag structure improvements.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "suggestions": {
    "hierarchyProposals": [
      {
        "category": "Programming Languages",
        "tags": ["javascript", "python", "java", "typescript"],
        "confidence": 0.89
      },
      {
        "category": "Web Development",
        "tags": ["react", "vue", "angular", "html", "css"],
        "confidence": 0.92
      }
    ],
    "redundantTags": [
      {
        "primary": "javascript",
        "redundant": ["js", "ecmascript"],
        "mergeConfidence": 0.95
      }
    ],
    "colorConsistency": [
      {
        "category": "Programming Languages",
        "suggestedColors": {
          "javascript": "#F7DF1E",
          "python": "#3776AB",
          "java": "#ED8B00"
        }
      }
    ]
  },
  "message": "Tag organization analysis completed"
}
```

## 🔧 Smart Tagging Features

### AI-Powered Tag Suggestions

The system analyzes note content using multiple methods:

1. **Keyword Extraction**
   - Technical term identification
   - Frequency analysis
   - Context-aware filtering

2. **Semantic Analysis**
   - Concept extraction from content
   - Relationship detection
   - Domain-specific understanding

3. **Pattern Recognition**
   - User tagging patterns
   - Common tag combinations
   - Historical preferences

```typescript
// Tag suggestion algorithm
const tagSuggestionFactors = {
  keywordFrequency: 0.3,      // How often keywords appear
  semanticRelevance: 0.25,    // AI semantic analysis
  userHistory: 0.2,           // User's tagging patterns
  contextualFit: 0.15,        // How well it fits note context
  communityUsage: 0.1         // How others use similar tags
};
```

### Smart Tag Organization

- **Automatic Categorization**: Group related tags
- **Hierarchy Suggestions**: Propose parent-child relationships
- **Duplicate Detection**: Find and merge similar tags
- **Usage Optimization**: Recommend tag consolidation

## 🧪 Testing Examples

### Manual Testing with cURL

**Get tag suggestions:**
```bash
curl -X POST "http://localhost:3001/api/tags/suggest/cm4note123?limit=5&threshold=0.7" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Bulk apply tags:**
```bash
curl -X POST http://localhost:3001/api/tags/bulk-apply \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noteIds": ["cm4note123", "cm4note456"],
    "tagIds": ["cm4tag123", "cm4tag456"],
    "operation": "ADD"
  }'
```

**Merge tags:**
```bash
curl -X POST http://localhost:3001/api/tags/merge \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceTags": ["cm4tag123", "cm4tag456"],
    "targetTag": {
      "name": "web-development",
      "color": "#3B82F6",
      "description": "Web development technologies"
    }
  }'
```

**Tag cleanup analysis:**
```bash
curl -X POST http://localhost:3001/api/tags/cleanup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": {
      "removeUnused": true,
      "unusedDays": 90,
      "mergeSimilar": true
    },
    "dryRun": true
  }'
```

## 🎯 Advanced Features

### Tag Hierarchies

```typescript
// Future: Hierarchical tag structure
interface TagHierarchy {
  parentTag: string;
  childTags: string[];
  depth: number;
  breadcrumb: string[];
}

// Example: programming > javascript > react
const hierarchy = {
  parentTag: 'programming',
  childTags: ['javascript'],
  depth: 1,
  breadcrumb: ['programming', 'javascript', 'react']
};
```

### Smart Tag Suggestions

```typescript
// Context-aware suggestions
const getSmartSuggestions = (note: Note) => {
  const suggestions = [
    ...extractKeywords(note.content),
    ...analyzeSemantics(note.content),
    ...getUserPatterns(note.ownerId),
    ...getRelatedTags(note.existingTags)
  ];
  
  return rankSuggestions(suggestions);
};
```

### Bulk Operations

- **Mass Tagging**: Apply tags to filtered note sets
- **Tag Migration**: Move tags between categories
- **Batch Updates**: Update multiple tag properties
- **Import/Export**: Bulk tag data management

## ❌ Common Issues and Solutions

### Issue: "Too many similar tags"
**Cause:** Users creating variations of same concept
**Solution:** Use tag merge suggestions and cleanup tools

### Issue: "Poor tag suggestions"
**Cause:** Insufficient content analysis or user history
**Solution:** Improve content analysis and build user patterns

### Issue: "Tag performance issues"
**Cause:** Too many tags slowing down operations
**Solution:** Implement tag pagination and lazy loading

### Issue: "Inconsistent tag usage"
**Cause:** No standardized tagging guidelines
**Solution:** Provide tag suggestions and organization tools

## 📈 Analytics and Insights

### Tag Performance Metrics
- **Usage Growth**: Tag adoption over time
- **Discovery Rate**: How often suggestions are accepted
- **Organization Score**: How well tags are structured
- **Cleanup Efficiency**: Reduction in redundant tags

### User Behavior Analysis
- **Tagging Patterns**: How users apply tags
- **Search Behavior**: Which tags are searched most
- **Organization Preferences**: User tagging styles
- **Collaboration Impact**: How shared tags affect usage

## 🔄 Background Processing

### Queue System
- **Tag Analysis**: AI-powered tag suggestions
- **Cleanup Operations**: Remove unused/redundant tags
- **Usage Analytics**: Calculate tag statistics
- **Similarity Detection**: Find related tags

### Maintenance Jobs
- **Daily**: Update usage statistics
- **Weekly**: Analyze trending tags
- **Monthly**: Suggest cleanup operations
- **Quarterly**: Reorganization recommendations

---

**Next:** [Templates API](./06-templates.md)
