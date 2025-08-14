# Notes Management API

Core note CRUD operations with advanced search and RAG processing.

## 📋 Overview

The notes system is the heart of the AI Notes application. It provides comprehensive note management with markdown support, tagging, search capabilities, and automatic AI processing for semantic search and chat integration.

### Features
- ✅ Full CRUD operations for notes
- ✅ Markdown content support
- ✅ Tag-based organization
- ✅ Advanced search capabilities
- ✅ Automatic RAG processing for AI chat
- ✅ Workspace-scoped organization
- ✅ Soft deletion for data safety

## 🔐 Endpoints

### GET /notes

Get all notes for the authenticated user with optional filtering.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `workspaceId` (string, optional) - Filter by workspace ID
- `limit` (number, optional) - Limit number of results

**Success Response (200):**
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

**Frontend Integration:**
```typescript
// services/notesService.ts
export async function getNotes(options: {
  workspaceId?: string;
  limit?: number;
} = {}) {
  const token = localStorage.getItem('auth_token');
  const params = new URLSearchParams();
  
  if (options.workspaceId) params.append('workspaceId', options.workspaceId);
  if (options.limit) params.append('limit', options.limit.toString());
  
  const url = params.toString() ? `/api/notes?${params}` : '/api/notes';
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }

  return response.json();
}

// React component
export function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  useEffect(() => {
    getNotes({ 
      workspaceId: selectedWorkspace?.id,
      limit: 50 
    })
      .then(setNotes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedWorkspace]);

  if (loading) return <div>Loading notes...</div>;

  return (
    <div className="notes-list">
      {notes.length === 0 ? (
        <div className="empty-state">No notes found. Create your first note!</div>
      ) : (
        notes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))
      )}
    </div>
  );
}
```

---

### POST /notes

Create a new note.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Note Title",
  "content": "# Note Content\n\nMarkdown formatted content here...",
  "tags": ["tag1", "tag2"],
  "workspaceId": "cm4workspace123"
}
```

**Validation Rules:**
- `title`: Required string, 1-200 characters
- `content`: Required string, no length limit
- `tags`: Array of strings, each tag 1-50 characters
- `workspaceId`: Required string, must be valid workspace owned by user

**Success Response (201):**
```json
{
  "id": "cm4note456",
  "title": "New Note Title",
  "content": "# Note Content\n\nMarkdown formatted content here...",
  "tags": ["tag1", "tag2"],
  "workspaceId": "cm4workspace123",
  "ownerId": "cm4user123",
  "isDeleted": false,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z",
  "workspace": {
    "id": "cm4workspace123",
    "name": "My Workspace"
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "message": [
    "title should not be empty",
    "title must be shorter than or equal to 200 characters",
    "content should not be empty"
  ],
  "error": "Bad Request",
  "statusCode": 400
}

// 404 - Workspace Not Found
{
  "message": "Workspace not found or not owned by user",
  "error": "Not Found",
  "statusCode": 404
}
```

**Frontend Integration:**
```typescript
// services/notesService.ts
export async function createNote(noteData: {
  title: string;
  content: string;
  tags: string[];
  workspaceId: string;
}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(noteData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create note');
  }

  return response.json();
}

// React form component
export function CreateNoteForm({ defaultWorkspaceId, onNoteCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    workspaceId: defaultWorkspaceId || ''
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.workspaceId) return;

    setLoading(true);
    try {
      const note = await createNote(formData);
      onNoteCreated(note);
      setFormData({ title: '', content: '', tags: [], workspaceId: defaultWorkspaceId });
      toast.success('Note created successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
    setTagInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="create-note-form">
      <input
        type="text"
        placeholder="Note title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      
      <textarea
        placeholder="Write your note in markdown..."
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        rows={10}
        required
      />
      
      <div className="tags-input">
        <input
          type="text"
          placeholder="Add tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
        />
        <div className="tags-list">
          {formData.tags.map(tag => (
            <span key={tag} className="tag">
              {tag}
              <button onClick={() => setFormData({ 
                ...formData, 
                tags: formData.tags.filter(t => t !== tag) 
              })}>×</button>
            </span>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Note'}
      </button>
    </form>
  );
}
```

---

### GET /notes/:id

Get a specific note by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Note ID

**Success Response (200):**
```json
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
```

**Error Responses:**
```json
// 404 - Note Not Found
{
  "message": "Note not found",
  "error": "Not Found",
  "statusCode": 404
}

// 401 - Unauthorized
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Frontend Integration:**
```typescript
// services/notesService.ts
export async function getNoteById(noteId: string) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`/api/notes/${noteId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Note not found');
    }
    throw new Error('Failed to fetch note');
  }

  return response.json();
}

// React component
export function NoteDetail({ noteId }) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!noteId) return;

    getNoteById(noteId)
      .then(setNote)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [noteId]);

  if (loading) return <div>Loading note...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!note) return <div>Note not found</div>;

  return (
    <div className="note-detail">
      <header>
        <h1>{note.title}</h1>
        <div className="note-meta">
          <span>Workspace: {note.workspace.name}</span>
          <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
        <div className="tags">
          {note.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </header>
      
      <div className="note-content">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </div>
  );
}
```

---

### PATCH /notes/:id

Update an existing note.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `id` (string) - Note ID

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["new", "tags"]
}
```

**Success Response (200):**
```json
{
  "id": "cm4note123",
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["new", "tags"],
  "workspaceId": "cm4workspace123",
  "ownerId": "cm4user123",
  "isDeleted": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T15:45:00.000Z",
  "workspace": {
    "id": "cm4workspace123",
    "name": "My Workspace"
  }
}
```

**Error Responses:**
```json
// 404 - Note Not Found
{
  "message": "Note not found",
  "error": "Not Found",
  "statusCode": 404
}

// 400 - Validation Error
{
  "message": ["title must be shorter than or equal to 200 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

**Frontend Integration:**
```typescript
// services/notesService.ts
export async function updateNote(noteId: string, updates: {
  title?: string;
  content?: string;
  tags?: string[];
}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`/api/notes/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update note');
  }

  return response.json();
}

// React edit component
export function EditNoteForm({ note, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: note.title,
    content: note.content,
    tags: [...note.tags]
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = 
      formData.title !== note.title ||
      formData.content !== note.content ||
      JSON.stringify(formData.tags) !== JSON.stringify(note.tags);
    setHasChanges(changed);
  }, [formData, note]);

  const handleSave = async () => {
    if (!hasChanges) return;

    setLoading(true);
    try {
      const updatedNote = await updateNote(note.id, formData);
      onSave(updatedNote);
      toast.success('Note updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-note-form">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Note title"
      />
      
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        placeholder="Note content"
        rows={15}
      />
      
      <div className="form-actions">
        <button onClick={onCancel}>Cancel</button>
        <button 
          onClick={handleSave} 
          disabled={loading || !hasChanges}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
```

---

### DELETE /notes/:id

Soft delete a note (marks as deleted but doesn't remove from database).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Note ID

**Success Response (204):**
No content returned.

**Error Response (404):**
```json
{
  "message": "Note not found",
  "error": "Not Found",
  "statusCode": 404
}
```

**Frontend Integration:**
```typescript
// services/notesService.ts
export async function deleteNote(noteId: string) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`/api/notes/${noteId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Note not found');
    }
    throw new Error('Failed to delete note');
  }
}

// React component with delete confirmation
export function DeleteNoteButton({ note, onDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteNote(note.id);
      onDeleted(note.id);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="delete-confirm">
        <p>Delete "{note.title}"?</p>
        <button onClick={() => setShowConfirm(false)}>Cancel</button>
        <button onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowConfirm(true)}
      className="delete-button"
    >
      Delete
    </button>
  );
}
```

---

### GET /notes/search

Search notes by query string with advanced filtering.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `q` (string, required) - Search query
- `limit` (number, optional, default: 10, max: 100) - Results limit

**Success Response (200):**
```json
[
  {
    "id": "cm4note123",
    "title": "React Development Guide",
    "content": "# React Development\n\nReact is a JavaScript library...",
    "tags": ["react", "javascript", "development"],
    "workspaceId": "cm4workspace123",
    "ownerId": "cm4user123",
    "isDeleted": false,
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z",
    "workspace": {
      "id": "cm4workspace123",
      "name": "Development Notes"
    }
  }
]
```

**Frontend Integration:**
```typescript
// services/notesService.ts
export async function searchNotes(query: string, limit: number = 10) {
  const token = localStorage.getItem('auth_token');
  const params = new URLSearchParams({
    q: query,
    limit: limit.toString()
  });
  
  const response = await fetch(`/api/notes/search?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  return response.json();
}

// React search component
export function NotesSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await searchNotes(query.trim());
      setResults(searchResults);
      setHasSearched(true);
    } catch (error) {
      toast.error('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notes-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your notes..."
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {hasSearched && (
        <div className="search-results">
          <h3>Search Results ({results.length})</h3>
          {results.length === 0 ? (
            <p>No notes found matching "{query}"</p>
          ) : (
            results.map(note => (
              <SearchResultCard key={note.id} note={note} query={query} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

---

### POST /notes/:id/process-rag

Process note for RAG (Retrieval-Augmented Generation) to enable AI chat functionality.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (string) - Note ID

**Success Response (202):**
```json
{
  "message": "Processing started"
}
```

**Background Processing:**
This endpoint triggers background processing that:
1. Chunks the note content into smaller pieces
2. Generates vector embeddings using OpenAI
3. Stores vectors in database for semantic search
4. Makes the note available for AI chat queries

**Frontend Integration:**
```typescript
// services/notesService.ts
export async function processNoteForRAG(noteId: string) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`/api/notes/${noteId}/process-rag`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to process note for AI chat');
  }

  return response.json();
}

// React component with processing status
export function ProcessRAGButton({ noteId }) {
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleProcess = async () => {
    setProcessing(true);
    try {
      await processNoteForRAG(noteId);
      setProcessed(true);
      toast.success('Note is being processed for AI chat');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleProcess} 
      disabled={processing || processed}
    >
      {processing ? 'Processing...' : processed ? 'Processed ✓' : 'Enable AI Chat'}
    </button>
  );
}
```

## 🔧 Advanced Features

### Automatic RAG Processing
Notes are automatically processed for RAG when:
- Created (in background)
- Updated with content changes
- Manually triggered via endpoint

### Search Capabilities
The search endpoint supports:
- **Title matching**: Direct matches in note titles
- **Content search**: Full-text search in note content
- **Tag filtering**: Search within note tags
- **Case-insensitive**: All searches ignore case
- **Partial matching**: Supports substring matches

### Background Processing
Notes trigger several background processes:
- **Vector embedding**: For semantic search
- **Auto-categorization**: Smart category assignment
- **RAG preparation**: For AI chat integration

## 🧪 Testing Examples

### Manual Testing with cURL

**Create note:**
```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Note",
    "content": "This is a test note with **markdown**",
    "tags": ["test", "markdown"],
    "workspaceId": "YOUR_WORKSPACE_ID"
  }'
```

**Search notes:**
```bash
curl -X GET "http://localhost:3001/api/notes/search?q=markdown&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update note:**
```bash
curl -X PATCH http://localhost:3001/api/notes/NOTE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### Complete React Notes Manager
```tsx
// components/NotesManager.tsx
export function NotesManager() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'detail', 'edit', 'create'
  const [searchQuery, setSearchQuery] = useState('');

  const refreshNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      toast.error('Failed to load notes');
    }
  };

  useEffect(() => {
    refreshNotes();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      await refreshNotes();
      return;
    }
    
    try {
      const results = await searchNotes(query);
      setNotes(results);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  return (
    <div className="notes-manager">
      <div className="notes-sidebar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />
        </div>
        
        <button 
          onClick={() => setView('create')}
          className="create-note-button"
        >
          + New Note
        </button>

        <div className="notes-list">
          {notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedNote(note);
                setView('detail');
              }}
            >
              <h4>{note.title}</h4>
              <p>{note.content.substring(0, 100)}...</p>
              <div className="note-meta">
                {note.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="notes-main">
        {view === 'create' && (
          <CreateNoteForm
            onNoteCreated={(note) => {
              setNotes([note, ...notes]);
              setSelectedNote(note);
              setView('detail');
            }}
          />
        )}
        
        {view === 'detail' && selectedNote && (
          <NoteDetail
            note={selectedNote}
            onEdit={() => setView('edit')}
            onDelete={() => {
              setNotes(notes.filter(n => n.id !== selectedNote.id));
              setSelectedNote(null);
              setView('list');
            }}
          />
        )}
        
        {view === 'edit' && selectedNote && (
          <EditNoteForm
            note={selectedNote}
            onSave={(updatedNote) => {
              setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
              setSelectedNote(updatedNote);
              setView('detail');
            }}
            onCancel={() => setView('detail')}
          />
        )}
      </div>
    </div>
  );
}
```

---

**Next:** [Vector Search & RAG API](./05-vectors.md)
