# Duplicates Detection API

Smart duplicate detection system with AI-powered similarity analysis and merging capabilities.

## 📋 Overview

The duplicates detection system identifies potential duplicate notes using content analysis, semantic similarity, and title matching. It provides merge suggestions and handles conflict resolution for duplicate content.

### Features
- ✅ Multi-method duplicate detection (content, title, semantic)
- ✅ Configurable similarity thresholds
- ✅ Duplicate reports with confidence scoring
- ✅ Smart merging with conflict resolution
- ✅ Background processing for large datasets
- ✅ Manual duplicate reporting and management

## 🔐 Endpoints

### GET /duplicates/detect

Detect duplicate notes for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `noteId` (string, optional) - Check specific note for duplicates
- `threshold` (number, optional, default: 0.7) - Similarity threshold (0-1)
- `type` (string, optional) - Detection type: `CONTENT`, `TITLE`, `SEMANTIC`, `ALL`

**Success Response (200):**
```json
[
  {
    "id": "cm4dup123",
    "originalNoteId": "cm4note123",
    "duplicateNoteId": "cm4note456",
    "similarity": 0.87,
    "type": "CONTENT",
    "status": "PENDING",
    "ownerId": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "resolvedAt": null,
    "originalNote": {
      "id": "cm4note123",
      "title": "React Hooks Guide",
      "content": "React hooks are functions that let you use state and lifecycle features...",
      "tags": ["react", "javascript"],
      "createdAt": "2024-01-10T09:00:00.000Z"
    },
    "duplicateNote": {
      "id": "cm4note456", 
      "title": "React Hooks Tutorial",
      "content": "Hooks in React allow you to use state and lifecycle methods...",
      "tags": ["react", "hooks"],
      "createdAt": "2024-01-12T14:30:00.000Z"
    },
    "suggestedAction": "MERGE",
    "analysisDetails": {
      "contentSimilarity": 0.89,
      "titleSimilarity": 0.83,
      "tagOverlap": 0.5,
      "semanticSimilarity": 0.91
    }
  }
]
```

**Response Fields:**
- `type`: Detection method (`CONTENT`, `TITLE`, `SEMANTIC`)
- `similarity`: Overall similarity score (0-1)
- `suggestedAction`: `MERGE` (>0.9), `REVIEW` (0.7-0.9), `KEEP_SEPARATE` (<0.7)
- `analysisDetails`: Breakdown of similarity factors
- `status`: `PENDING`, `CONFIRMED`, `DISMISSED`, `MERGED`

**Frontend Integration:**
```typescript
// services/duplicatesService.ts
export async function detectDuplicates(options: {
  noteId?: string;
  threshold?: number;
  type?: 'CONTENT' | 'TITLE' | 'SEMANTIC' | 'ALL';
} = {}) {
  const token = localStorage.getItem('auth_token');
  const params = new URLSearchParams();
  
  if (options.noteId) params.append('noteId', options.noteId);
  if (options.threshold) params.append('threshold', options.threshold.toString());
  if (options.type) params.append('type', options.type);
  
  const url = params.toString() ? `/api/duplicates/detect?${params}` : '/api/duplicates/detect';
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to detect duplicates');
  }

  return response.json();
}

// React component for duplicates detection
export function DuplicatesDetection() {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState(0.7);
  const [detectionType, setDetectionType] = useState('ALL');

  const runDetection = async () => {
    setLoading(true);
    try {
      const results = await detectDuplicates({
        threshold,
        type: detectionType as any
      });
      setDuplicates(results);
      
      if (results.length === 0) {
        toast.success('No duplicates found!');
      } else {
        toast.info(`Found ${results.length} potential duplicates`);
      }
    } catch (error) {
      toast.error('Duplicate detection failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="duplicates-detection">
      <div className="detection-controls">
        <h2>Duplicate Detection</h2>
        
        <div className="controls-row">
          <div className="threshold-control">
            <label>
              Similarity Threshold: {Math.round(threshold * 100)}%
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
              />
            </label>
          </div>
          
          <div className="type-control">
            <label>
              Detection Method:
              <select 
                value={detectionType}
                onChange={(e) => setDetectionType(e.target.value)}
              >
                <option value="ALL">All Methods</option>
                <option value="CONTENT">Content Similarity</option>
                <option value="TITLE">Title Similarity</option>
                <option value="SEMANTIC">Semantic Analysis</option>
              </select>
            </label>
          </div>
          
          <button 
            onClick={runDetection}
            disabled={loading}
            className="run-detection-btn"
          >
            {loading ? '🔍 Scanning...' : '🔍 Find Duplicates'}
          </button>
        </div>
      </div>

      {duplicates.length > 0 && (
        <div className="duplicates-results">
          <h3>Potential Duplicates ({duplicates.length})</h3>
          {duplicates.map(duplicate => (
            <DuplicateCard 
              key={duplicate.id} 
              duplicate={duplicate}
              onResolved={runDetection}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### POST /duplicates/merge

Merge two duplicate notes into one.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "originalNoteId": "cm4note123",
  "duplicateNoteId": "cm4note456",
  "mergeStrategy": "APPEND",
  "keepTitle": "ORIGINAL",
  "mergeTags": true
}
```

**Merge Strategies:**
- `REPLACE`: Replace original with duplicate content
- `APPEND`: Append duplicate content to original
- `PREPEND`: Prepend duplicate content to original
- `MANUAL`: Custom merge (requires `customContent`)

**Success Response (200):**
```json
{
  "mergedNote": {
    "id": "cm4note123",
    "title": "React Hooks Guide",
    "content": "React hooks are functions that let you use state and lifecycle features...\n\n---\n\n## From: React Hooks Tutorial\n\nHooks in React allow you to use state and lifecycle methods...",
    "tags": ["react", "javascript", "hooks", "tutorial"],
    "workspaceId": "cm4workspace123",
    "ownerId": "cm4user123",
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "deletedNoteId": "cm4note456",
  "mergeDetails": {
    "strategy": "APPEND",
    "originalLength": 245,
    "duplicateLength": 189,
    "mergedLength": 456,
    "tagsAdded": ["hooks", "tutorial"],
    "timestamp": "2024-01-15T12:00:00.000Z"
  }
}
```

**Frontend Integration:**
```typescript
// services/duplicatesService.ts
export async function mergeDuplicates(mergeData: {
  originalNoteId: string;
  duplicateNoteId: string;
  mergeStrategy?: 'REPLACE' | 'APPEND' | 'PREPEND' | 'MANUAL';
  keepTitle?: 'ORIGINAL' | 'DUPLICATE' | 'CUSTOM';
  customTitle?: string;
  customContent?: string;
  mergeTags?: boolean;
}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/duplicates/merge', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mergeData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to merge notes');
  }

  return response.json();
}

// React component for merge dialog
export function MergeDialog({ duplicate, onMerged, onCancel }) {
  const [mergeStrategy, setMergeStrategy] = useState('APPEND');
  const [keepTitle, setKeepTitle] = useState('ORIGINAL');
  const [customTitle, setCustomTitle] = useState('');
  const [mergeTags, setMergeTags] = useState(true);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const generatePreview = () => {
    const { originalNote, duplicateNote } = duplicate;
    let previewContent = '';
    
    switch (mergeStrategy) {
      case 'REPLACE':
        previewContent = duplicateNote.content;
        break;
      case 'APPEND':
        previewContent = originalNote.content + '\n\n---\n\n## From: ' + duplicateNote.title + '\n\n' + duplicateNote.content;
        break;
      case 'PREPEND':
        previewContent = '## From: ' + duplicateNote.title + '\n\n' + duplicateNote.content + '\n\n---\n\n' + originalNote.content;
        break;
      default:
        previewContent = originalNote.content;
    }
    
    setPreview(previewContent);
  };

  useEffect(() => {
    generatePreview();
  }, [mergeStrategy, duplicate]);

  const handleMerge = async () => {
    setLoading(true);
    try {
      const result = await mergeDuplicates({
        originalNoteId: duplicate.originalNoteId,
        duplicateNoteId: duplicate.duplicateNoteId,
        mergeStrategy: mergeStrategy as any,
        keepTitle: keepTitle as any,
        customTitle: keepTitle === 'CUSTOM' ? customTitle : undefined,
        mergeTags
      });
      
      onMerged(result);
      toast.success('Notes merged successfully!');
    } catch (error) {
      toast.error('Merge failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-dialog">
      <div className="merge-dialog-header">
        <h3>Merge Duplicate Notes</h3>
        <button onClick={onCancel} className="close-btn">×</button>
      </div>

      <div className="merge-options">
        <div className="option-group">
          <label>Merge Strategy:</label>
          <select 
            value={mergeStrategy}
            onChange={(e) => setMergeStrategy(e.target.value)}
          >
            <option value="APPEND">Append duplicate to original</option>
            <option value="PREPEND">Prepend duplicate to original</option>
            <option value="REPLACE">Replace original with duplicate</option>
          </select>
        </div>

        <div className="option-group">
          <label>Keep Title:</label>
          <select 
            value={keepTitle}
            onChange={(e) => setKeepTitle(e.target.value)}
          >
            <option value="ORIGINAL">Keep original title</option>
            <option value="DUPLICATE">Use duplicate title</option>
            <option value="CUSTOM">Custom title</option>
          </select>
          
          {keepTitle === 'CUSTOM' && (
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter custom title"
            />
          )}
        </div>

        <div className="option-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={mergeTags}
              onChange={(e) => setMergeTags(e.target.checked)}
            />
            Merge tags from both notes
          </label>
        </div>
      </div>

      <div className="merge-preview">
        <h4>Preview Result:</h4>
        <div className="preview-content">
          <h5>
            {keepTitle === 'ORIGINAL' ? duplicate.originalNote.title :
             keepTitle === 'DUPLICATE' ? duplicate.duplicateNote.title :
             customTitle || 'Merged Note'}
          </h5>
          <div className="content-preview">
            {preview.substring(0, 500)}
            {preview.length > 500 && '...'}
          </div>
          
          {mergeTags && (
            <div className="tags-preview">
              Tags: {[...new Set([
                ...duplicate.originalNote.tags,
                ...duplicate.duplicateNote.tags
              ])].join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="merge-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button 
          onClick={handleMerge}
          disabled={loading}
          className="merge-btn"
        >
          {loading ? 'Merging...' : '🔗 Merge Notes'}
        </button>
      </div>
    </div>
  );
}
```

---

### GET /duplicates/reports

Get existing duplicate reports with filtering options.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status` (string, optional) - Filter by status: `PENDING`, `CONFIRMED`, `DISMISSED`, `MERGED`
- `type` (string, optional) - Filter by detection type
- `limit` (number, optional, default: 20) - Results limit

**Success Response (200):**
```json
[
  {
    "id": "cm4dup123",
    "originalNoteId": "cm4note123",
    "duplicateNoteId": "cm4note456",
    "similarity": 0.87,
    "type": "CONTENT",
    "status": "CONFIRMED",
    "ownerId": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "resolvedAt": "2024-01-15T14:20:00.000Z",
    "originalNote": {
      "id": "cm4note123",
      "title": "React Hooks Guide",
      "content": "React hooks are functions...",
      "tags": ["react", "javascript"]
    },
    "duplicateNote": {
      "id": "cm4note456",
      "title": "React Hooks Tutorial", 
      "content": "Hooks in React allow...",
      "tags": ["react", "hooks"]
    }
  }
]
```

---

### PATCH /duplicates/reports/:id

Update duplicate report status.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `id` (string) - Duplicate report ID

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Status Values:**
- `CONFIRMED` - User confirmed they are duplicates
- `DISMISSED` - User dismissed as not duplicates  
- `MERGED` - Notes have been merged (set automatically)

**Success Response (200):**
```json
{
  "id": "cm4dup123",
  "originalNoteId": "cm4note123", 
  "duplicateNoteId": "cm4note456",
  "similarity": 0.87,
  "type": "CONTENT",
  "status": "CONFIRMED",
  "ownerId": "cm4user123",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "resolvedAt": "2024-01-15T15:30:00.000Z"
}
```

---

### POST /duplicates/queue-detection

Queue background duplicate detection job for all notes.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "threshold": 0.75,
  "includeTypes": ["CONTENT", "SEMANTIC"]
}
```

**Success Response (202):**
```json
{
  "message": "Duplicate detection queued",
  "jobId": "job_cm4detection123",
  "estimatedDuration": "2-5 minutes",
  "notesToProcess": 156
}
```

**Frontend Integration:**
```typescript
// services/duplicatesService.ts
export async function queueDuplicateDetection(options: {
  threshold?: number;
  includeTypes?: string[];
}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/duplicates/queue-detection', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  });

  if (!response.ok) {
    throw new Error('Failed to queue duplicate detection');
  }

  return response.json();
}

// React component for background detection
export function BackgroundDetection() {
  const [detecting, setDetecting] = useState(false);
  const [progress, setProgress] = useState(0);

  const runBackgroundDetection = async () => {
    setDetecting(true);
    setProgress(0);
    
    try {
      const result = await queueDuplicateDetection({
        threshold: 0.75,
        includeTypes: ['CONTENT', 'SEMANTIC']
      });
      
      toast.success(`Detection queued for ${result.notesToProcess} notes`);
      
      // Poll for progress (simplified)
      const pollProgress = setInterval(async () => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(pollProgress);
            setDetecting(false);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to start detection: ' + error.message);
      setDetecting(false);
    }
  };

  return (
    <div className="background-detection">
      <h3>Background Duplicate Detection</h3>
      <p>Scan all your notes for potential duplicates</p>
      
      {detecting && (
        <div className="detection-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{progress}% complete</span>
        </div>
      )}
      
      <button 
        onClick={runBackgroundDetection}
        disabled={detecting}
        className="start-detection-btn"
      >
        {detecting ? '⏳ Detecting...' : '🚀 Start Background Scan'}
      </button>
    </div>
  );
}
```

## 🔧 Duplicate Detection Algorithm

### Detection Methods

1. **Content Similarity**
   - Uses Jaccard similarity for text comparison
   - Analyzes sentence structure and word order
   - Removes common words and focuses on meaningful content
   - Threshold: Content similarity > 0.7

2. **Title Similarity**
   - Levenshtein distance for character-level comparison
   - Fuzzy matching for similar titles with typos
   - Word-based similarity for reordered titles
   - Threshold: Title similarity > 0.8

3. **Semantic Similarity**
   - Vector embeddings using AI models
   - Cosine similarity between note embeddings
   - Understands conceptual similarity beyond exact words
   - Threshold: Semantic similarity > 0.75

4. **Combined Scoring**
   ```typescript
   const duplicateScore = {
     content: contentSimilarity * 0.4,
     title: titleSimilarity * 0.3,
     semantic: semanticSimilarity * 0.2,
     tags: tagOverlap * 0.1
   };
   
   const finalScore = Object.values(duplicateScore).reduce((a, b) => a + b, 0);
   ```

### Smart Merging Features

**Conflict Resolution:**
- Side-by-side content comparison
- Highlighted differences
- User choice for each conflict section
- Automatic tag and metadata merging

**Merge Strategies:**
- **Append**: Keep original structure, add duplicate content as new section
- **Prepend**: Add duplicate content before original
- **Replace**: Use duplicate content entirely
- **Manual**: Custom merge with user control

## 🧪 Testing Examples

### Manual Testing with cURL

**Detect duplicates:**
```bash
curl -X GET "http://localhost:3001/api/duplicates/detect?threshold=0.75&type=ALL" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Merge notes:**
```bash
curl -X POST http://localhost:3001/api/duplicates/merge \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalNoteId": "cm4note123",
    "duplicateNoteId": "cm4note456",
    "mergeStrategy": "APPEND",
    "keepTitle": "ORIGINAL",
    "mergeTags": true
  }'
```

### Complete React Duplicates Manager
```tsx
// components/DuplicatesManager.tsx
export function DuplicatesManager() {
  const [duplicates, setDuplicates] = useState([]);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState(null);
  const [filters, setFilters] = useState({
    status: 'PENDING',
    type: 'ALL',
    threshold: 0.7
  });

  const loadDuplicates = async () => {
    try {
      const results = await detectDuplicates(filters);
      setDuplicates(results);
    } catch (error) {
      toast.error('Failed to load duplicates');
    }
  };

  const handleMergeClick = (duplicate) => {
    setSelectedDuplicate(duplicate);
    setShowMergeDialog(true);
  };

  const handleMergeComplete = (result) => {
    toast.success('Notes merged successfully');
    setShowMergeDialog(false);
    setSelectedDuplicate(null);
    loadDuplicates(); // Refresh list
  };

  const handleDismissDuplicate = async (duplicateId) => {
    try {
      await updateDuplicateStatus(duplicateId, 'DISMISSED');
      toast.success('Duplicate dismissed');
      loadDuplicates();
    } catch (error) {
      toast.error('Failed to dismiss duplicate');
    }
  };

  return (
    <div className="duplicates-manager">
      <div className="duplicates-header">
        <h2>Duplicate Notes Management</h2>
        <DuplicateFilters 
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={loadDuplicates}
        />
      </div>

      <div className="duplicates-content">
        {duplicates.length === 0 ? (
          <EmptyState message="No duplicate notes found" />
        ) : (
          <div className="duplicates-list">
            {duplicates.map(duplicate => (
              <DuplicateCard
                key={duplicate.id}
                duplicate={duplicate}
                onMerge={() => handleMergeClick(duplicate)}
                onDismiss={() => handleDismissDuplicate(duplicate.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showMergeDialog && selectedDuplicate && (
        <MergeDialog
          duplicate={selectedDuplicate}
          onMerged={handleMergeComplete}
          onCancel={() => setShowMergeDialog(false)}
        />
      )}
    </div>
  );
}
```

## ❌ Common Issues and Solutions

### Issue: "Too many false positives"
**Cause:** Threshold set too low
**Solution:** Increase similarity threshold or add more specific keywords

### Issue: "Missing obvious duplicates"
**Cause:** Threshold set too high or different writing styles
**Solution:** Lower threshold and use multiple detection methods

### Issue: "Merge conflicts"
**Cause:** Significant differences in note structure
**Solution:** Use manual merge strategy with side-by-side comparison

### Issue: "Performance issues with large datasets"
**Cause:** Processing many notes simultaneously
**Solution:** Use background queue processing and pagination

## 🎯 Advanced Features

### Batch Operations
```typescript
// Batch merge multiple duplicates
export async function batchMergeDuplicates(mergeRequests: MergeRequest[]) {
  const results = await Promise.all(
    mergeRequests.map(request => mergeDuplicates(request))
  );
  
  return {
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}
```

### Smart Suggestions
```typescript
// AI-powered merge suggestions
export async function getMergeSuggestions(duplicate: Duplicate) {
  const suggestions = await analyzeContent(
    duplicate.originalNote.content,
    duplicate.duplicateNote.content
  );
  
  return {
    recommendedStrategy: suggestions.bestStrategy,
    confidenceScore: suggestions.confidence,
    reasonsToMerge: suggestions.reasons,
    potentialIssues: suggestions.warnings
  };
}
```

### Analytics Dashboard
- Duplicate detection statistics
- Most common duplicate patterns
- User merge behavior analysis
- Content quality improvement suggestions

---

**Next:** [Related Notes Discovery API](./03-relations.md)
