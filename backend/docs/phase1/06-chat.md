# AI Chat API

Intelligent chat interface with RAG (Retrieval-Augmented Generation) over your notes.

## 📋 Overview

The AI chat system provides conversational access to your notes using advanced RAG techniques. It searches through your content semantically and provides contextual answers with proper citations.

### Features
- ✅ Real-time streaming chat responses
- ✅ RAG-powered answers from your notes
- ✅ Multiple AI provider support (OpenAI, Google Gemini, Groq)
- ✅ Automatic context building and citation tracking
- ✅ Content suggestions and improvements
- ✅ Suggestion application system

## 🔐 Endpoints

### POST /chat/stream

Stream AI response for real-time chat experience with your notes as context.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "What did I write about machine learning?",
  "model": "gemini-1.5-flash",
  "maxTokens": 4000
}
```

**Validation Rules:**
- `query`: Required string, user's question
- `model`: Optional string, AI model to use
- `maxTokens`: Optional number, maximum response length

**Available Models:**
- `gemini-1.5-flash` (Free, Google AI) - **Default**
- `llama3-8b-8192` (Free, Groq)  
- `gpt-3.5-turbo` (Paid, OpenAI)
- `gpt-4` (Paid, OpenAI)

**Response:**
- **Content-Type:** `text/plain; charset=utf-8`
- **Headers:** `X-Citations: [{"title":"Note Title","heading":"Section"}]`
- **Body:** Streaming text response

**Frontend Integration:**
```typescript
// services/chatService.ts
export async function streamChatResponse(query: string) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  // Extract citations from headers
  const citations = JSON.parse(response.headers.get('X-Citations') || '[]');
  
  return { stream: response.body, citations };
}

// React streaming chat component
export function StreamingChat() {
  const [messages, setMessages] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const sendMessage = async (query: string) => {
    if (!query.trim() || isStreaming) return;

    // Add user message
    const userMessage = { role: 'user', content: query, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    
    setCurrentQuery(query);
    setIsStreaming(true);
    setCurrentResponse('');

    try {
      const { stream, citations } = await streamChatResponse(query);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let fullResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setCurrentResponse(fullResponse);
      }

      // Add AI response to messages
      const aiMessage = {
        role: 'assistant',
        content: fullResponse,
        citations,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setCurrentResponse('');
      
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        error: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
      setCurrentQuery('');
    }
  };

  return (
    <div className="streaming-chat">
      <div className="messages-container">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        
        {isStreaming && (
          <div className="streaming-response">
            <div className="message-header">AI Assistant</div>
            <div className="message-content">
              {currentResponse}
              <span className="cursor">|</span>
            </div>
          </div>
        )}
      </div>
      
      <ChatInput 
        onSendMessage={sendMessage}
        disabled={isStreaming}
        placeholder="Ask about your notes..."
      />
    </div>
  );
}

function ChatMessage({ message }) {
  return (
    <div className={`chat-message ${message.role}`}>
      <div className="message-header">
        {message.role === 'user' ? 'You' : 'AI Assistant'}
        <span className="timestamp">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <div className="message-content">
        <ReactMarkdown>{message.content}</ReactMarkdown>
        
        {message.citations && message.citations.length > 0 && (
          <div className="citations">
            <h4>Sources:</h4>
            {message.citations.map((citation, i) => (
              <div key={i} className="citation">
                📝 {citation.title}
                {citation.heading && ` > ${citation.heading}`}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### POST /chat/complete

Get complete AI response (non-streaming) for simpler implementations.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "Summarize my machine learning notes",
  "model": "gemini-1.5-flash",
  "maxTokens": 4000
}
```

**Success Response (200):**
```json
{
  "response": "Based on your notes, machine learning is a field of artificial intelligence that focuses on algorithms that can learn from data. Your notes cover several key concepts:\n\n## Supervised Learning\nYou've documented various supervised learning algorithms including linear regression, decision trees, and neural networks...",
  "citations": [
    {
      "title": "ML Fundamentals",
      "heading": "Introduction"
    },
    {
      "title": "Neural Networks Deep Dive", 
      "heading": "Supervised Learning Algorithms"
    }
  ]
}
```

**Frontend Integration:**
```typescript
// services/chatService.ts
export async function getCompleteResponse(query: string) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/chat/complete', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  return response.json();
}

// React component for complete responses
export function SimpleChat() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await getCompleteResponse(query.trim());
      setResponse(result);
    } catch (error) {
      toast.error('Failed to get AI response: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-chat">
      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your notes..."
          rows={3}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>

      {response && (
        <div className="chat-response">
          <div className="response-content">
            <ReactMarkdown>{response.response}</ReactMarkdown>
          </div>
          
          {response.citations && response.citations.length > 0 && (
            <div className="response-citations">
              <h4>Referenced from your notes:</h4>
              {response.citations.map((citation, i) => (
                <div key={i} className="citation-item">
                  • {citation.title}
                  {citation.heading && ` → ${citation.heading}`}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### POST /chat/suggest

Generate AI-powered suggestions for improving note content.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Your note content here...",
  "selectedText": "specific text to improve", 
  "suggestionType": "improve",
  "targetLanguage": "English"
}
```

**Suggestion Types:**
- `improve` - Enhance writing style and clarity
- `expand` - Add more detail and examples  
- `summarize` - Create concise summary
- `restructure` - Reorganize for better flow
- `examples` - Add practical examples
- `grammar` - Fix grammar and spelling
- `translate` - Translate to target language

**Success Response (200):**
```json
{
  "originalText": "Text that was processed...",
  "suggestion": "Improved version of the text with enhanced clarity, better structure, and more engaging language...",
  "type": "improve",
  "hasSelection": true
}
```

**Frontend Integration:**
```typescript
// services/chatService.ts
export async function generateSuggestion(
  content: string,
  selectedText?: string, 
  suggestionType: string = 'improve',
  targetLanguage?: string
) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/chat/suggest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content,
      selectedText,
      suggestionType,
      targetLanguage
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate suggestion');
  }

  return response.json();
}

// React AI suggestions widget
export function AISuggestionsWidget({ noteContent, selectedText, onApplySuggestion }) {
  const [suggestionType, setSuggestionType] = useState('improve');
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const suggestionTypes = [
    { value: 'improve', label: '✨ Improve', desc: 'Enhance clarity and style' },
    { value: 'expand', label: '📝 Expand', desc: 'Add more details' },
    { value: 'summarize', label: '📋 Summarize', desc: 'Create summary' },
    { value: 'restructure', label: '🔄 Restructure', desc: 'Reorganize content' },
    { value: 'examples', label: '💡 Examples', desc: 'Add examples' },
    { value: 'grammar', label: '✏️ Grammar', desc: 'Fix grammar & spelling' },
    { value: 'translate', label: '🌐 Translate', desc: 'Translate text' }
  ];

  const handleGenerateSuggestion = async () => {
    setLoading(true);
    try {
      const result = await generateSuggestion(
        noteContent,
        selectedText, 
        suggestionType
      );
      setSuggestion(result);
    } catch (error) {
      toast.error('Failed to generate suggestion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      onApplySuggestion(suggestion);
      setSuggestion(null);
    }
  };

  return (
    <div className="ai-suggestions-widget">
      <div className="suggestion-controls">
        <div className="suggestion-types">
          {suggestionTypes.map(type => (
            <button
              key={type.value}
              className={suggestionType === type.value ? 'active' : ''}
              onClick={() => setSuggestionType(type.value)}
              title={type.desc}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleGenerateSuggestion}
          disabled={loading}
          className="generate-btn"
        >
          {loading ? 'Generating...' : 'Generate Suggestion'}
        </button>
      </div>

      {suggestion && (
        <div className="suggestion-result">
          <div className="suggestion-header">
            <h4>AI Suggestion ({suggestion.type})</h4>
            {suggestion.hasSelection && (
              <span className="selection-badge">Selected text</span>
            )}
          </div>
          
          <div className="suggestion-content">
            <div className="original-text">
              <label>Original:</label>
              <div className="text-preview">{suggestion.originalText}</div>
            </div>
            
            <div className="suggested-text">
              <label>Suggestion:</label>
              <div className="text-preview improved">{suggestion.suggestion}</div>
            </div>
          </div>
          
          <div className="suggestion-actions">
            <button onClick={() => setSuggestion(null)} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleApplySuggestion} className="apply-btn">
              Apply Suggestion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### POST /chat/apply-suggestion

Apply AI suggestion to note content with various insertion methods.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "noteId": "cm4note123",
  "originalContent": "Full note content...",
  "suggestion": "AI generated suggestion...",
  "selectedText": "text to replace",
  "applyType": "replace",
  "position": 150
}
```

**Apply Types:**
- `replace` - Replace selected text or entire content
- `append` - Add to end of note
- `insert` - Insert at specific position

**Success Response (200):**
```json
{
  "newContent": "Content with suggestion applied...",
  "applied": true,
  "type": "replace"
}
```

**Frontend Integration:**
```typescript
// services/chatService.ts
export async function applySuggestion(applySuggestionData: {
  noteId: string;
  originalContent: string;
  suggestion: string;
  selectedText?: string;
  applyType: 'replace' | 'append' | 'insert';
  position?: number;
}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/chat/apply-suggestion', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(applySuggestionData)
  });

  if (!response.ok) {
    throw new Error('Failed to apply suggestion');
  }

  return response.json();
}

// Suggestion application handler
export function useSuggestionApplication(noteId: string, currentContent: string) {
  const [applying, setApplying] = useState(false);

  const applySuggestionToNote = async (suggestion: any, applyType = 'replace') => {
    setApplying(true);
    
    try {
      const result = await applySuggestion({
        noteId,
        originalContent: currentContent,
        suggestion: suggestion.suggestion,
        selectedText: suggestion.hasSelection ? suggestion.originalText : undefined,
        applyType,
        position: undefined // Could be calculated based on cursor position
      });
      
      return result.newContent;
    } catch (error) {
      toast.error('Failed to apply suggestion: ' + error.message);
      throw error;
    } finally {
      setApplying(false);
    }
  };

  return { applySuggestionToNote, applying };
}
```

## 🔧 AI Provider Configuration

### Provider Priority & Fallback
The system automatically selects the best available AI provider:

1. **Google Gemini** (Free tier) - Primary choice
2. **Groq** (Free tier) - Secondary fallback  
3. **OpenAI** (Paid) - Premium option
4. **Local fallback** - Error message if none available

### Model Capabilities
```typescript
const modelCapabilities = {
  'gemini-1.5-flash': {
    provider: 'Google',
    cost: 'Free',
    contextLength: 1000000,
    maxOutput: 8192,
    strengths: ['Fast', 'Good reasoning', 'Large context'],
    weaknesses: ['Newer model']
  },
  'llama3-8b-8192': {
    provider: 'Groq', 
    cost: 'Free',
    contextLength: 8192,
    maxOutput: 8192,
    strengths: ['Very fast', 'Open source'],
    weaknesses: ['Smaller context']
  },
  'gpt-3.5-turbo': {
    provider: 'OpenAI',
    cost: 'Paid',
    contextLength: 16384,
    maxOutput: 4096,
    strengths: ['Reliable', 'Well tested'],
    weaknesses: ['Costs money']
  }
};
```

## 🎯 System Prompts & Context Building

### Main System Prompt (Vietnamese)
```
Bạn là trợ lý AI thông minh cho ứng dụng ghi chú cá nhân AI Notes. 

🎯 NHIỆM VỤ CHÍNH:
- Trả lời câu hỏi dựa CHÍNH XÁC trên nội dung ghi chú được cung cấp
- Tìm kiếm và tổng hợp thông tin từ nhiều ghi chú nếu cần
- Cung cấp trích dẫn rõ ràng từ các ghi chú gốc

📋 QUY TẮC QUAN TRỌNG:
1. CHỈ sử dụng thông tin có trong phần "Context from your notes"
2. Nếu không tìm thấy thông tin, nói: "Tôi không tìm thấy thông tin này trong ghi chú của bạn."
3. Luôn trích dẫn nguồn: tên ghi chú và tiêu đề phần
4. KHÔNG bao giờ tự suy diễn hay tạo thông tin không có
```

### Context Building Process
```typescript
const buildChatContext = async (query: string, userId: string) => {
  // 1. Semantic search for relevant chunks
  const relevantChunks = await vectorsService.semanticSearch(query, userId, 10);
  
  // 2. Build context with token management
  let context = '';
  const citations = [];
  let tokenCount = 0;
  const maxTokens = 3000; // 70% of model context for user content
  
  for (const chunk of relevantChunks) {
    const chunkTokens = estimateTokens(chunk.chunkContent);
    if (tokenCount + chunkTokens > maxTokens) break;
    
    // Add structured context
    context += `--- ${chunk.noteTitle}${chunk.heading ? ` > ${chunk.heading}` : ''} ---\n`;
    context += chunk.chunkContent + '\n\n';
    
    // Track citations  
    citations.push({
      title: chunk.noteTitle,
      heading: chunk.heading
    });
    
    tokenCount += chunkTokens + 20;
  }
  
  return { context, citations };
};
```

## 🧪 Testing Examples

### Manual Testing with cURL

**Stream chat:**
```bash
curl -X POST http://localhost:3001/api/chat/stream \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "What are my notes about AI?"}' \
  --no-buffer
```

**Complete response:**
```bash
curl -X POST http://localhost:3001/api/chat/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Summarize my machine learning notes",
    "model": "gemini-1.5-flash"
  }'
```

**Generate suggestion:**
```bash
curl -X POST http://localhost:3001/api/chat/suggest \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my note content that needs improvement.",
    "suggestionType": "improve"
  }'
```

### Complete Chat Interface Example
```tsx
// components/CompleteChatInterface.tsx
export function CompleteChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isStreaming) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsStreaming(true);
    setCurrentResponse('');

    try {
      const { stream, citations } = await streamChatResponse(message);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let fullResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setCurrentResponse(fullResponse);
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant', 
        content: fullResponse,
        citations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentResponse('');

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        error: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>💬 Chat with Your Notes</h2>
        <div className="chat-status">
          {isStreaming && <span className="streaming">AI is thinking...</span>}
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isStreaming && currentResponse && (
          <div className="streaming-message">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble assistant">
              <ReactMarkdown>{currentResponse}</ReactMarkdown>
              <span className="typing-cursor">▊</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your notes..."
            disabled={isStreaming}
            rows={1}
            className="chat-input"
          />
          <button 
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isStreaming}
            className="send-button"
          >
            {isStreaming ? <Spinner /> : <SendIcon />}
          </button>
        </div>
        
        <div className="input-suggestions">
          <button onClick={() => setInputValue("What are my main topics?")}>
            What are my main topics?
          </button>
          <button onClick={() => setInputValue("Summarize my recent notes")}>
            Summarize recent notes
          </button>
          <button onClick={() => setInputValue("Find connections between my ideas")}>
            Find connections
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

**Next:** [Settings & Usage API](./07-settings.md)
