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
  ChevronDown,
  Mic,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const suggestions = [
  {
    icon: Car,
    question: "Best sports cars under $50k",
  },
  {
    icon: Search,
    question: "Compare BMW M3 vs C63 AMG",
  },
  {
    icon: Zap,
    question: "Fastest electric cars in 2025",
  },
  {
    icon: Globe,
    question: "Tesla Model 3 refresh news",
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
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#171717] dark:bg-[#171717] flex flex-col transform transition-transform duration-200 ease-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* New Chat Button */}
        <div className="p-2">
          <button
            onClick={clearChat}
            className="w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-white/90 hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New chat</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-2">
          {/* Recent Section */}
          <div className="py-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-white/50">Recent</span>
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors text-left">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">Welcome to CarBot</span>
            </button>
          </div>

          {/* Capabilities Section */}
          <div className="py-2 mt-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-white/50">Capabilities</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-white/80">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Web Search</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-white/80">
                <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Gemini 3 Flash</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-white/80">
                <Car className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Car Expert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 mt-auto">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white/90">CarBot</p>
            </div>
            {isDark ? (
              <Sun className="w-4 h-4 text-white/50" />
            ) : (
              <Moon className="w-4 h-4 text-white/50" />
            )}
          </button>
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
      <main className="flex-1 flex flex-col min-w-0 bg-[#212121] dark:bg-[#212121]">
        {/* Header */}
        <header className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white/70 hover:text-white hover:bg-white/10"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          <div className="flex-1 flex items-center justify-center">
            <button className="flex items-center gap-1 text-white/90 hover:text-white">
              <span className="text-base font-medium">CarBot</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </header>

        {/* Chat Area */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto w-full px-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center py-8">
                <h1 className="text-3xl font-semibold text-white mb-8">
                  What can I help with?
                </h1>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.question)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-colors"
                      >
                        <Icon className="w-4 h-4 text-white/50 shrink-0" />
                        <span className="text-sm text-white/80">{suggestion.question}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0">
                        <Car className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] ${
                        message.role === "user"
                          ? "bg-[#2f2f2f] text-white rounded-3xl px-5 py-3"
                          : "text-white/90"
                      }`}
                    >
                      <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {getMessageContent(message)}
                        {isLoading &&
                          message.role === "assistant" &&
                          message.id === messages[messages.length - 1]?.id && (
                            <span className="inline-flex items-center ml-1">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </span>
                          )}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-[#5a5a5a] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 pb-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative flex items-center bg-[#2f2f2f] rounded-3xl border border-white/10">
                <button
                  type="button"
                  className="p-3 text-white/50 hover:text-white/80 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>

                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything"
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 min-h-[24px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] text-white placeholder:text-white/50 py-3 px-0"
                />

                <div className="flex items-center gap-1 pr-2">
                  {isLoading ? (
                    <button
                      type="button"
                      onClick={stop}
                      className="p-2 text-white/50 hover:text-white/80 transition-colors"
                    >
                      <Square className="w-5 h-5" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="p-2 text-white/50 hover:text-white/80 transition-colors"
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                      <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-2 text-white/50 hover:text-white/80 disabled:text-white/20 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
            <p className="mt-3 text-center text-xs text-white/40">
              CarBot can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
