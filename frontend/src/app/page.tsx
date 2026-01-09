"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import {
  Car,
  Sparkles,
  Send,
  Menu,
  X,
  User,
  Loader2,
  Globe,
  Search,
  Zap,
  RotateCcw,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const suggestions = [
  {
    icon: Car,
    question: "What are the best sports cars under $50k?",
  },
  {
    icon: Search,
    question: "Compare BMW M3 vs Mercedes C63 AMG",
  },
  {
    icon: Zap,
    question: "What's the fastest electric car in 2025?",
  },
  {
    icon: Globe,
    question: "Latest news on Tesla Model 3 refresh",
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input.trim() });
      setInput("");
    }
  };

  const handleSuggestionClick = (question: string) => {
    if (!isLoading) {
      sendMessage({ text: question });
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        sendMessage({ text: input.trim() });
        setInput("");
      }
    }
  };

  const getMessageContent = (message: (typeof messages)[0]): string => {
    const parts = message.parts || [];
    return parts
      .filter((part) => part.type === "text" || part.type === "reasoning")
      .map((part) => ("text" in part ? part.text : ""))
      .join("");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CarBot</h1>
              <p className="text-xs text-muted-foreground">AI Car Expert</p>
            </div>
          </div>

          <Separator />

          {/* New Chat Button */}
          <div className="p-4">
            <Button onClick={clearChat} className="w-full gap-2" size="lg">
              <Sparkles className="w-4 h-4" />
              New Chat
            </Button>
          </div>

          {/* Features */}
          <div className="flex-1 px-4 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Capabilities
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Globe className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Web Search</p>
                  <p className="text-xs text-muted-foreground">Real-time information</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Zap className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Gemini 2.0 Flash</p>
                  <p className="text-xs text-muted-foreground">Latest AI model</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Car className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Car Expert</p>
                  <p className="text-xs text-muted-foreground">Specialized knowledge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Powered by Vercel AI SDK
              </Badge>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-4 px-4 h-16 border-b bg-card/50 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold">Chat</h2>
            <p className="text-xs text-muted-foreground">
              Ask anything about cars
            </p>
          </div>
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearChat} className="gap-2">
              <RotateCcw className="w-3 h-3" />
              Clear
            </Button>
          )}
        </header>

        {/* Chat Area */}
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-6">
                  <Car className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to CarBot</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Your AI-powered car enthusiast. Ask about specs, comparisons,
                  recommendations, or latest automotive news.
                </p>

                {/* Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <Card
                        key={index}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleSuggestionClick(suggestion.question)}
                      >
                        <CardContent className="flex items-center gap-3 p-4">
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm text-left">
                            {suggestion.question}
                          </span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-orange-500 text-white"
                        }
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Car className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`flex-1 max-w-[85%] ${
                        message.role === "user" ? "text-right" : ""
                      }`}
                    >
                      <Card
                        className={`inline-block ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="text-sm whitespace-pre-wrap">
                            {getMessageContent(message)}
                            {isLoading &&
                              message.role === "assistant" &&
                              message.id === messages[messages.length - 1]?.id && (
                                <span className="inline-flex items-center ml-2">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                </span>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-card/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about cars..."
                    disabled={isLoading}
                    rows={1}
                    className="min-h-[52px] max-h-[200px] resize-none pr-12"
                  />
                </div>
                {isLoading ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={stop}
                    className="h-[52px] w-[52px] shrink-0"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="h-[52px] w-[52px] shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              CarBot may produce inaccurate information. Verify important details.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
