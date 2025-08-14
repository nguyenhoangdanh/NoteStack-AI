# Workspaces Management API

Workspace organization system for grouping and managing notes.

## 📋 Overview

Workspaces provide a way to organize notes into separate contexts (work, personal, projects, etc.). Each user has a default workspace created automatically, and can create additional workspaces as needed.

### Features
- ✅ Default workspace creation on user registration
- ✅ Multiple workspace support
- ✅ Workspace-scoped note organization
- ✅ Simple workspace management

## 🔐 Endpoints

### GET /workspaces

Get all workspaces for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
[
  {
    "id": "cm4workspace123",
    "name": "My Workspace",
    "ownerId": "cm4user123",
    "isDefault": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "cm4workspace456",
    "name": "Work Projects",
    "ownerId": "cm4user123",
    "isDefault": false,
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-10T09:00:00.000Z"
  }
]
```

**Error Response (401):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Frontend Integration:**
```typescript
// services/workspaceService.ts
export async function getWorkspaces() {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/workspaces', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch workspaces');
  }

  return response.json();
}

// React component
export function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkspaces()
      .then(setWorkspaces)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading workspaces...</div>;

  return (
    <div className="workspace-list">
      {workspaces.map(workspace => (
        <div key={workspace.id} className="workspace-item">
          <h3>{workspace.name}</h3>
          {workspace.isDefault && <span className="badge">Default</span>}
          <small>Created: {new Date(workspace.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
```

---

### GET /workspaces/default

Get the user's default workspace.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "id": "cm4workspace123",
  "name": "My Workspace",
  "ownerId": "cm4user123",
  "isDefault": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (204) - No Default Workspace:**
```json
null
```

**Error Response (401):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Frontend Integration:**
```typescript
// services/workspaceService.ts
export async function getDefaultWorkspace() {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/workspaces/default', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch default workspace');
  }

  return response.json();
}

// Usage in notes creation
export function useDefaultWorkspace() {
  const [defaultWorkspace, setDefaultWorkspace] = useState(null);

  useEffect(() => {
    getDefaultWorkspace().then(setDefaultWorkspace);
  }, []);

  return defaultWorkspace;
}

// In CreateNoteForm component
export function CreateNoteForm() {
  const defaultWorkspace = useDefaultWorkspace();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    workspaceId: defaultWorkspace?.id || ''
  });

  useEffect(() => {
    if (defaultWorkspace) {
      setFormData(prev => ({ ...prev, workspaceId: defaultWorkspace.id }));
    }
  }, [defaultWorkspace]);

  // ... rest of form logic
}
```

---

### POST /workspaces

Create a new workspace.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Project Workspace"
}
```

**Validation Rules:**
- `name`: Required string, 1-100 characters, must be unique per user

**Success Response (201):**
```json
{
  "id": "cm4workspace789",
  "name": "New Project Workspace",
  "ownerId": "cm4user123",
  "isDefault": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "message": ["name should not be empty", "name must be shorter than or equal to 100 characters"],
  "error": "Bad Request",
  "statusCode": 400
}

// 409 - Duplicate Name (if implemented)
{
  "message": "Workspace with this name already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

**Frontend Integration:**
```typescript
// services/workspaceService.ts
export async function createWorkspace(name: string) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/workspaces', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create workspace');
  }

  return response.json();
}

// React form component
export function CreateWorkspaceForm({ onWorkspaceCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const workspace = await createWorkspace(name.trim());
      onWorkspaceCreated(workspace);
      setName('');
      toast.success('Workspace created successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-workspace-form">
      <div className="form-group">
        <label htmlFor="workspace-name">Workspace Name</label>
        <input
          id="workspace-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter workspace name"
          maxLength={100}
          required
        />
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <button type="submit" disabled={loading || !name.trim()}>
        {loading ? 'Creating...' : 'Create Workspace'}
      </button>
    </form>
  );
}
```

## 🔧 Workspace Management

### Automatic Default Workspace
- Created automatically when user registers
- Named "My Workspace" by default
- Cannot be deleted (though this could be implemented)
- Used as fallback when no workspace is specified

### Workspace Selection
```typescript
// hooks/useWorkspace.ts
export function useWorkspaceSelection() {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const data = await getWorkspaces();
        setWorkspaces(data);
        
        // Select default workspace initially
        const defaultWs = data.find(ws => ws.isDefault);
        if (defaultWs) {
          setSelectedWorkspace(defaultWs);
        }
      } catch (error) {
        console.error('Failed to load workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();
  }, []);

  return {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    loading
  };
}

// Workspace selector component
export function WorkspaceSelector({ value, onChange }) {
  const { workspaces, loading } = useWorkspaceSelection();

  if (loading) return <div>Loading workspaces...</div>;

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select workspace...</option>
      {workspaces.map(workspace => (
        <option key={workspace.id} value={workspace.id}>
          {workspace.name} {workspace.isDefault ? '(Default)' : ''}
        </option>
      ))}
    </select>
  );
}
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Get workspaces:**
```bash
curl -X GET http://localhost:3001/api/workspaces \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get default workspace:**
```bash
curl -X GET http://localhost:3001/api/workspaces/default \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create workspace:**
```bash
curl -X POST http://localhost:3001/api/workspaces \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Workspace"}'
```

### React Testing Component
```tsx
// components/WorkspaceTest.tsx
export function WorkspaceTest() {
  const [workspaces, setWorkspaces] = useState([]);
  const [result, setResult] = useState('');

  const testGetWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data);
      setResult(`Success: Found ${data.length} workspaces`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const testCreateWorkspace = async () => {
    try {
      const workspace = await createWorkspace(`Test Workspace ${Date.now()}`);
      setResult(`Created: ${workspace.name} (ID: ${workspace.id})`);
      // Refresh list
      testGetWorkspaces();
    } catch (error) {
      setResult(`Create Error: ${error.message}`);
    }
  };

  const testGetDefault = async () => {
    try {
      const defaultWs = await getDefaultWorkspace();
      setResult(`Default: ${defaultWs?.name || 'None found'}`);
    } catch (error) {
      setResult(`Default Error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={testGetWorkspaces}>Test Get Workspaces</button>
      <button onClick={testCreateWorkspace}>Test Create Workspace</button>
      <button onClick={testGetDefault}>Test Get Default</button>
      <pre>{result}</pre>
    </div>
  );
}
```

## 🔍 Integration with Notes

### Workspace Filtering
```typescript
// In notes list component
export function NotesList() {
  const [notes, setNotes] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      const params = new URLSearchParams();
      if (selectedWorkspace) {
        params.append('workspaceId', selectedWorkspace.id);
      }
      
      const response = await fetch(`/api/notes?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setNotes(await response.json());
    };

    loadNotes();
  }, [selectedWorkspace]);

  return (
    <div>
      <WorkspaceSelector 
        value={selectedWorkspace?.id || ''} 
        onChange={(id) => {
          const workspace = workspaces.find(w => w.id === id);
          setSelectedWorkspace(workspace);
        }}
      />
      
      {notes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
```

## ❌ Common Errors and Solutions

### Error: "Failed to fetch workspaces"
**Cause:** Network error or authentication issue
**Solution:** Check token validity and network connection

### Error: "Workspace name is required"
**Cause:** Empty or missing name in creation request
**Solution:** Validate input on frontend before submission

### Error: "Workspace with this name already exists"
**Cause:** Duplicate workspace name (if uniqueness is enforced)
**Solution:** Suggest alternative names or allow duplicates

## 🔄 Workspace Data Flow

### Initial Load
1. User logs in → Get workspaces list
2. Identify default workspace
3. Use default for new notes
4. Allow workspace switching

### Workspace Context
```typescript
// context/WorkspaceContext.tsx
const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  useEffect(() => {
    getWorkspaces().then(data => {
      setWorkspaces(data);
      const defaultWs = data.find(w => w.isDefault);
      setCurrentWorkspace(defaultWs);
    });
  }, []);

  const createNewWorkspace = async (name) => {
    const workspace = await createWorkspace(name);
    setWorkspaces([...workspaces, workspace]);
    return workspace;
  };

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      currentWorkspace,
      setCurrentWorkspace,
      createNewWorkspace
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
```

## 🎯 Future Enhancements

### Planned Features
- Workspace update/rename functionality
- Workspace deletion with note migration
- Workspace sharing and collaboration
- Workspace templates and presets
- Bulk note movement between workspaces

### Advanced Features
- Workspace-specific settings and preferences
- Workspace analytics and insights
- Import/export workspace data
- Workspace search and filtering

---

**Next:** [Notes Management API](./04-notes.md)
