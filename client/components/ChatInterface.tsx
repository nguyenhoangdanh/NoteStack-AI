import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Settings, Citation } from '../types';
import { useChatStream, useSettings } from '../hooks';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  SendIcon, 
  BrainIcon, 
  SparklesIcon, 
  FileTextIcon,
  RefreshCwIcon,
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  MoreHorizontalIcon,
  MicIcon,
  StopCircleIcon
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

interface ChatInterfaceProps {
  settings: Settings | null;
}

interface ChatMessage extends Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: number;
  loading?: boolean;
  error?: boolean;
}

// Fix findLastIndex for older TypeScript targets
const findLastIndex = <T,>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean): number => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
};

export function ChatInterface({ settings }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentCitations, setCurrentCitations] = useState<Citation[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [suggestions, setSuggestions] = useState<string[]>([
    "What are my notes about?",
    "Summarize my recent notes",
    "Find connections between my ideas",
    "What have I written about AI?",
    "Show me my most important notes"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { mutateAsync: streamChat } = useChatStream();
  const { data: settingsData } = useSettings();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsStreaming(true);
    setCurrentResponse('');
    setCurrentCitations([]);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const { stream, citations } = await streamChat({
        query: message,
        model: settingsData?.model,
        maxTokens: settingsData?.maxTokens,
      });
      setCurrentCitations(citations);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setCurrentResponse(fullResponse);
        
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          reader.cancel();
          break;
        }
      }

      // Add AI response to messages
      if (!abortControllerRef.current?.signal.aborted) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullResponse,
          citations,
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
      
      setCurrentResponse('');
      
    } catch (error) {
      console.error('Chat error:', error);
      
      if (abortControllerRef.current?.signal.aborted) {
        // Request was intentionally aborted
        return;
      }
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get AI response');
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setCurrentResponse('');
      toast.info('Response generation stopped');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentResponse('');
    setCurrentCitations([]);
    toast.success('Chat cleared');
  };

  const regenerateResponse = async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      // Remove the last assistant message if it exists
      setMessages(prev => {
        const lastAssistantIndex = findLastIndex(prev, m => m.role === 'assistant');
        if (lastAssistantIndex !== -1) {
          return prev.slice(0, lastAssistantIndex);
        }
        return prev;
      });
      
      await sendMessage(lastUserMessage.content);
    }
  };

  const MessageComponent = ({ message }: { message: ChatMessage }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${
        message.role === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : message.error 
            ? 'bg-destructive/10 border border-destructive/20' 
            : 'bg-muted'
      } rounded-lg px-4 py-3`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {message.role === 'assistant' && <BrainIcon className="h-4 w-4" />}
            <span className="font-medium">
              {message.role === 'user' ? 'You' : 'AI Assistant'}
            </span>
            {message.error && <Badge variant="destructive">Error</Badge>}
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyMessage(message.content)}
              className="h-6 w-6"
            >
              <CopyIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                
                return language ? (
                  <SyntaxHighlighter
                    style={tomorrow as any}
                    language={language}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-muted-foreground/20">
            <div className="text-xs text-muted-foreground mb-1">Sources:</div>
            <div className="flex flex-wrap gap-1">
              {message.citations.map((citation, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  📝 {citation.title}
                  {citation.heading && ` → ${citation.heading}`}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[600px] flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="history">Chat History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <BrainIcon className="h-5 w-5 text-primary" />
              <span className="font-medium">AI Chat Assistant</span>
              <Badge variant="outline">{settingsData?.model || 'Default Model'}</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={regenerateResponse} disabled={isStreaming}>
                  <RefreshCwIcon className="h-4 w-4" />
                </Button>
              )}
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearChat} disabled={isStreaming}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && !isStreaming && (
                <div className="text-center space-y-4 py-12">
                  <SparklesIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                    <p className="text-muted-foreground mb-4">
                      Ask questions about your notes, request summaries, or get insights
                    </p>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => sendMessage(suggestion)}
                          disabled={isStreaming}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map(message => (
                <div key={message.id} className="group">
                  <MessageComponent message={message} />
                </div>
              ))}
              
              {/* Streaming response */}
              {isStreaming && currentResponse && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[80%] bg-muted rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <BrainIcon className="h-4 w-4" />
                      <span className="font-medium">AI Assistant</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{currentResponse}</ReactMarkdown>
                    </div>
                    
                    {currentCitations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                        <div className="text-xs text-muted-foreground mb-1">Sources:</div>
                        <div className="flex flex-wrap gap-1">
                          {currentCitations.map((citation, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              📝 {citation.title}
                              {citation.heading && ` → ${citation.heading}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  placeholder="Ask about your notes, request summaries, or get insights..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isStreaming}
                  className="resize-none"
                />
              </div>
              
              {isStreaming ? (
                <Button variant="destructive" onClick={stopGeneration}>
                  <StopCircleIcon className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={() => sendMessage(inputValue)} 
                  disabled={!inputValue.trim()}
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Quick suggestions */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {suggestions.slice(0, 4).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => sendMessage(suggestion)}
                    disabled={isStreaming}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="flex-1 p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Content Suggestions</h3>
            <p className="text-muted-foreground">
              Get AI-powered suggestions to improve your notes
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Improve Writing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enhance clarity and style of your notes
                  </p>
                  <Button size="sm" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get suggestions for relevant examples
                  </p>
                  <Button size="sm" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Expand Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add more detail and depth to your notes
                  </p>
                  <Button size="sm" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Summarize</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create concise summaries of long notes
                  </p>
                  <Button size="sm" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chat History</h3>
            
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <FileTextIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No chat history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.filter(m => m.role === 'user').map((message, index) => (
                  <Card key={message.id} className="cursor-pointer hover:bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-2">{message.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => sendMessage(message.content)}
                        >
                          <RefreshCwIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
