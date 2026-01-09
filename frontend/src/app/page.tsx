"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { Car, Sparkles, Github, Menu, X, User, Loader2, Globe, Zap, Search, DollarSign } from "lucide-react";

const suggestions = [
  {
    icon: Car,
    question: "What are the best sports cars under $50k?",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Search,
    question: "Compare the BMW M3 vs Mercedes C63 AMG",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Zap,
    question: "What's the fastest electric car in 2025?",
    color: "from-green-500 to-green-600",
  },
  {
    icon: DollarSign,
    question: "Most reliable used cars for first-time buyers",
    color: "from-purple-500 to-purple-600",
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
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

  // Helper to get message text content
  const getMessageContent = (message: typeof messages[0]): string => {
    // Messages use parts-based structure
    const parts = message.parts || [];
    return parts
      .filter((part) => part.type === "text" || part.type === "reasoning")
      .map((part) => ("text" in part ? part.text : ""))
      .join("");
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">CarBot</h1>
              <p className="text-xs text-gray-500">AI Car Enthusiast</p>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={clearChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all"
            >
              <Sparkles className="w-4 h-4" />
              New Chat
            </button>
          </div>

          {/* Features List */}
          <div className="flex-1 px-4 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Google Search Enabled
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Gemini 2.0 Flash
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                Car Expert Knowledge
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Real-time Streaming
              </li>
            </ul>

            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">
              Tools Available
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-blue-400" />
                Web Search
              </li>
              <li className="flex items-center gap-2">
                <Search className="w-3 h-3 text-orange-400" />
                Car Comparisons
              </li>
              <li className="flex items-center gap-2">
                <Car className="w-3 h-3 text-green-400" />
                Spec Lookup
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="w-3 h-3 text-purple-400" />
                Recommendations
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-4 px-4 py-3 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Chat</h2>
            <p className="text-xs text-gray-500">
              Powered by Gemini 2.0 Flash with Google Search
            </p>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 glow-orange">
                <Car className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome to <span className="gradient-text">CarBot</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-md">
                Your AI-powered car enthusiast assistant. Ask me anything about
                cars, from specifications to recommendations!
              </p>

              {/* Suggested Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {suggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.question)}
                      className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl text-left transition-all group"
                    >
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${suggestion.color} group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {suggestion.question}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-appear flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-gradient-to-br from-orange-500 to-orange-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Car className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message content */}
                  <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm"
                          : "bg-gray-800 text-gray-100 rounded-tl-sm"
                      }`}
                    >
                      <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                        {getMessageContent(message)}
                        {isLoading && message.role === "assistant" && message.id === messages[messages.length - 1]?.id && (
                          <span className="inline-flex items-center gap-1 text-orange-400 ml-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-2 p-2 bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-blue-500 focus-within:glow transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about cars..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none px-3 py-2 max-h-[200px] min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
            <p className="mt-2 text-center text-xs text-gray-500">
              CarBot uses Gemini 2.0 Flash with Google Search capabilities
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
