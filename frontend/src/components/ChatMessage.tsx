"use client";

import { Car, User, Globe, Loader2 } from "lucide-react";

interface Source {
  title: string;
  url: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, sources, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`message-appear flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : "bg-gradient-to-br from-orange-500 to-orange-600"
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Car className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message content */}
      <div
        className={`flex-1 max-w-[80%] ${isUser ? "text-right" : ""}`}
      >
        <div
          className={`inline-block px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm"
              : "bg-gray-800 text-gray-100 rounded-tl-sm"
          }`}
        >
          <div className="prose prose-invert prose-sm max-w-none">
            {content.split('\n').map((line, i) => (
              <p key={i} className="mb-1 last:mb-0">
                {line || '\u00A0'}
              </p>
            ))}
            {isStreaming && (
              <span className="inline-flex items-center gap-1 text-orange-400">
                <Loader2 className="w-3 h-3 animate-spin" />
              </span>
            )}
          </div>
        </div>

        {/* Sources */}
        {sources && sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Globe className="w-3 h-3" />
                {source.title || "Source"}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
