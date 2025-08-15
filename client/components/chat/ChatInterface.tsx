import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import type { ChatRequest, Citation } from "@/types";
import { toast } from "react-hot-toast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: string;
}

const suggestedQueries = [
  "Summarize my recent notes about React",
  "Help me organize my project notes",
  "What are the key points from my meeting notes?",
  "Find connections between my research notes",
  "Create a summary of my learning progress",
];

const models = [
  {
    value: "gpt-4o",
    label: "GPT-4 Optimized",
    description: "Best for complex reasoning",
  },
  { value: "gpt-4", label: "GPT-4", description: "High quality responses" },
  {
    value: "gpt-3.5-turbo",
    label: "GPT-3.5 Turbo",
    description: "Fast and efficient",
  },
];

interface ChatInterfaceProps {
  initialMessage?: string;
  context?: string;
}

export function ChatInterface({ initialMessage, context }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialMessage || "");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { completeChatAsync, isCompletingChat } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isCompletingChat) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const request: ChatRequest = {
        query: text,
        model: selectedModel,
        maxTokens: 2000,
      };

      const response = await completeChatAsync(request);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        citations: response.citations,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get AI response. Please try again.");
      console.error("Chat error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInput("");
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full max-h-[800px]">
      {/* Chat Header */}
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Assistant
            <Badge variant="secondary" className="ml-2">
              {selectedModel}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div>
                      <div className="font-medium">{model.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {model.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              disabled={messages.length === 0}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Start a conversation
              </h3>
              <p className="text-muted-foreground mb-6">
                Ask me anything about your notes, get summaries, or explore
                connections between your ideas.
              </p>
            </div>

            {/* Suggested Queries */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Try asking:
              </p>
              <div className="space-y-2 max-w-md">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                    onClick={() => handleSuggestedQuery(query)}
                  >
                    <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                citations={message.citations}
                timestamp={message.timestamp}
              />
            ))}

            {isStreaming && (
              <ChatMessage
                role="assistant"
                content="Thinking..."
                isStreaming={true}
              />
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything about your notes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isCompletingChat}
            />
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isCompletingChat}
            className="btn-gradient self-end h-[60px] px-6"
          >
            {isCompletingChat ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{input.length}/2000</span>
        </div>
      </div>
    </div>
  );
}
