import React, { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Send,
  User,
  Bot,
  Copy,
  ExternalLink,
  Trash2,
  Settings,
} from "lucide-react";
import { useChatStore, useUIStore } from "../lib/store";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "../lib/utils";
import { useChatStream, useSettings } from "../hooks";

interface ChatPanelProps {
  className?: string;
}

interface Citation {
  title: string;
  heading?: string;
}

export default function ChatPanel({ className }: ChatPanelProps) {
  const [localInput, setLocalInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    input,
    setInput,
    addMessage,
    updateLastMessage, // Use the new method
    setLoading,
    clearMessages,
  } = useChatStore();
  const { setSelectedNoteId, setSettingsOpen } = useUIStore();
  const { data: settings } = useSettings();
  const chatStream = useChatStream();

  // Sync with local chat store
  useEffect(() => {
    if (input && input !== localInput) {
      setLocalInput(input);
      setInput(""); // Clear the store input
    }
  }, [input, localInput, setInput]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!localInput.trim() || isLoading) return;

    setLoading(true);

    // Add user message
    const userMessage = {
      role: "user" as const,
      content: localInput.trim(),
    };
    addMessage(userMessage);

    const query = localInput.trim();
    setLocalInput("");

    try {
      console.log('🚀 Sending chat request:', query);
      
      const response = await chatStream.mutateAsync({
        query: query,
        model: settings?.model,
        maxTokens: settings?.maxTokens,
      });
      const { stream, citations } = response;
      
      console.log('📡 Received stream response, citations:', citations.length);
      
      // Add assistant message placeholder
      addMessage({
        role: "assistant" as const,
        content: "",
        citations,
      });

      // Process the stream
      let assistantContent = "";
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('✅ Stream completed, final content length:', assistantContent.length);
            break;
          }
          
          // Decode chunk and add to content
          const chunk = decoder.decode(value, { stream: true });
          
          if (chunk) {
            assistantContent += chunk;
            console.log('📝 Updating content, total length:', assistantContent.length);
            
            // Update the last message in real-time
            updateLastMessage(assistantContent);
          }
        }
        
        // Ensure final update
        if (assistantContent) {
          updateLastMessage(assistantContent);
        }
        
      } catch (streamError) {
        console.error('❌ Stream processing error:', streamError);
        
        if (!assistantContent) {
          // If no content was received, show fallback
          updateLastMessage("Xin lỗi, tôi gặp lỗi khi xử lý phản hồi. Vui lòng thử lại.");
        }
      } finally {
        reader.releaseLock();
      }
      
    } catch (error) {
      console.error('❌ Chat request failed:', error);
      
      let errorMessage = "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn.";
      
      // Handle specific errors
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        errorMessage = "⚠️ Dịch vụ AI hiện không khả dụng do giới hạn quota. Đang sử dụng Google Gemini (miễn phí).";
      } else if (error.message?.includes('401')) {
        errorMessage = "🔒 Lỗi xác thực dịch vụ AI. Vui lòng kiểm tra cài đặt API key.";
      } else if (error.message?.includes('Network')) {
        errorMessage = "🌐 Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.";
      }
      
      addMessage({
        role: "assistant",
        content: `${errorMessage}\n\n**💡 Gợi ý:** Bạn vẫn có thể tìm kiếm ghi chú bằng thanh tìm kiếm phía trên hoặc thử lại sau ít phút.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      clearMessages();
    }
  };

  const handleOpenNote = (noteTitle: string) => {
    // This would need to be implemented to search and open the note
    console.log("Open note:", noteTitle);
  };

  const renderMessage = (message: any, index: number) => {
    const isUser = message.role === "user";
    const citations = message.citations || [];

    return (
      <div
        key={message.id || index}
        className={cn("group flex gap-3 p-4", isUser ? "bg-muted/50" : "")}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            isUser ? "bg-primary text-primary-foreground" : "bg-secondary",
          )}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        <div className="flex-1 space-y-2">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                code: ({ children, className, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  
                  return !isInline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow as any}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
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
              <div className="text-xs font-medium text-muted-foreground">
                Sources:
              </div>
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
          <h3 className="font-semibold">💬 Hỏi đáp với Ghi chú</h3>
          <p className="text-sm text-muted-foreground">
            AI tìm kiếm và trả lời từ ghi chú của bạn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Gemini 1.5 Flash
          </Badge>
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
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-0" ref={scrollAreaRef}>
        <div className="min-h-full">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center space-y-4">
                <Bot className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <h4 className="font-medium">🤖 Trợ lý AI Notes</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hỏi tôi bất cứ điều gì về ghi chú của bạn, tôi sẽ tìm kiếm và trả lời với trích dẫn rõ ràng.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>💡 Thử hỏi:</p>
                  <ul className="space-y-1 text-left">
                    <li>• "Tôi đã viết gì về machine learning?"</li>
                    <li>• "Tóm tắt các ý tưởng dự án của tôi"</li>
                    <li>• "Tìm ghi chú về tips năng suất"</li>
                    <li>• "Mô tả hôm nay đã học được gì?"</li>
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-800 dark:text-green-200">
                    <strong>✅ Đang sử dụng:</strong> Google Gemini 1.5 Flash (Miễn phí) - Nhanh, thông minh và không giới hạn!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {messages.map(renderMessage)}
              {isLoading && (
                <div className="flex gap-3 p-4">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
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
            placeholder="Hỏi tôi bất cứ điều gì về ghi chú của bạn..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!localInput.trim() || isLoading}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {settings && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>🔥 {settings.model} • Tối đa {settings.maxTokens} tokens</span>
            <span>🆓 Miễn phí hoàn toàn</span>
          </div>
        )}
      </div>
    </Card>
  );
}
