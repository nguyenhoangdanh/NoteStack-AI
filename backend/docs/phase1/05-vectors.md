# Vector Search & RAG API

Semantic search and Retrieval-Augmented Generation system for intelligent note discovery.

## 📋 Overview

The vector system powers the semantic search and AI chat capabilities by converting note content into vector embeddings. This enables finding conceptually similar notes even when they don't share exact keywords.

### Features
- ✅ Semantic search using vector embeddings
- ✅ RAG (Retrieval-Augmented Generation) for AI chat
- ✅ Automatic text chunking and embedding
- ✅ Fallback to text search when embeddings unavailable
- ✅ Context building for AI conversations

## 🔐 Endpoints

### POST /vectors/semantic-search

Perform semantic search across user's notes using vector embeddings.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "machine learning concepts and algorithms",
  "limit": 5
}
```

**Validation Rules:**
- `query`: Required string, search query
- `limit`: Optional number, 1-50, default 5

**Success Response (200):**
```json
[
  {
    "id": "cm4vector123",
    "noteId": "cm4note123",
    "chunkId": "cm4note123_chunk_1",
    "chunkContent": "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data...",
    "chunkIndex": 1,
    "heading": "Introduction to ML",
    "embedding": [0.1, 0.2, -0.3, ...], // Vector array (may be empty if embeddings disabled)
    "ownerId": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "noteTitle": "AI Research Notes",
    "similarity": 0.87
  },
  {
    "id": "cm4vector456",
    "noteId": "cm4note456",
    "chunkId": "cm4note456_chunk_3",
    "chunkContent": "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes...",
    "chunkIndex": 3,
    "heading": "Neural Network Basics",
    "embedding": [0.2, -0.1, 0.4, ...],
    "ownerId": "cm4user123",
    "createdAt": "2024-01-14T14:15:00.000Z",
    "noteTitle": "Deep Learning Fundamentals", 
    "similarity": 0.82
  }
]
```

**Response Fields:**
- `similarity`: Float 0-1, relevance score (higher = more relevant)
- `chunkContent`: Text chunk that matched the search
- `chunkIndex`: Position of chunk within the note
- `heading`: Markdown heading this chunk belongs to (if any)
- `noteTitle`: Title of the source note
- `embedding`: Vector embedding (may be empty array if disabled)

**Frontend Integration:**
```typescript
// services/vectorsService.ts
export async function semanticSearch(query: string, limit: number = 5) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/vectors/semantic-search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, limit })
  });

  if (!response.ok) {
    throw new Error('Semantic search failed');
  }

  return response.json();
}

// React component for semantic search
export function SemanticSearchWidget() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await semanticSearch(query.trim(), 10);
      setResults(searchResults);
    } catch (error) {
      toast.error('Semantic search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="semantic-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find conceptually similar notes..."
          className="semantic-search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Semantic Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="semantic-results">
          <h3>Similar Concepts Found ({results.length})</h3>
          {results.map(result => (
            <div key={result.id} className="semantic-result">
              <div className="result-header">
                <h4>{result.noteTitle}</h4>
                <span className="similarity-score">
                  {Math.round(result.similarity * 100)}% match
                </span>
              </div>
              {result.heading && (
                <div className="result-section">{result.heading}</div>
              )}
              <div className="result-content">
                {highlightText(result.chunkContent, query)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to highlight matching text
function highlightText(text: string, query: string) {
  const words = query.toLowerCase().split(' ');
  let highlightedText = text;
  
  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
}
```

## 🔧 How Vector Search Works

### 1. Text Chunking
When notes are processed, they're broken into smaller chunks:
- **Maximum tokens**: 400 tokens per chunk
- **Overlap**: 30 tokens between chunks
- **Heading preservation**: Chunks maintain their section context
- **Intelligent splitting**: Splits at sentence boundaries when possible

### 2. Vector Embeddings
Each chunk is converted to a vector embedding:
- **Model**: OpenAI `text-embedding-3-small`
- **Dimensions**: 1536-dimensional vectors
- **Fallback**: Text-based search if embeddings unavailable
- **Caching**: Embeddings stored in database until note updates

### 3. Search Algorithm
Search process combines multiple approaches:
```typescript
// Search ranking factors
const searchFactors = {
  semanticSimilarity: 0.6,    // Vector cosine similarity
  textMatch: 0.2,             // Keyword matching
  titleRelevance: 0.1,        // Title contains query
  recency: 0.05,              // Recently updated notes
  userBehavior: 0.05          // Previously accessed notes
};
```

### 4. Context Building for RAG
The system builds context for AI chat by:
1. Finding most relevant chunks via semantic search
2. Combining chunks while respecting token limits
3. Preserving source citations for transparency
4. Optimizing for conversational context

## 🧪 Testing Examples

### Manual Testing with cURL

**Semantic search:**
```bash
curl -X POST http://localhost:3001/api/vectors/semantic-search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "artificial intelligence and machine learning",
    "limit": 5
  }'
```

### React Integration Example
```tsx
// components/SmartSearch.tsx
export function SmartSearch() {
  const [searchType, setSearchType] = useState('semantic'); // 'semantic' | 'text'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = searchType === 'semantic' 
        ? await semanticSearch(query.trim())
        : await textSearch(query.trim());
      
      setResults(searchResults);
    } catch (error) {
      toast.error(`${searchType} search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smart-search">
      <div className="search-controls">
        <div className="search-type-toggle">
          <button 
            className={searchType === 'semantic' ? 'active' : ''}
            onClick={() => setSearchType('semantic')}
          >
            🧠 Semantic
          </button>
          <button 
            className={searchType === 'text' ? 'active' : ''}
            onClick={() => setSearchType('text')}
          >
            📝 Text
          </button>
        </div>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchType === 'semantic' 
                ? "Find similar concepts..."
                : "Search exact words..."
            }
            className="search-input"
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <SearchResults 
        results={results} 
        query={query}
        searchType={searchType}
      />
    </div>
  );
}

function SearchResults({ results, query, searchType }) {
  if (results.length === 0) {
    return (
      <div className="search-empty">
        No results found for "{query}"
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h3>
          {searchType === 'semantic' ? 'Similar Concepts' : 'Text Matches'} 
          ({results.length})
        </h3>
      </div>
      
      {results.map(result => (
        <SearchResultCard 
          key={result.id} 
          result={result}
          query={query}
          showSimilarity={searchType === 'semantic'}
        />
      ))}
    </div>
  );
}
```

## 🔍 Advanced Features

### Context Optimization for AI Chat
The vector system optimizes context for AI conversations:

```typescript
// Example context building
const buildChatContext = async (query: string, userId: string) => {
  const relevantChunks = await semanticSearch(query, userId, 10);
  
  let context = '';
  const citations = [];
  let tokenCount = 0;
  const maxTokens = 3000;

  for (const chunk of relevantChunks) {
    const chunkTokens = estimateTokens(chunk.chunkContent);
    
    if (tokenCount + chunkTokens > maxTokens) break;
    
    context += `--- ${chunk.noteTitle}${chunk.heading ? ` > ${chunk.heading}` : ''} ---\n`;
    context += chunk.chunkContent + '\n\n';
    
    citations.push({
      title: chunk.noteTitle,
      heading: chunk.heading
    });
    
    tokenCount += chunkTokens + 20; // +20 for separator tokens
  }
  
  return { context, citations };
};
```

### Embedding Model Configuration
Supports multiple embedding providers:

```typescript
const embeddingConfig = {
  openai: {
    model: 'text-embedding-3-small',
    dimensions: 1536,
    maxTokens: 8191
  },
  fallback: {
    useTextSearch: true,
    keywordWeighting: true,
    semanticApproximation: false
  }
};
```

### Performance Optimizations

**Chunking Strategy:**
- Smart boundary detection (sentence/paragraph breaks)
- Heading context preservation
- Overlap optimization for continuity
- Minimum chunk size filtering (>20 characters)

**Search Performance:**
- Vector similarity computed using cosine distance
- Result ranking combines multiple signals
- Caching of frequent queries
- Background pre-processing of new content

## ❌ Common Issues & Solutions

### Issue: "No embeddings available"
**Cause**: OpenAI API key not configured or invalid
**Solution**: 
1. Check `OPENAI_API_KEY` in environment
2. Verify API key format (starts with `sk-`)
3. System automatically falls back to text search

### Issue: Poor search relevance
**Cause**: Insufficient content for embeddings
**Solution**:
1. Ensure notes have substantial content (>100 words)
2. Use descriptive headings and structure
3. Consider manual keyword tagging

### Issue: Slow search response
**Cause**: Large number of chunks to process
**Solution**:
1. Implement result caching
2. Use pagination for large result sets
3. Consider background pre-computation

## 🔄 Integration with Other Systems

### Chat System Integration
```typescript
// Chat service using vector context
export class ChatService {
  async generateResponse(query: string, userId: string) {
    // Get relevant context from vectors
    const { context, citations } = await this.vectorsService.buildChatContext(
      query, userId, 3000
    );
    
    // Build AI prompt with context
    const systemPrompt = this.buildSystemPrompt();
    const fullPrompt = context.trim()
      ? `${systemPrompt}\n\nContext: ${context}\n\nQuery: ${query}`
      : `${systemPrompt}\n\nQuery: ${query}`;
    
    // Stream AI response
    return this.streamAIResponse(fullPrompt, citations);
  }
}
```

### Notes Processing Pipeline
```typescript
// Automatic processing when notes change
export class NotesService {
  async updateNote(id: string, updates: UpdateNoteDto, userId: string) {
    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: updates
    });
    
    // Reprocess for vectors if content changed
    if (updates.content) {
      await this.vectorsService.processNoteForRAG(id, userId);
    }
    
    return updatedNote;
  }
}
```

---

**Next:** [AI Chat API](./06-chat.md)
