# Enhanced Search API

Advanced search system with intelligent ranking, filters, facets, and search analytics.

## 📋 Overview

The enhanced search system provides powerful search capabilities with intelligent ranking algorithms, advanced filtering options, search history tracking, and comprehensive analytics. It combines text-based search with semantic search for optimal results.

### Features
- ✅ Advanced search with multiple filters and facets
- ✅ Intelligent ranking with multiple scoring factors
- ✅ Search history and popular queries tracking
- ✅ Saved searches for reusable queries
- ✅ Real-time search suggestions
- ✅ Search analytics and insights
- ✅ Quick search for simple queries
- ✅ Background search ranking optimization

## 🔐 Endpoints

### POST /search/advanced

Perform advanced search with comprehensive filters and faceting.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "React hooks useEffect useState",
  "workspaceId": "cm4workspace123",
  "tags": ["react", "javascript"],
  "dateRange": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-01-31T23:59:59.999Z"
  },
  "hasAttachments": false,
  "wordCountRange": {
    "min": 100,
    "max": 2000
  },
  "categories": ["Technology", "Web Development"],
  "lastModifiedDays": 30,
  "sortBy": "relevance",
  "sortOrder": "desc",
  "limit": 20
}
```

**Request Fields:**
- `query`: Search query string (required)
- `workspaceId`: Filter by specific workspace
- `tags`: Array of tags to filter by
- `dateRange`: Date range filter with from/to dates
- `hasAttachments`: Filter notes with/without attachments
- `wordCountRange`: Filter by note word count range
- `categories`: Array of category names to filter by
- `lastModifiedDays`: Notes modified within X days
- `sortBy`: Sort field (`relevance`, `created`, `updated`, `title`, `size`)
- `sortOrder`: Sort direction (`asc`, `desc`)
- `limit`: Maximum results (default: 20, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "query": "React hooks useEffect useState",
  "results": [
    {
      "id": "cm4note123",
      "title": "React Hooks Guide",
      "content": "Complete guide to React hooks including useEffect, useState...",
      "excerpt": "...React hooks are functions that let you **use state** and lifecycle features in functional components. The **useEffect** hook handles side effects...",
      "score": 98.5,
      "highlights": [
        "**React Hooks** Guide",
        "The **useEffect** hook handles side effects",
        "**useState** manages local component state"
      ],
      "reasons": [
        "Exact match in title",
        "3 keyword(s) in content",
        "Tag matches: react",
        "Recently updated"
      ],
      "workspace": {
        "id": "cm4workspace123",
        "name": "Development Notes"
      },
      "tags": ["react", "javascript", "hooks"],
      "categories": [
        {
          "name": "Web Development",
          "color": "#3B82F6"
        }
      ],
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-20T14:30:00.000Z",
      "wordCount": 1250,
      "hasAttachments": false
    }
  ],
  "total": 15,
  "facets": {
    "workspaces": [
      {
        "id": "cm4workspace123",
        "name": "Development Notes",
        "count": 8
      },
      {
        "id": "cm4workspace456",
        "name": "Personal",
        "count": 7
      }
    ],
    "tags": [
      { "name": "react", "count": 12 },
      { "name": "javascript", "count": 10 },
      { "name": "hooks", "count": 8 }
    ],
    "categories": [
      {
        "name": "Web Development",
        "color": "#3B82F6",
        "count": 10
      }
    ],
    "dateRanges": {
      "last7Days": 3,
      "last30Days": 8,
      "last90Days": 4,
      "older": 0
    },
    "total": 15
  }
}
```

**Response Fields:**
- `results`: Array of search results with scores and highlights
- `total`: Total number of matching results
- `facets`: Aggregated data for filtering options
- `score`: Relevance score (0-100) based on multiple factors
- `highlights`: Text snippets with query matches highlighted
- `reasons`: Human-readable explanations for ranking
- `excerpt`: Content preview with highlighted matches

---

### POST /search/quick

Simple quick search for basic queries.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "React components",
  "limit": 10
}
```

**Success Response (200):**
```json
{
  "success": true,
  "query": "React components",
  "results": [
    {
      "id": "cm4note123",
      "title": "React Components Best Practices",
      "excerpt": "Learn how to build **React components** following modern best practices...",
      "score": 87.3,
      "highlights": [
        "**React Components** Best Practices"
      ],
      "workspace": {
        "id": "cm4workspace123",
        "name": "Development Notes"
      },
      "updatedAt": "2024-01-20T14:30:00.000Z"
    }
  ],
  "total": 8
}
```

---

### GET /search/suggestions

Get real-time search suggestions based on query prefix.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `q` (string, required) - Search query prefix
- `limit` (number, optional, default: 5) - Maximum suggestions

**Success Response (200):**
```json
{
  "success": true,
  "query": "react",
  "suggestions": [
    {
      "text": "react hooks tutorial",
      "type": "history"
    },
    {
      "text": "react components guide",
      "type": "history"
    },
    {
      "text": "react",
      "type": "tag"
    },
    {
      "text": "react-router",
      "type": "tag"
    },
    {
      "text": "react native",
      "type": "tag"
    }
  ]
}
```

**Suggestion Types:**
- `history`: From user's search history
- `tag`: Popular tags matching the query
- `category`: Categories matching the query
- `note`: Note titles matching the query

---

### GET /search/history

Get user's search history.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `limit` (number, optional, default: 20) - Maximum history entries

**Success Response (200):**
```json
{
  "success": true,
  "history": [
    {
      "id": "cm4search123",
      "query": "React hooks useEffect",
      "filters": {
        "tags": ["react"],
        "sortBy": "relevance"
      },
      "resultCount": 12,
      "searchedAt": "2024-01-20T15:30:00.000Z"
    },
    {
      "id": "cm4search456",
      "query": "JavaScript async await",
      "filters": {},
      "resultCount": 8,
      "searchedAt": "2024-01-20T14:15:00.000Z"
    }
  ],
  "count": 2
}
```

---

### GET /search/popular

Get popular search queries for the user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `limit` (number, optional, default: 10) - Maximum popular searches

**Success Response (200):**
```json
{
  "success": true,
  "searches": [
    {
      "query": "React hooks",
      "count": 15
    },
    {
      "query": "JavaScript promises",
      "count": 8
    },
    {
      "query": "Node.js tutorial",
      "count": 6
    }
  ]
}
```

---

### POST /search/save

Save a search query for reuse.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Recent React Notes",
  "query": "React",
  "filters": {
    "tags": ["react", "javascript"],
    "lastModifiedDays": 30,
    "sortBy": "updated",
    "sortOrder": "desc"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "savedSearch": {
    "id": "cm4saved123",
    "name": "Recent React Notes",
    "query": "React",
    "filters": {
      "tags": ["react", "javascript"],
      "lastModifiedDays": 30,
      "sortBy": "updated",
      "sortOrder": "desc"
    },
    "isDefault": false,
    "createdAt": "2024-01-20T16:00:00.000Z",
    "updatedAt": "2024-01-20T16:00:00.000Z"
  },
  "message": "Search saved successfully"
}
```

---

### GET /search/saved

Get all saved searches for the user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "savedSearches": [
    {
      "id": "cm4saved123",
      "name": "Recent React Notes",
      "query": "React",
      "filters": {
        "tags": ["react", "javascript"],
        "lastModifiedDays": 30
      },
      "isDefault": false,
      "createdAt": "2024-01-20T16:00:00.000Z",
      "updatedAt": "2024-01-20T16:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### DELETE /search/saved/:id

Delete a saved search.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Saved search ID

**Success Response (204):**
No content returned.

---

### GET /search/analytics

Get comprehensive search analytics for the user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalSearches": 156,
    "uniqueQueries": 89,
    "avgResultsPerSearch": 12.4,
    "totalSavedSearches": 5,
    "searchesByDay": {
      "2024-01-20": 8,
      "2024-01-19": 12,
      "2024-01-18": 6
    },
    "topQueries": [
      {
        "query": "React hooks",
        "count": 15
      },
      {
        "query": "JavaScript",
        "count": 12
      }
    ],
    "searchTrends": {
      "last7Days": 45,
      "last30Days": 156
    }
  }
}
```

## 🔧 Search Algorithm & Ranking

### Intelligent Scoring System

The search algorithm uses multiple factors to calculate relevance scores:

```typescript
const scoringFactors = {
  exactPhraseInTitle: 100,      // Highest priority
  exactPhraseInContent: 80,     // High priority
  titleKeywordMatches: 20,      // Per keyword
  contentKeywordMatches: 10,    // Per keyword  
  tagMatches: 15,               // Per matching tag
  semanticSimilarity: 50,       // AI-powered semantic match
  recencyBonus: 2,              // Per day (max 14 days)
  lengthOptimization: 5,        // Sweet spot bonus (50-1000 words)
  userBehavior: 0.1             // Historical ranking factor
};
```

### Search Ranking Features

1. **Multi-factor Scoring**
   - Exact phrase matches get highest priority
   - Individual keyword matches with position weighting
   - Tag and category relevance
   - Semantic similarity using AI embeddings

2. **Content Analysis**
   - Keyword density analysis
   - Title vs content match weighting
   - Content length optimization
   - Freshness scoring

3. **User Behavior Learning**
   - Click-through rate tracking
   - Historical search performance
   - Personal search patterns
   - Adaptive ranking improvements

4. **Context-Aware Ranking**
   - Workspace-specific relevance
   - Tag relationship scoring
   - Category context matching
   - Time-based relevance

## 🎯 Advanced Features

### Faceted Search

The system provides rich facets for filtering:

- **Workspaces**: Filter by workspace with result counts
- **Tags**: Popular tags with usage frequency
- **Categories**: Categories with color coding
- **Date Ranges**: Predefined date buckets (7/30/90 days)
- **Content Types**: With/without attachments
- **Word Count**: Size-based filtering

### Search Suggestions

Real-time suggestions from multiple sources:

```typescript
const suggestionSources = {
  searchHistory: 'Recent user searches',
  popularTags: 'Frequently used tags',
  noteTitle: 'Matching note titles',
  categories: 'Relevant categories',
  savedSearches: 'User\'s saved queries'
};
```

### Search Analytics

Comprehensive analytics include:

- **Usage Metrics**: Total searches, unique queries, avg results
- **Trend Analysis**: Search patterns over time
- **Query Performance**: Success rates and result quality
- **Popular Queries**: Most searched terms
- **Search Patterns**: Daily/weekly usage trends

## 🚀 Background Processing

### Queue System
- **Queue Name**: `search-ranking`
- **Job Types**:
  - `update-search-rankings`: Update search result rankings
  - `cleanup-old-rankings`: Remove outdated ranking data
  - `rebuild-search-index`: Full search index rebuild

### Ranking Optimization

Background jobs continuously optimize search rankings:

```typescript
const rankingFactors = {
  position: 'Result position in search',
  clickThrough: 'User click behavior',
  dwellTime: 'Time spent on result',
  userFeedback: 'Explicit relevance feedback',
  queryRefining: 'Query modification patterns'
};
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Advanced search:**
```bash
curl -X POST http://localhost:3001/api/search/advanced \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "React hooks tutorial",
    "tags": ["react", "javascript"],
    "lastModifiedDays": 30,
    "sortBy": "relevance",
    "limit": 10
  }'
```

**Quick search:**
```bash
curl -X POST http://localhost:3001/api/search/quick \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "JavaScript async",
    "limit": 5
  }'
```

**Get search suggestions:**
```bash
curl -X GET "http://localhost:3001/api/search/suggestions?q=react&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Save search:**
```bash
curl -X POST http://localhost:3001/api/search/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My React Research",
    "query": "React",
    "filters": {
      "tags": ["react"],
      "sortBy": "updated"
    }
  }'
```

## 🎨 Frontend Integration

### React Search Components

```typescript
// hooks/useAdvancedSearch.ts
export function useAdvancedSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [facets, setFacets] = useState(null);

  const search = async (query: string, filters: AdvancedSearchFilters) => {
    setLoading(true);
    try {
      const response = await fetch('/api/search/advanced', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, ...filters })
      });

      const data = await response.json();
      setResults(data.results);
      setFacets(data.facets);
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { results, facets, loading, search };
}

// components/AdvancedSearchForm.tsx
export function AdvancedSearchForm({ onSearch }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  const handleQueryChange = async (value: string) => {
    setQuery(value);
    
    if (value.length >= 2) {
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(value)}&limit=5`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }
        );
        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  return (
    <form onSubmit={handleSubmit} className="advanced-search-form">
      <div className="search-input-group">
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search your notes..."
          className="search-input"
        />
        
        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setQuery(suggestion.text);
                  setSuggestions([]);
                }}
              >
                <span className={`suggestion-type ${suggestion.type}`}>
                  {suggestion.type === 'history' ? '🕒' : '🏷️'}
                </span>
                {suggestion.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="search-filters">
        <TagFilter
          selectedTags={filters.tags}
          onChange={(tags) => setFilters({ ...filters, tags })}
        />
        
        <DateRangeFilter
          dateRange={filters.dateRange}
          onChange={(dateRange) => setFilters({ ...filters, dateRange })}
        />
        
        <CategoryFilter
          selectedCategories={filters.categories}
          onChange={(categories) => setFilters({ ...filters, categories })}
        />
      </div>

      <button type="submit" className="search-button">
        🔍 Search
      </button>
    </form>
  );
}

// components/SearchResults.tsx
export function SearchResults({ results, facets, onRefine }) {
  return (
    <div className="search-results-container">
      <div className="search-sidebar">
        <SearchFacets facets={facets} onRefine={onRefine} />
      </div>
      
      <div className="search-results">
        <div className="results-header">
          <h3>Search Results ({results.length})</h3>
          <SortingControls onChange={onRefine} />
        </div>
        
        {results.map(result => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}

function SearchResultCard({ result }) {
  return (
    <div className="search-result-card">
      <div className="result-header">
        <h4 className="result-title">{result.title}</h4>
        <span className="result-score">{result.score.toFixed(1)}</span>
      </div>
      
      <div className="result-excerpt" 
           dangerouslySetInnerHTML={{ __html: result.excerpt }} 
      />
      
      <div className="result-highlights">
        {result.highlights.slice(0, 2).map((highlight, index) => (
          <div key={index} 
               className="highlight"
               dangerouslySetInnerHTML={{ __html: highlight }}
          />
        ))}
      </div>
      
      <div className="result-metadata">
        <div className="result-tags">
          {result.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="result-reasons">
          {result.reasons.slice(0, 2).map((reason, index) => (
            <span key={index} className="reason">{reason}</span>
          ))}
        </div>
        
        <div className="result-meta">
          <span className="workspace">{result.workspace.name}</span>
          <span className="updated">
            Updated {new Date(result.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
```

## 📈 Performance Optimizations

### Caching Strategy
- **Search Results**: Cache frequently accessed results for 5 minutes
- **Facet Data**: Cache aggregation results for 10 minutes
- **Suggestions**: Cache popular suggestions for 1 hour
- **Analytics**: Cache metrics for 1 hour

### Query Optimization
- **Index Usage**: Optimized database indexes on search fields
- **Parallel Processing**: Concurrent text and semantic search
- **Result Pagination**: Efficient offset-based pagination
- **Background Ranking**: Asynchronous ranking updates

## ❌ Common Issues and Solutions

### Issue: "Slow search performance"
**Cause:** Large dataset without proper indexing
**Solution:** Optimize database indexes, implement result caching

### Issue: "Poor search relevance"
**Cause:** Inadequate ranking factors or outdated rankings
**Solution:** Tune scoring weights, run ranking optimization jobs

### Issue: "No search suggestions"
**Cause:** Insufficient search history or empty indexes
**Solution:** Build up search history, populate tag indexes

### Issue: "Facets not updating"
**Cause:** Stale cache or indexing issues
**Solution:** Clear search caches, rebuild search indexes

## 🔬 Search Analytics

### Metrics Tracking
- **Query Performance**: Average response time, result quality
- **User Behavior**: Click-through rates, query refinements
- **Content Analysis**: Most/least discoverable content
- **Search Patterns**: Peak usage times, popular queries

### Optimization Insights
- **Query Expansion**: Automatic synonym detection
- **Result Clustering**: Group similar results
- **Personalization**: User-specific ranking adjustments
- **A/B Testing**: Ranking algorithm comparisons

---

**Next:** [Phase 2B Documentation](../phase2b/README.md)
