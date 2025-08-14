# Collaboration API

Real-time collaborative editing system with user permissions, invitations, and live presence tracking.

## 📋 Overview

The collaboration system enables multiple users to work on notes simultaneously with real-time synchronization, permission management, and conflict resolution. It provides WebSocket-based live editing with cursor tracking and user presence indicators.

### Features
- ✅ Real-time collaborative editing with operational transforms
- ✅ User permissions (READ/WRITE/ADMIN) with granular access control
- ✅ Live user presence tracking and cursor positions
- ✅ Invitation system via email with role assignment
- ✅ Conflict resolution and merge strategies
- ✅ Activity tracking and collaboration analytics
- ✅ Background notification processing
- ✅ Permission inheritance and cascading

## 🔐 Endpoints

### POST /collaboration/notes/:noteId/invite

Invite a user to collaborate on a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `noteId` (string) - Note ID to invite collaborator to

**Request Body:**
```json
{
  "email": "collaborator@example.com",
  "permission": "WRITE",
  "message": "Would you like to collaborate on this React guide?"
}
```

**Request Fields:**
- `email`: Email address of user to invite (required)
- `permission`: Permission level (`READ`, `WRITE`, `ADMIN`)
- `message`: Optional invitation message (max 500 characters)

**Success Response (201):**
```json
{
  "success": true,
  "collaboration": {
    "id": "cm4collab123",
    "noteId": "cm4note123",
    "userId": "cm4user456",
    "permission": "WRITE",
    "invitedBy": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "user": {
      "id": "cm4user456",
      "email": "collaborator@example.com",
      "name": "Jane Smith",
      "image": "https://avatar.com/jane.jpg"
    },
    "inviter": {
      "id": "cm4user123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "note": {
      "id": "cm4note123",
      "title": "React Development Guide",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  },
  "message": "Invitation sent successfully",
  "emailSent": true
}
```

**Error Responses:**
```json
// 404 - Note not found
{
  "success": false,
  "message": "Note not found or access denied",
  "statusCode": 404
}

// 400 - User not found
{
  "success": false,
  "message": "User with email collaborator@example.com not found",
  "statusCode": 400
}

// 409 - Already collaborating
{
  "success": false,
  "message": "User is already a collaborator on this note",
  "statusCode": 409
}

// 403 - Insufficient permissions
{
  "success": false,
  "message": "Only note owner and admins can invite collaborators",
  "statusCode": 403
}
```

---

### GET /collaboration/notes/:noteId/collaborators

Get all collaborators for a specific note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "collaborators": [
    {
      "id": "cm4collab123",
      "noteId": "cm4note123",
      "userId": "cm4user456",
      "permission": "WRITE",
      "invitedBy": "cm4user123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "id": "cm4user456",
        "email": "collaborator@example.com",
        "name": "Jane Smith",
        "image": "https://avatar.com/jane.jpg"
      },
      "inviter": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "isOnline": true,
      "lastActiveAt": "2024-01-15T11:45:00.000Z"
    }
  ],
  "owner": {
    "id": "cm4user123",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://avatar.com/john.jpg"
  },
  "totalCollaborators": 1,
  "message": "Collaborators retrieved successfully"
}
```

**Response Fields:**
- `isOnline`: Boolean indicating if collaborator is currently active
- `lastActiveAt`: Timestamp of last activity on the note
- `owner`: Original note owner information
- `totalCollaborators`: Count excluding the owner

---

### PATCH /collaboration/:collaborationId/permission

Update collaboration permissions.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `collaborationId` (string) - Collaboration record ID

**Request Body:**
```json
{
  "permission": "ADMIN"
}
```

**Permission Levels:**
- `READ`: View note and comments only
- `WRITE`: Edit note content, add comments
- `ADMIN`: All WRITE permissions plus invite/remove collaborators

**Success Response (200):**
```json
{
  "success": true,
  "collaboration": {
    "id": "cm4collab123",
    "noteId": "cm4note123",
    "userId": "cm4user456",
    "permission": "ADMIN",
    "invitedBy": "cm4user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Permission updated successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Only note owner and admins can modify permissions",
  "statusCode": 403
}
```

---

### DELETE /collaboration/:collaborationId

Remove a collaborator from a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `collaborationId` (string) - Collaboration record ID

**Success Response (204):**
No content returned.

**Error Responses:**
```json
// 403 - Insufficient permissions
{
  "success": false,
  "message": "Only note owner, admins, or the collaborator themselves can remove access",
  "statusCode": 403
}

// 404 - Collaboration not found
{
  "success": false,
  "message": "Collaboration not found",
  "statusCode": 404
}
```

---

### GET /collaboration/my-collaborations

Get all notes the current user is collaborating on.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `permission` (string, optional) - Filter by permission level
- `limit` (number, optional, default: 20) - Maximum results
- `offset` (number, optional) - Pagination offset

**Success Response (200):**
```json
{
  "success": true,
  "collaborations": [
    {
      "id": "cm4collab123",
      "noteId": "cm4note123",
      "permission": "WRITE",
      "invitedBy": "cm4user789",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "note": {
        "id": "cm4note123",
        "title": "React Development Guide",
        "updatedAt": "2024-01-15T11:30:00.000Z",
        "owner": {
          "name": "John Doe",
          "email": "john@example.com",
          "image": "https://avatar.com/john.jpg"
        }
      },
      "inviter": {
        "name": "Alice Johnson",
        "email": "alice@example.com"
      },
      "lastAccessedAt": "2024-01-15T11:45:00.000Z",
      "unreadChanges": true
    }
  ],
  "total": 1,
  "message": "Collaborations retrieved successfully"
}
```

**Response Fields:**
- `unreadChanges`: Boolean indicating if note was updated since last access
- `lastAccessedAt`: When user last viewed/edited this note

---

### GET /collaboration/notes/:noteId/activity

Get collaboration activity history for a note.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Query Parameters:**
- `limit` (number, optional, default: 50) - Maximum activities
- `since` (ISO string, optional) - Activities since timestamp

**Success Response (200):**
```json
{
  "success": true,
  "noteId": "cm4note123",
  "activities": [
    {
      "id": "cm4activity123",
      "action": "CONTENT_EDITED",
      "userId": "cm4user456",
      "noteId": "cm4note123",
      "metadata": {
        "section": "Introduction",
        "wordsAdded": 45,
        "wordsRemoved": 12,
        "changeType": "addition"
      },
      "createdAt": "2024-01-15T11:30:00.000Z",
      "user": {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "image": "https://avatar.com/jane.jpg"
      }
    },
    {
      "id": "cm4activity124",
      "action": "COLLABORATOR_INVITED",
      "userId": "cm4user123",
      "noteId": "cm4note123",
      "metadata": {
        "invitedUser": "bob@example.com",
        "permission": "READ"
      },
      "createdAt": "2024-01-15T10:45:00.000Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "total": 2
}
```

**Activity Types:**
- `CONTENT_EDITED`: Note content was modified
- `COLLABORATOR_INVITED`: New collaborator invited
- `COLLABORATOR_REMOVED`: Collaborator removed
- `PERMISSION_CHANGED`: Permission level updated
- `NOTE_VIEWED`: Collaborator viewed the note
- `COMMENT_ADDED`: Comment added (future feature)

---

### POST /collaboration/notes/:noteId/join-session

Join a real-time collaboration session.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Success Response (200):**
```json
{
  "success": true,
  "sessionId": "session_cm4note123_cm4user456",
  "noteId": "cm4note123",
  "websocketUrl": "wss://api.domain.com/collaboration/ws",
  "sessionToken": "eyJhbGciOiJIUzI1NiIs...",
  "activeUsers": [
    {
      "userId": "cm4user123",
      "name": "John Doe",
      "image": "https://avatar.com/john.jpg",
      "permission": "ADMIN",
      "cursor": {
        "position": 450,
        "selection": { "start": 450, "end": 465 }
      },
      "lastActiveAt": "2024-01-15T11:48:00.000Z"
    }
  ],
  "noteVersion": 15,
  "message": "Joined collaboration session successfully"
}
```

**Response Fields:**
- `sessionToken`: JWT token for WebSocket authentication
- `activeUsers`: Currently active collaborators with cursor positions
- `noteVersion`: Current version number for conflict resolution

---

### POST /collaboration/notes/:noteId/leave-session

Leave a real-time collaboration session.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `noteId` (string) - Note ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Left collaboration session successfully"
}
```

## 🔌 WebSocket Integration

### Connection Setup
```typescript
// Frontend WebSocket connection
const collaborationSocket = new WebSocket(
  `wss://api.domain.com/collaboration/ws?token=${sessionToken}&noteId=${noteId}`
);

// Authentication and setup
collaborationSocket.onopen = () => {
  collaborationSocket.send(JSON.stringify({
    type: 'JOIN_SESSION',
    noteId: noteId,
    userId: currentUser.id
  }));
};
```

### Real-time Events

#### Outgoing Events (Client to Server)
```typescript
// Content change
{
  type: 'CONTENT_CHANGE',
  noteId: 'cm4note123',
  operation: {
    type: 'insert',
    position: 450,
    content: 'New text',
    version: 15
  },
  userId: 'cm4user456'
}

// Cursor position
{
  type: 'CURSOR_UPDATE',
  noteId: 'cm4note123',
  cursor: {
    position: 450,
    selection: { start: 450, end: 465 }
  },
  userId: 'cm4user456'
}

// User presence
{
  type: 'PRESENCE_UPDATE',
  noteId: 'cm4note123',
  status: 'active', // 'active', 'idle', 'away'
  userId: 'cm4user456'
}
```

#### Incoming Events (Server to Client)
```typescript
// Content synchronized
{
  type: 'CONTENT_SYNCED',
  noteId: 'cm4note123',
  operation: {
    type: 'insert',
    position: 450,
    content: 'New text',
    version: 16,
    userId: 'cm4user789'
  },
  author: {
    id: 'cm4user789',
    name: 'Bob Wilson',
    image: 'https://avatar.com/bob.jpg'
  }
}

// User joined/left
{
  type: 'USER_JOINED',
  noteId: 'cm4note123',
  user: {
    id: 'cm4user789',
    name: 'Bob Wilson',
    permission: 'WRITE',
    cursor: null
  }
}

// Cursor positions from other users
{
  type: 'CURSORS_UPDATE',
  noteId: 'cm4note123',
  cursors: [
    {
      userId: 'cm4user789',
      name: 'Bob Wilson',
      cursor: { position: 320, selection: null },
      color: '#FF6B35'
    }
  ]
}
```

### Frontend Integration Example
```typescript
// hooks/useCollaboration.ts
export function useCollaboration(noteId: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [cursors, setCursors] = useState(new Map());
  const [isConnected, setIsConnected] = useState(false);

  const joinSession = async () => {
    try {
      // Get session info
      const session = await fetch(`/api/collaboration/notes/${noteId}/join-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json());

      // Connect WebSocket
      const ws = new WebSocket(
        `${session.websocketUrl}?token=${session.sessionToken}&noteId=${noteId}`
      );

      ws.onopen = () => {
        setIsConnected(true);
        setActiveUsers(session.activeUsers);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setActiveUsers([]);
        setCursors(new Map());
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to join collaboration session:', error);
    }
  };

  const sendContentChange = (operation: Operation) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'CONTENT_CHANGE',
        noteId,
        operation,
        userId: currentUser.id
      }));
    }
  };

  const sendCursorUpdate = (cursor: CursorPosition) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'CURSOR_UPDATE',
        noteId,
        cursor,
        userId: currentUser.id
      }));
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'CONTENT_SYNCED':
        // Apply operation to editor
        applyOperation(message.operation);
        break;
        
      case 'USER_JOINED':
        setActiveUsers(prev => [...prev, message.user]);
        break;
        
      case 'USER_LEFT':
        setActiveUsers(prev => prev.filter(u => u.userId !== message.userId));
        setCursors(prev => {
          const newCursors = new Map(prev);
          newCursors.delete(message.userId);
          return newCursors;
        });
        break;
        
      case 'CURSORS_UPDATE':
        setCursors(new Map(
          message.cursors.map(c => [c.userId, c])
        ));
        break;
    }
  };

  const leaveSession = async () => {
    if (socket) {
      socket.close();
      await fetch(`/api/collaboration/notes/${noteId}/leave-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  };

  return {
    joinSession,
    leaveSession,
    sendContentChange,
    sendCursorUpdate,
    activeUsers,
    cursors,
    isConnected
  };
}

// components/CollaborativeEditor.tsx
export function CollaborativeEditor({ noteId, initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    joinSession,
    leaveSession,
    sendContentChange,
    sendCursorUpdate,
    activeUsers,
    cursors,
    isConnected
  } = useCollaboration(noteId);

  useEffect(() => {
    joinSession();
    return () => leaveSession();
  }, [noteId]);

  const handleContentChange = (newContent: string) => {
    const operation = calculateOperation(content, newContent);
    setContent(newContent);
    
    if (isConnected) {
      sendContentChange(operation);
    }
  };

  const handleSelectionChange = () => {
    if (editorRef.current) {
      const { selectionStart, selectionEnd } = editorRef.current;
      const newSelection = { start: selectionStart, end: selectionEnd };
      setSelection(newSelection);
      
      if (isConnected) {
        sendCursorUpdate({
          position: selectionStart,
          selection: selectionStart !== selectionEnd ? newSelection : null
        });
      }
    }
  };

  return (
    <div className="collaborative-editor">
      <div className="collaboration-header">
        <div className="connection-status">
          {isConnected ? (
            <span className="connected">🟢 Connected</span>
          ) : (
            <span className="disconnected">🔴 Disconnected</span>
          )}
        </div>
        
        <div className="active-users">
          {activeUsers.map(user => (
            <div key={user.userId} className="user-avatar" title={user.name}>
              <img src={user.image} alt={user.name} />
              <span className="user-permission">{user.permission}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="editor-container">
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onSelect={handleSelectionChange}
          className="collaborative-textarea"
          placeholder="Start typing... others can see your changes in real-time"
        />
        
        <div className="cursors-overlay">
          {Array.from(cursors.values()).map(cursor => (
            <div
              key={cursor.userId}
              className="user-cursor"
              style={{
                position: 'absolute',
                left: calculateCursorX(cursor.cursor.position),
                top: calculateCursorY(cursor.cursor.position),
                borderColor: cursor.color
              }}
            >
              <div className="cursor-label" style={{ backgroundColor: cursor.color }}>
                {cursor.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 🔧 Operational Transform Algorithm

### Conflict Resolution
```typescript
// Operation transformation for concurrent edits
function transformOperation(op1: Operation, op2: Operation): Operation {
  if (op1.type === 'insert' && op2.type === 'insert') {
    if (op1.position <= op2.position) {
      return { ...op2, position: op2.position + op1.content.length };
    }
  }
  
  if (op1.type === 'delete' && op2.type === 'insert') {
    if (op1.position < op2.position) {
      return { ...op2, position: op2.position - op1.length };
    }
  }
  
  return op2; // More complex transformations...
}

// Version control for operation ordering
function applyOperationsInOrder(operations: Operation[]): string {
  let content = initialContent;
  const sortedOps = operations.sort((a, b) => a.version - b.version);
  
  for (const op of sortedOps) {
    content = applyOperation(content, op);
  }
  
  return content;
}
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Invite collaborator:**
```bash
curl -X POST http://localhost:3001/api/collaboration/notes/NOTE_ID/invite \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "collaborator@example.com",
    "permission": "WRITE",
    "message": "Let`s work together on this note!"
  }'
```

**Get collaborators:**
```bash
curl -X GET http://localhost:3001/api/collaboration/notes/NOTE_ID/collaborators \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update permissions:**
```bash
curl -X PATCH http://localhost:3001/api/collaboration/COLLABORATION_ID/permission \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"permission": "ADMIN"}'
```

**Join collaboration session:**
```bash
curl -X POST http://localhost:3001/api/collaboration/notes/NOTE_ID/join-session \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Background Processing

### Email Notifications
```typescript
// Queue job data structures
{
  "send-collaboration-invitation": {
    "toEmail": "collaborator@example.com",
    "inviterName": "John Doe",
    "noteTi tle": "React Guide",
    "noteId": "cm4note123",
    "permission": "WRITE",
    "customMessage": "Let's work together!"
  },
  "permission-changed-notification": {
    "userId": "cm4user456",
    "noteTitle": "React Guide",
    "oldPermission": "READ",
    "newPermission": "WRITE",
    "changedBy": "John Doe"
  }
}
```

## ❌ Common Issues and Solutions

### Issue: "WebSocket connection failed"
**Cause:** Network restrictions or authentication issues
**Solution:** Check session token validity, verify WebSocket URL accessibility

### Issue: "Content conflicts during merge"
**Cause:** Simultaneous edits to same section
**Solution:** Implement operational transforms, show conflict resolution UI

### Issue: "Permission denied for collaboration"
**Cause:** Insufficient user permissions
**Solution:** Verify user has ADMIN or owner permissions for invite operations

### Issue: "Real-time updates not syncing"
**Cause:** WebSocket disconnection or operation ordering issues
**Solution:** Implement reconnection logic and version-based conflict resolution

## 🎯 Advanced Features

### Permission Inheritance
```typescript
// Workspace-level permissions affect note collaboration
const effectivePermission = Math.min(
  workspacePermission,
  noteCollaborationPermission
);
```

### Conflict Resolution UI
```typescript
// Show merge conflicts to users
interface ConflictResolution {
  conflictId: string;
  section: string;
  options: {
    yours: string;
    theirs: string;
    merged?: string;
  };
  resolution: 'yours' | 'theirs' | 'merged';
}
```

### Analytics Tracking
- Collaboration engagement metrics
- Most active collaborators
- Peak collaboration times
- Content contribution analysis

---

**Next:** [Sharing API](./02-sharing.md)
