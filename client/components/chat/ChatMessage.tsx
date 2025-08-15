import React from "react";
import {
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import type { Citation } from "@/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp?: string;
  isStreaming?: boolean;
}

export function ChatMessage({
  role,
  content,
  citations = [],
  timestamp,
  isStreaming = false,
}: ChatMessageProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const handleThumbsUp = () => {
    // TODO: Implement feedback functionality
    toast.success("Thanks for your feedback!");
  };

  const handleThumbsDown = () => {
    // TODO: Implement feedback functionality
    toast.success("Thanks for your feedback!");
  };

  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 group",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
        </div>
      )}

      <div className={cn("flex-1 max-w-[80%]", isUser && "flex justify-end")}>
        <Card
          className={cn(
            "transition-all duration-200",
            isUser
              ? "bg-primary text-primary-foreground ml-8"
              : "bg-muted/50 mr-8",
          )}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Message Content */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {isUser ? (
                  <p className="mb-0 whitespace-pre-wrap">{content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return (
                          <code
                            className={cn(
                              "bg-muted/80 px-1 py-0.5 rounded text-sm font-mono",
                              className,
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="bg-muted/80 p-3 rounded-lg overflow-x-auto">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                )}

                {isStreaming && (
                  <span className="inline-block w-2 h-5 bg-current animate-pulse ml-1" />
                )}
              </div>

              {/* Citations */}
              {citations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/20">
                  <p className="text-xs text-muted-foreground font-medium">
                    Sources:
                  </p>
                  <div className="space-y-1">
                    {citations.map((citation, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs bg-background/20 rounded px-2 py-1"
                      >
                        <Badge variant="secondary" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="flex-1 truncate">
                          {citation.title}
                        </span>
                        {citation.heading && (
                          <span className="text-muted-foreground">
                            • {citation.heading}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            // TODO: Navigate to source
                            toast.info("Source navigation coming soon");
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {!isUser && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleThumbsUp}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleThumbsDown}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>

                {timestamp && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-secondary" />
          </div>
        </div>
      )}
    </div>
  );
}
