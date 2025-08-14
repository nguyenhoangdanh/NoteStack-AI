# Settings & Usage API

User preferences management and usage tracking system.

## 📋 Overview

The settings system manages user preferences for AI models, token limits, and other application configurations. It also tracks API usage for monitoring and billing purposes.

### Features
- ✅ User preference management
- ✅ AI model selection and configuration
- ✅ Usage tracking for different API calls
- ✅ Auto-reembedding settings
- ✅ Default settings creation for new users

## 🔐 Endpoints

### GET /settings

Get current user's settings and preferences.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "id": "cm4settings123",
  "ownerId": "cm4user123",
  "model": "gemini-1.5-flash",
  "maxTokens": 4000,
  "autoReembed": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response Fields:**
- `model`: AI model to use for chat responses
- `maxTokens`: Maximum tokens for AI responses
- `autoReembed`: Automatically process notes for RAG when updated

**Available Models:**
- `gemini-1.5-flash` (Free, Google AI) - **Default**
- `llama3-8b-8192` (Free, Groq)
- `gpt-3.5-turbo` (Paid, OpenAI)
- `gpt-4` (Paid, OpenAI)

**Frontend Integration:**
```typescript
// services/settingsService.ts
export async function getUserSettings() {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/settings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }

  return response.json();
}

// React component for settings display
export function SettingsOverview() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading settings...</div>;

  const modelInfo = {
    'gemini-1.5-flash': { provider: 'Google', cost: 'Free', speed: 'Fast' },
    'llama3-8b-8192': { provider: 'Groq', cost: 'Free', speed: 'Very Fast' },
    'gpt-3.5-turbo': { provider: 'OpenAI', cost: 'Paid', speed: 'Fast' },
    'gpt-4': { provider: 'OpenAI', cost: 'Paid', speed: 'Slow but High Quality' }
  };

  return (
    <div className="settings-overview">
      <h2>Current Settings</h2>
      
      <div className="setting-group">
        <label>AI Model</label>
        <div className="model-info">
          <span className="model-name">{settings.model}</span>
          <div className="model-details">
            <span className="provider">{modelInfo[settings.model]?.provider}</span>
            <span className={`cost ${modelInfo[settings.model]?.cost === 'Free' ? 'free' : 'paid'}`}>
              {modelInfo[settings.model]?.cost}
            </span>
            <span className="speed">{modelInfo[settings.model]?.speed}</span>
          </div>
        </div>
      </div>

      <div className="setting-group">
        <label>Response Length</label>
        <span>{settings.maxTokens} tokens max</span>
      </div>

      <div className="setting-group">
        <label>Auto-processing</label>
        <span>{settings.autoReembed ? 'Enabled' : 'Disabled'}</span>
      </div>
    </div>
  );
}
```

---

### PATCH /settings

Update user settings and preferences.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "model": "gpt-4",
  "maxTokens": 8000,
  "autoReembed": false
}
```

**Validation Rules:**
- `model`: Must be one of the available models
- `maxTokens`: Number between 100 and 16000
- `autoReembed`: Boolean value

**Success Response (200):**
```json
{
  "id": "cm4settings123",
  "ownerId": "cm4user123",
  "model": "gpt-4",
  "maxTokens": 8000,
  "autoReembed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "message": ["maxTokens must be between 100 and 16000"],
  "error": "Bad Request",
  "statusCode": 400
}
```

**Frontend Integration:**
```typescript
// services/settingsService.ts
export async function updateUserSettings(updates: {
  model?: string;
  maxTokens?: number;
  autoReembed?: boolean;
}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/settings', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update settings');
  }

  return response.json();
}

// React component for settings form
export function SettingsForm({ initialSettings, onUpdate }) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const models = [
    { 
      value: 'gemini-1.5-flash', 
      label: 'Gemini 1.5 Flash',
      provider: 'Google',
      cost: 'Free',
      description: 'Fast and free AI model from Google'
    },
    { 
      value: 'llama3-8b-8192', 
      label: 'Llama 3 8B',
      provider: 'Groq',
      cost: 'Free', 
      description: 'Very fast inference with Groq'
    },
    { 
      value: 'gpt-3.5-turbo', 
      label: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      cost: 'Paid',
      description: 'Reliable and well-tested OpenAI model'
    },
    { 
      value: 'gpt-4', 
      label: 'GPT-4',
      provider: 'OpenAI',
      cost: 'Paid',
      description: 'Highest quality but slower and more expensive'
    }
  ];

  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(initialSettings);
    setHasChanges(changed);
  }, [settings, initialSettings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await updateUserSettings(settings);
      onUpdate(updated);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-form">
      <div className="form-section">
        <h3>AI Model Selection</h3>
        <div className="model-selection">
          {models.map(model => (
            <div 
              key={model.value}
              className={`model-option ${settings.model === model.value ? 'selected' : ''}`}
              onClick={() => setSettings({ ...settings, model: model.value })}
            >
              <div className="model-header">
                <span className="model-label">{model.label}</span>
                <span className={`model-cost ${model.cost === 'Free' ? 'free' : 'paid'}`}>
                  {model.cost}
                </span>
              </div>
              <div className="model-provider">{model.provider}</div>
              <div className="model-description">{model.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>Response Settings</h3>
        <div className="form-group">
          <label htmlFor="maxTokens">Maximum Response Length</label>
          <input
            id="maxTokens"
            type="range"
            min="100"
            max="16000"
            step="100"
            value={settings.maxTokens}
            onChange={(e) => setSettings({ 
              ...settings, 
              maxTokens: parseInt(e.target.value) 
            })}
          />
          <div className="range-display">
            <span>{settings.maxTokens} tokens</span>
            <span className="range-hint">
              (~{Math.round(settings.maxTokens * 0.75)} words)
            </span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Processing Settings</h3>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.autoReembed}
              onChange={(e) => setSettings({ 
                ...settings, 
                autoReembed: e.target.checked 
              })}
            />
            <span>Automatically process notes for AI chat</span>
          </label>
          <div className="setting-description">
            When enabled, notes will be automatically processed for vector search 
            and AI chat when you create or update them.
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          onClick={handleSave} 
          disabled={loading || !hasChanges}
          className="save-button"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        
        {hasChanges && (
          <span className="unsaved-changes">You have unsaved changes</span>
        )}
      </div>
    </div>
  );
}
```

---

### GET /settings/usage

Get API usage statistics for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `days` (number, optional, default: 30) - Number of days to retrieve

**Success Response (200):**
```json
[
  {
    "id": "cm4usage123",
    "ownerId": "cm4user123",
    "date": "2024-01-15",
    "embeddingTokens": 1250,
    "chatTokens": 3500,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T18:45:00.000Z"
  },
  {
    "id": "cm4usage124",
    "ownerId": "cm4user123",
    "date": "2024-01-14",
    "embeddingTokens": 800,
    "chatTokens": 2200,
    "createdAt": "2024-01-14T09:15:00.000Z",
    "updatedAt": "2024-01-14T16:30:00.000Z"
  }
]
```

**Response Fields:**
- `date`: Date in YYYY-MM-DD format
- `embeddingTokens`: Tokens used for vector embeddings
- `chatTokens`: Tokens used for AI chat responses

**Frontend Integration:**
```typescript
// services/settingsService.ts
export async function getUsageStats(days: number = 30) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`/api/settings/usage?days=${days}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch usage stats');
  }

  return response.json();
}

// React component for usage analytics
export function UsageAnalytics() {
  const [usage, setUsage] = useState([]);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUsageStats(period)
      .then(setUsage)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const totalTokens = usage.reduce((sum, day) => 
    sum + day.embeddingTokens + day.chatTokens, 0
  );

  const averageDaily = totalTokens / Math.max(usage.length, 1);
  
  // Calculate cost estimate (OpenAI pricing example)
  const estimatedCost = (totalTokens / 1000) * 0.002; // $0.002 per 1K tokens

  return (
    <div className="usage-analytics">
      <div className="period-selector">
        <button 
          className={period === 7 ? 'active' : ''}
          onClick={() => setPeriod(7)}
        >
          Last 7 days
        </button>
        <button 
          className={period === 30 ? 'active' : ''}
          onClick={() => setPeriod(30)}
        >
          Last 30 days
        </button>
        <button 
          className={period === 90 ? 'active' : ''}
          onClick={() => setPeriod(90)}
        >
          Last 90 days
        </button>
      </div>

      {loading ? (
        <div>Loading usage data...</div>
      ) : (
        <>
          <div className="usage-summary">
            <div className="stat-card">
              <h3>Total Tokens Used</h3>
              <div className="stat-value">{totalTokens.toLocaleString()}</div>
            </div>
            
            <div className="stat-card">
              <h3>Average Daily Usage</h3>
              <div className="stat-value">{Math.round(averageDaily).toLocaleString()}</div>
            </div>
            
            <div className="stat-card">
              <h3>Estimated Cost (OpenAI)</h3>
              <div className="stat-value">${estimatedCost.toFixed(4)}</div>
            </div>
          </div>

          <div className="usage-breakdown">
            <h3>Usage Breakdown</h3>
            <div className="breakdown-chart">
              {usage.map(day => (
                <div key={day.date} className="usage-day">
                  <div className="day-label">{day.date}</div>
                  <div className="usage-bars">
                    <div 
                      className="embedding-bar"
                      style={{ 
                        height: `${(day.embeddingTokens / Math.max(...usage.map(d => d.embeddingTokens))) * 100}px` 
                      }}
                      title={`Embeddings: ${day.embeddingTokens} tokens`}
                    />
                    <div 
                      className="chat-bar"
                      style={{ 
                        height: `${(day.chatTokens / Math.max(...usage.map(d => d.chatTokens))) * 100}px` 
                      }}
                      title={`Chat: ${day.chatTokens} tokens`}
                    />
                  </div>
                  <div className="day-total">
                    {(day.embeddingTokens + day.chatTokens).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color embedding"></div>
                <span>Vector Embeddings</span>
              </div>
              <div className="legend-item">
                <div className="legend-color chat"></div>
                <span>AI Chat</span>
              </div>
            </div>
          </div>

          <div className="usage-insights">
            <h3>Usage Insights</h3>
            <div className="insights-list">
              {totalTokens === 0 && (
                <div className="insight">
                  💡 You haven't used any AI features yet. Try creating a note and asking the AI chat about it!
                </div>
              )}
              {averageDaily > 1000 && (
                <div className="insight">
                  📈 You're a power user! Consider upgrading to a paid AI model for better performance.
                </div>
              )}
              {usage.some(d => d.embeddingTokens > d.chatTokens) && (
                <div className="insight">
                  🔍 You're using vector search extensively. This helps improve AI chat accuracy!
                </div>
              )}
              {estimatedCost > 1 && (
                <div className="insight">
                  💰 Estimated monthly cost would be ${(estimatedCost * 30 / period).toFixed(2)} with OpenAI models.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

## 🔧 Settings Management Features

### Default Settings Creation
When a new user registers, default settings are automatically created:

```typescript
// Default settings for new users
const defaultSettings = {
  model: 'gemini-1.5-flash',     // Free model by default
  maxTokens: 4000,               // Reasonable response length
  autoReembed: true              // Enable automatic processing
};
```

### Model Selection Logic
The system intelligently selects available models based on API key configuration:

```typescript
const getAvailableModels = (apiKeys) => {
  const models = [];
  
  // Always available (free models)
  if (apiKeys.gemini) {
    models.push('gemini-1.5-flash');
  }
  if (apiKeys.groq) {
    models.push('llama3-8b-8192');
  }
  
  // Paid models (only if API key is present)
  if (apiKeys.openai) {
    models.push('gpt-3.5-turbo', 'gpt-4');
  }
  
  return models;
};
```

### Usage Tracking Implementation
Token usage is tracked automatically when API calls are made:

```typescript
// Example usage tracking in chat service
export class ChatService {
  async completeResponse(query: string, userId: string) {
    const response = await this.callAI(query);
    
    // Track usage
    const today = new Date().toISOString().split('T')[0];
    const tokensUsed = response.usage?.total_tokens || this.estimateTokens(response.text);
    
    await this.vectorsService.updateUsage(userId, today, 0, tokensUsed);
    
    return response;
  }
}
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Get settings:**
```bash
curl -X GET http://localhost:3001/api/settings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update settings:**
```bash
curl -X PATCH http://localhost:3001/api/settings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "maxTokens": 8000,
    "autoReembed": false
  }'
```

**Get usage stats:**
```bash
curl -X GET "http://localhost:3001/api/settings/usage?days=7" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### React Settings Dashboard
```tsx
// components/SettingsDashboard.tsx
export function SettingsDashboard() {
  const [settings, setSettings] = useState(null);
  const [usage, setUsage] = useState([]);
  const [activeTab, setActiveTab] = useState('preferences');

  useEffect(() => {
    Promise.all([
      getUserSettings(),
      getUsageStats(30)
    ]).then(([settingsData, usageData]) => {
      setSettings(settingsData);
      setUsage(usageData);
    });
  }, []);

  return (
    <div className="settings-dashboard">
      <div className="settings-tabs">
        <button 
          className={activeTab === 'preferences' ? 'active' : ''}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button 
          className={activeTab === 'usage' ? 'active' : ''}
          onClick={() => setActiveTab('usage')}
        >
          Usage Analytics
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'preferences' && settings && (
          <SettingsForm 
            initialSettings={settings}
            onUpdate={setSettings}
          />
        )}
        
        {activeTab === 'usage' && (
          <UsageAnalytics />
        )}
      </div>
    </div>
  );
}
```

## 🎯 Advanced Configuration

### Model-Specific Settings
Future enhancement could include model-specific configurations:

```typescript
interface ModelConfig {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  customPrompt?: string;
}

const modelConfigs: Record<string, ModelConfig> = {
  'gpt-4': {
    model: 'gpt-4',
    temperature: 0.7,
    topP: 1.0,
    maxTokens: 4000
  },
  'gemini-1.5-flash': {
    model: 'gemini-1.5-flash',
    temperature: 0.7,
    topP: 0.8,
    maxTokens: 4000
  }
};
```

### Usage-Based Recommendations
The system can provide recommendations based on usage patterns:

```typescript
const generateRecommendations = (usage: UsageData[]) => {
  const recommendations = [];
  
  const totalTokens = usage.reduce((sum, day) => sum + day.chatTokens + day.embeddingTokens, 0);
  const avgDaily = totalTokens / usage.length;
  
  if (avgDaily > 2000) {
    recommendations.push({
      type: 'model',
      message: 'Consider using a more efficient model for high usage',
      action: 'Switch to Gemini 1.5 Flash for better cost-effectiveness'
    });
  }
  
  if (usage.some(day => day.embeddingTokens === 0)) {
    recommendations.push({
      type: 'feature',
      message: 'Enable auto-processing to improve AI chat accuracy',
      action: 'Turn on automatic note processing in settings'
    });
  }
  
  return recommendations;
};
```

---

**🎉 Phase 1: Core Foundation COMPLETE!**

All Phase 1 modules are now documented:
1. ✅ **Authentication API** - Registration, login, OAuth, JWT
2. ✅ **Users API** - Profile management  
3. ✅ **Workspaces API** - Organization system
4. ✅ **Notes API** - Core CRUD operations
5. ✅ **Vectors API** - Semantic search & RAG
6. ✅ **Chat API** - AI conversations
7. ✅ **Settings API** - Preferences & usage tracking

**Next Phase:** [Phase 2A Smart Features Documentation](../phase2a/01-categories.md)
