import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, RefreshCw, Download, Bot, User } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { toast } from 'react-hot-toast';
import type { ChatCompleteResponse, Citation } from '@/types';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'assistant',
    content: 'Hello! I\'m your AI assistant. I can help you with:\n\n• **Note analysis** - Analyze your notes for insights\n• **Content generation** - Help write and improve content\n• **Research assistance** - Find related information\n• **Summarization** - Create summaries of your notes\n\nWhat would you like to explore today?',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '2',
    type: 'user',
    content: 'Can you help me understand the main themes in my React development notes?',
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: '3',
    type: 'assistant',
    content: 'Based on your React development notes, I can identify several key themes:\n\n**1. Component Architecture**\n- Functional vs class components\n- Component composition patterns\n- Props and state management\n\n**2. State Management**\n- useState and useEffect hooks\n- Context API usage\n- External state libraries (Redux, Zustand)\n\n**3. Performance Optimization**\n- Memoization techniques\n- Code splitting strategies\n- Bundle optimization\n\n**4. Testing Approaches**\n- Unit testing with Jest\n- Component testing with React Testing Library\n- E2E testing patterns\n\nWould you like me to dive deeper into any of these themes?',
    citations: [
      { title: 'React Best Practices', heading: 'Component Patterns' },
      { title: 'State Management Guide', heading: 'Hook Patterns' },
    ],
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    completeChat, 
    isCompletingChat, 
    completeChatError,
    streamChat,
    isStreamingChat 
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isCompletingChat || isStreamingChat) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await completeChat({
        query: input.trim(),
        model: 'gpt-4',
        maxTokens: 1000,
      });

      if (response) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.response,
          citations: response.citations,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      toast.error('Failed to get AI response');
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const clearChat = () => {
    setMessages([mockMessages[0]]); // Keep welcome message
  };

  const exportChat = () => {
    const chatContent = messages
      .map(msg => `${msg.type === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
              <Bot className="h-8 w-8" />
              AI Assistant
            </h1>
            <p className="text-muted-foreground">
              Get intelligent help with your notes, research, and content creation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportChat}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={clearChat}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col card-gradient">
          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${
                      message.type === 'user' ? 'order-2' : ''
                    }`}>
                      <div
                        className={`rounded-lg p-4 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {message.content.split('\n').map((line, index) => (
                            <div key={index}>
                              {line.startsWith('•') ? (
                                <div className="ml-4">{line}</div>
                              ) : line.startsWith('**') && line.endsWith('**') ? (
                                <h4 className="font-semibold mt-3 mb-1">
                                  {line.slice(2, -2)}
                                </h4>
                              ) : (
                                <p className="mb-2">{line}</p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Citations */}
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.citations.map((citation, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {citation.title}
                                  {citation.heading && ` - ${citation.heading}`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message Actions */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(message.content)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="flex-shrink-0 order-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-secondary" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {(isCompletingChat || isStreamingChat) && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Ask me anything about your notes..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isCompletingChat || isStreamingChat}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isCompletingChat || isStreamingChat}
                className="btn-gradient"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Summarize my notes
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Find related content
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Generate ideas
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Improve writing
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
