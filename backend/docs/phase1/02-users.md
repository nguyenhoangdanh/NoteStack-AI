# User Management API

Complete user profile management system with secure data handling.

## 📋 Overview

The user management system provides profile operations, settings management, and user data control. All operations are secured with JWT authentication and user-scoped data access.

### Features
- ✅ User profile retrieval and updates
- ✅ Image/avatar management
- ✅ Data privacy and security
- ✅ Account information control

## 🔐 Endpoints

### GET /users/me

Get current authenticated user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "id": "cm4abc123def",
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://lh3.googleusercontent.com/a/default-user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
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
// services/userService.ts
export async function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch('/api/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
}

// React component usage
export function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <img src={user?.image} alt={user?.name} />
      <h2>{user?.name || user?.email}</h2>
      <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
```

---

### PATCH /users/me

Update current user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "image": "https://new-avatar-url.com/avatar.jpg"
}
```

**Validation Rules:**
- `name`: Optional string, 1-100 characters
- `image`: Optional string, valid URL format

**Success Response (200):**
```json
{
  "id": "cm4abc123def",
  "email": "user@example.com",
  "name": "Updated Name",
  "image": "https://new-avatar-url.com/avatar.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "message": ["name must be shorter than or equal to 100 characters"],
  "error": "Bad Request",
  "statusCode": 400
}

// 401 - Unauthorized
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Frontend Integration:**
```typescript
// services/userService.ts
export async function updateUserProfile(updates: {
  name?: string;
  image?: string;
}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return response.json();
}

// React form component
export function EditProfileForm({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    image: user?.image || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = await updateUserProfile(formData);
      onUpdate(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="url"
        placeholder="Profile image URL"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
```

## 🔧 Data Privacy & Security

### User Data Scope
- All user operations are automatically scoped to the authenticated user
- No user can access or modify another user's data
- User ID is extracted from JWT token, not request parameters

### Password Security
- Passwords are never returned in API responses
- Password field is explicitly excluded from user queries
- Password updates require separate endpoint (future implementation)

### Image Handling
- Image URLs are validated for format
- No automatic image hosting (users provide their own URLs)
- Support for Google OAuth profile images
- Future: Direct image upload with CDN integration

## 🧪 Testing Examples

### Manual Testing with cURL

**Get current user:**
```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update user profile:**
```bash
curl -X PATCH http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "image": "https://example.com/avatar.jpg"
  }'
```

### React Testing Component
```tsx
// components/UserProfileTest.tsx
export function UserProfileTest() {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState('');

  const testGetProfile = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setResult(`Success: ${JSON.stringify(userData, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const testUpdateProfile = async () => {
    try {
      const updated = await updateUserProfile({
        name: 'Test Updated Name'
      });
      setUser(updated);
      setResult(`Update Success: ${JSON.stringify(updated, null, 2)}`);
    } catch (error) {
      setResult(`Update Error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={testGetProfile}>Test Get Profile</button>
      <button onClick={testUpdateProfile}>Test Update Profile</button>
      <pre>{result}</pre>
    </div>
  );
}
```

## ❌ Common Errors and Solutions

### Error: "Unauthorized"
**Cause:** Missing, invalid, or expired JWT token
**Solution:** Re-authenticate user and refresh token

### Error: "Failed to fetch user profile"
**Cause:** Network error or server unavailable
**Solution:** Implement retry logic with exponential backoff

### Error: "Validation failed"
**Cause:** Invalid data format in update request
**Solution:** Validate input on frontend before submission

## 🔄 User Data Flow

### Profile Loading
1. App loads → Check for stored auth token
2. Token exists → Call `/users/me` endpoint
3. Success → Store user data in state/store
4. Error → Redirect to login page

### Profile Updates
1. User submits form → Validate input client-side
2. Call `/users/me` PATCH endpoint
3. Success → Update local user state
4. Error → Show validation messages

### Authentication Integration
```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (updates) => {
    const updated = await updateUserProfile(updates);
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return { user, loading, updateProfile, logout };
}
```

## 🎯 Future Enhancements

### Planned Features
- Direct image upload endpoint
- Password change functionality
- Account deletion with data export
- User preference settings
- Profile visibility controls

### Security Improvements
- Email verification for profile changes
- Two-factor authentication
- Login activity tracking
- Suspicious activity detection

---

**Next:** [Workspaces Management API](./03-workspaces.md)
