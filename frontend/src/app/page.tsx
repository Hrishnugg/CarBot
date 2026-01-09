"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import {
  Car,
  Plus,
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
  Moon,
  Sun,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

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
  const [isDark, setIsDark] = useState(true);
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
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with New Chat */}
          <div className="p-4 pt-4">
            <Button
              onClick={clearChat}
              variant="outline"
              className="w-full justify-start gap-3 h-11 px-3 border-sidebar-border hover:bg-sidebar-accent"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New chat</span>
            </Button>
          </div>

          {/* Chat History Section */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="pt-2 pb-4">
              <p className="px-2 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Today
              </p>
              <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-left hover:bg-sidebar-accent transition-colors group">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">Welcome to CarBot</span>
              </button>
            </div>

            {/* Capabilities Section */}
            <div className="py-4 border-t border-sidebar-border">
              <p className="px-2 mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Capabilities
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-medium">Web Search</p>
                    <p className="text-xs text-muted-foreground">Real-time info</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="font-medium">Gemini 3 Flash</p>
                    <p className="text-xs text-muted-foreground">Latest model</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm">
                  <Car className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="font-medium">Car Expert</p>
                    <p className="text-xs text-muted-foreground">Specialized AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Car className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">CarBot</p>
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="h-9 w-9"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
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
        <header className="flex items-center h-14 px-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden mr-2"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm font-medium">CarBot</span>
          </div>

          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="h-8 w-8"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </header>

        {/* Chat Area */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto w-full px-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center py-12">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 mb-6">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-semibold mb-2">
                  How can I help you today?
                </h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Ask me anything about cars - specs, comparisons, recommendations, or the latest automotive news.
                </p>

                {/* Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.question)}
                        className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent text-left transition-colors"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                        <span className="text-sm">{suggestion.question}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs">
                          <Car className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[85%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5"
                          : ""
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {getMessageContent(message)}
                        {isLoading &&
                          message.role === "assistant" &&
                          message.id === messages[messages.length - 1]?.id && (
                            <span className="inline-flex items-center ml-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                            </span>
                          )}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative flex items-end gap-2 p-2 rounded-2xl border border-border bg-card shadow-sm">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm py-3 px-2"
                />
                {isLoading ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={stop}
                    className="h-10 w-10 shrink-0 rounded-xl"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="h-10 w-10 shrink-0 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              CarBot can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
