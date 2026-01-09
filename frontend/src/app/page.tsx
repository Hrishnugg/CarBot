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
  Moon,
  Sun,
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
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Search,
    question: "Compare BMW M3 vs Mercedes C63 AMG",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Zap,
    question: "What's the fastest electric car in 2025?",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Globe,
    question: "Latest news on Tesla Model 3 refresh",
    color: "text-green-500",
    bg: "bg-green-500/10",
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
    // Initialize dark mode
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
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 pb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CarBot</h1>
              <p className="text-xs text-muted-foreground">AI Car Expert</p>
            </div>
          </div>

          <div className="px-6">
            <Separator className="opacity-50" />
          </div>

          {/* New Chat Button */}
          <div className="p-6 pt-4 pb-4">
            <Button
              onClick={clearChat}
              className="w-full gap-2 h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
              size="lg"
            >
              <Sparkles className="w-4 h-4" />
              New Chat
            </Button>
          </div>

          {/* Features */}
          <div className="flex-1 px-6 overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Capabilities
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/20">
                  <Globe className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Web Search</p>
                  <p className="text-xs text-muted-foreground">
                    Real-time information
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-500/20">
                  <Zap className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Gemini 2.0 Flash</p>
                  <p className="text-xs text-muted-foreground">Latest AI model</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/20">
                  <Car className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Car Expert</p>
                  <p className="text-xs text-muted-foreground">
                    Specialized knowledge
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs font-normal">
                Powered by Vercel AI SDK
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="h-8 w-8"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Chat</h2>
            <p className="text-xs text-muted-foreground">
              Ask anything about cars
            </p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="gap-2 h-9"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </Button>
          )}
        </header>

        {/* Chat Area */}
        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center px-4">
                <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 mb-8 shadow-2xl shadow-orange-500/30">
                  <Car className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Welcome to CarBot
                </h2>
                <p className="text-muted-foreground mb-10 max-w-lg text-base leading-relaxed">
                  Your AI-powered car enthusiast. Ask about specs, comparisons,
                  recommendations, or the latest automotive news.
                </p>

                {/* Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <Card
                        key={index}
                        className="cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200 border-border/50 bg-card/50 backdrop-blur-sm group"
                        onClick={() => handleSuggestionClick(suggestion.question)}
                      >
                        <CardContent className="flex items-center gap-4 p-5">
                          <div
                            className={`flex items-center justify-center w-11 h-11 rounded-xl ${suggestion.bg} group-hover:scale-110 transition-transform duration-200`}
                          >
                            <Icon className={`w-5 h-5 ${suggestion.color}`} />
                          </div>
                          <span className="text-sm text-left font-medium leading-snug">
                            {suggestion.question}
                          </span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-8 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-10 h-10 shrink-0 shadow-md">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                            : "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
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
                      className={`flex-1 max-w-[80%] ${
                        message.role === "user" ? "text-right" : ""
                      }`}
                    >
                      <Card
                        className={`inline-block shadow-md ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                            : "bg-card border-border/50"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="text-sm whitespace-pre-wrap leading-relaxed">
                            {getMessageContent(message)}
                            {isLoading &&
                              message.role === "assistant" &&
                              message.id === messages[messages.length - 1]?.id && (
                                <span className="inline-flex items-center ml-2">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
        <div className="border-t border-border/50 bg-gradient-to-t from-card via-card/95 to-card/50 backdrop-blur-xl p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about cars..."
                    disabled={isLoading}
                    rows={1}
                    className="min-h-[56px] max-h-[200px] resize-none pr-4 py-4 text-base rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors shadow-sm"
                  />
                </div>
                {isLoading ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={stop}
                    className="h-14 w-14 shrink-0 rounded-xl shadow-lg"
                  >
                    <Square className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:shadow-none disabled:from-muted disabled:to-muted"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              CarBot may produce inaccurate information. Verify important details.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
