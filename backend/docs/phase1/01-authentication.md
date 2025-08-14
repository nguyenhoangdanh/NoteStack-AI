# Authentication API

Complete authentication system with email/password and Google OAuth support.

## 📋 Overview

The authentication system provides secure user registration, login, and token management. Supports both traditional email/password and Google OAuth authentication methods.

### Features
- ✅ Email/password registration and login
- ✅ Google OAuth integration
- ✅ JWT token management (7-day expiry)
- ✅ Token verification
- ✅ User profile retrieval
- ✅ Automatic workspace and settings creation

## 🔐 Endpoints

### POST /auth/register

Register a new user account with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required
- `name`: String, optional

**Success Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm4abc123def",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "message": ["email must be a valid email", "password must be longer than 6 characters"],
  "error": "Bad Request",
  "statusCode": 400
}

// 409 - User Already Exists
{
  "message": "User with this email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

**Frontend Integration:**
```typescript
// services/authService.ts
export async function registerUser(userData: {
  email: string;
  password: string;
  name?: string;
}) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  localStorage.setItem('auth_token', data.access_token);
  return data;
}
```

---

### POST /auth/login

Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm4abc123def",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://lh3.googleusercontent.com/..."
  }
}
```

**Error Responses:**
```json
// 401 - Invalid Credentials
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}

// 401 - OAuth User (No Password)
{
  "message": "Please use Google login or reset your password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

**Frontend Integration:**
```typescript
export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  localStorage.setItem('auth_token', data.access_token);
  return data;
}
```

---

### GET /auth/google

Initiate Google OAuth authentication flow.

**Usage:** Redirect user to this endpoint to start OAuth process.

**Frontend Integration:**
```typescript
export function initiateGoogleAuth() {
  // Redirect to Google OAuth
  window.location.href = '/api/auth/google';
}

// Or for popup-based auth
export function openGoogleAuthPopup() {
  const popup = window.open(
    '/api/auth/google',
    'google-auth',
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );

  return new Promise((resolve, reject) => {
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        // Handle auth completion
        resolve(null);
      }
    }, 1000);
  });
}
```

---

### GET /auth/google/callback

Google OAuth callback endpoint (internal use only).

**Behavior:**
- Processes Google OAuth response
- Creates user account if doesn't exist
- Redirects to frontend with token

**Redirect URL:**
```
http://localhost:3000/auth/callback?token=<jwt_token>
```

**Frontend Handler:**
```typescript
// pages/AuthCallback.tsx
export function AuthCallback() {
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('auth_token', token);
      // Redirect to main app
      navigate('/dashboard');
    } else {
      navigate('/login?error=auth_failed');
    }
  }, []);

  return <div>Processing authentication...</div>;
}
```

---

### GET /auth/verify

Verify JWT token validity and get user info.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "cm4abc123def",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
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
export async function verifyToken(token: string) {
  const response = await fetch('/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Invalid token');
  }

  return response.json();
}

// React hook for token verification
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      verifyToken(token)
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return { user, loading, logout };
}
```

---

### GET /auth/me

Get current authenticated user profile (alias for /auth/verify).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** Same as `/auth/verify` endpoint.

**Frontend Integration:**
```typescript
export async function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Failed to get user');
  return response.json();
}
```

## 🔧 Implementation Details

### JWT Token Structure
```json
{
  "sub": "cm4abc123def",      // User ID
  "email": "user@example.com",
  "iat": 1642723200,          // Issued at
  "exp": 1643328000           // Expires at (7 days)
}
```

### Google OAuth Configuration

**Required Environment Variables:**
```env
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**OAuth Scopes:**
- `email` - Access to user's email address
- `profile` - Access to basic profile information

**Redirect URIs (Google Cloud Console):**
- Development: `http://localhost:3001/api/auth/google/callback`
- Production: `https://your-api.domain.com/api/auth/google/callback`

### User Creation Side Effects

When a new user is created (via registration or OAuth), the system automatically:

1. **Creates Default Workspace:**
```json
{
  "name": "My Workspace",
  "isDefault": true,
  "ownerId": "user_id"
}
```

2. **Creates Default Settings:**
```json
{
  "model": "gemini-1.5-flash",
  "maxTokens": 4000,
  "autoReembed": true,
  "ownerId": "user_id"
}
```

## 🛡️ Security Considerations

### Password Security
- Passwords hashed with bcryptjs (12 rounds)
- Minimum password length: 6 characters
- No maximum length restriction

### JWT Security
- 7-day expiration time
- Signed with HS256 algorithm
- Secret key stored in environment variable

### OAuth Security
- State parameter for CSRF protection
- Secure callback URL validation
- User consent required for each login

## 🧪 Testing Examples

### Manual Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Verify Token:**
```bash
curl -X GET http://localhost:3001/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### React Testing Component
```tsx
// components/AuthTest.tsx
export function AuthTest() {
  const [result, setResult] = useState('');

  const testRegister = async () => {
    try {
      const data = await registerUser({
        email: 'test@example.com',
        password: 'testpass123',
        name: 'Test User'
      });
      setResult(`Success: ${JSON.stringify(data)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      const data = await loginUser({
        email: 'test@example.com',
        password: 'testpass123'
      });
      setResult(`Success: ${JSON.stringify(data)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={testRegister}>Test Register</button>
      <button onClick={testLogin}>Test Login</button>
      <pre>{result}</pre>
    </div>
  );
}
```

## ❌ Common Errors and Solutions

### Error: "User already exists"
**Cause:** Attempting to register with an email that's already in use
**Solution:** Use the login endpoint instead, or implement forgot password flow

### Error: "Please use Google login"
**Cause:** User was created via Google OAuth and has no password
**Solution:** Redirect to Google OAuth flow or implement password reset

### Error: "Invalid credentials"
**Cause:** Wrong email or password provided
**Solution:** Verify credentials or implement account recovery

### Error: "Unauthorized"
**Cause:** Invalid, expired, or missing JWT token
**Solution:** Re-authenticate user and refresh token

## 🔄 Token Refresh Strategy

Current implementation uses 7-day tokens without refresh. For production, consider implementing refresh tokens:

```typescript
// Recommended refresh token implementation
interface AuthTokens {
  access_token: string;   // Short-lived (1 hour)
  refresh_token: string;  // Long-lived (30 days)
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  return response.json();
}
```

---

**Next:** [User Management API](./02-users.md)
