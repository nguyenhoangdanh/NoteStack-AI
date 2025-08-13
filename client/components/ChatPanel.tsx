import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Send, 
  User, 
  Bot, 
  Copy, 
  ExternalLink,
  Trash2,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useChatStore, useUIStore } from '../lib/store';
import { useSettings } from '../lib/query';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatPanelProps {
  className?: string;
}

interface Citation {
  title: string;
  heading?: string;
}

export default function ChatPanel({ className }: ChatPanelProps) {
  const [localInput, setLocalInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { messages, isLoading, input, setInput, addMessage, setLoading, clearMessages } = useChatStore();
  const { setSelectedNoteId, setSettingsOpen } = useUIStore();
  const settings = useSettings();

  // Use Vercel AI SDK for streaming
  const { 
    messages: streamMessages, 
    input: streamInput, 
    handleInputChange, 
    handleSubmit,
    isLoading: streamLoading,
    error,
    setMessages
  } = useChat({
    api: '/api/chat/stream',
    headers: {
      'Content-Type': 'application/json',
    },
    onResponse: (response) => {
      // Extract citations from response headers
      const citationsHeader = response.headers.get('X-Citations');
      if (citationsHeader) {
        try {
          const citations = JSON.parse(citationsHeader);
          // Store citations with the message (handled in onFinish)
        } catch (e) {
          console.error('Failed to parse citations:', e);
        }
      }
    },
    onFinish: (message) => {
      // Message is automatically added to streamMessages by useChat
      setLoading(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setLoading(false);
    },
  });

  // Sync with local chat store
  useEffect(() => {
    if (input && input !== streamInput) {
      setLocalInput(input);
      setInput(''); // Clear the store input
    }
  }, [input, streamInput, setInput]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [streamMessages, isLoading, streamLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localInput.trim() || streamLoading) return;

    setLoading(true);
    
    // Add user message to local store
    addMessage({
      role: 'user',
      content: localInput.trim(),
    });

    // Handle the streaming request
    handleSubmit(e);
    setLocalInput('');
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add a toast notification here
  };

  const handleClearChat = () => {
    clearMessages();
    setMessages([]);
  };

  const handleOpenNote = (noteTitle: string) => {
    // This would need to search for the note by title and open it
    // For now, we'll just log it
    console.log('Open note:', noteTitle);
  };

  const renderMessage = (message: any, index: number) => {
    const isUser = message.role === 'user';
    const citations = message.citations || [];

    return (
      <div key={index} className={cn("flex gap-3 p-4", isUser ? "bg-muted/50" : "")}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
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
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Citations */}
          {citations.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Sources:</div>
              <div className="flex flex-wrap gap-2">
                {citations.map((citation: Citation, citationIndex: number) => (
                  <Badge
                    key={citationIndex}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-accent"
                    onClick={() => handleOpenNote(citation.title)}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {citation.title}
                    {citation.heading && ` > ${citation.heading}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Message actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyMessage(message.content)}
              className="h-6 px-2"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold">Ask My Notes</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered search through your notes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            disabled={streamMessages.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-0" ref={scrollAreaRef}>
        <div className="min-h-full">
          {streamMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center space-y-4">
                <Bot className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Start a conversation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask questions about your notes and I'll search through them to help you find answers.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Try asking:</p>
                  <ul className="space-y-1">
                    <li>"What did I write about machine learning?"</li>
                    <li>"Summarize my project ideas"</li>
                    <li>"Find notes about productivity tips"</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {streamMessages.map(renderMessage)}
              {(streamLoading || isLoading) && (
                <div className="flex gap-3 p-4">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            ref={inputRef}
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Ask a question about your notes..."
            disabled={streamLoading || isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!localInput.trim() || streamLoading || isLoading}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {error && (
          <div className="mt-2 text-sm text-destructive">
            Error: {error.message}
          </div>
        )}

        {settings && (
          <div className="mt-2 text-xs text-muted-foreground">
            Using {settings.model} • Max {settings.maxTokens} tokens
          </div>
        )}
      </div>
    </Card>
  );
}
