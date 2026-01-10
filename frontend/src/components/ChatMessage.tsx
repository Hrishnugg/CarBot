"use client";

import { Globe, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Source {
  title: string;
  url: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
  isToolCalling?: boolean;
  toolName?: string;
}

export function ChatMessage({ role, content, sources, isStreaming, isToolCalling, toolName }: ChatMessageProps) {
  const isUser = role === "user";

  if (isUser) {
    // User message - right-aligned bubble
    return (
      <div className="w-full flex justify-end py-2">
        <div 
          className="bg-[#2f2f2f] rounded-3xl text-white text-[15px] break-words whitespace-pre-wrap max-w-[70%]"
          style={{ padding: '10px 18px' }}
        >
          {content}
        </div>
      </div>
    );
  }

  // Assistant message - clean text block without avatar/header
  return (
    <div className="w-full py-4">
      {/* Tool calling indicator */}
      {isToolCalling && (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-2 mb-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{toolName ? `Using ${toolName}...` : 'Thinking...'}</span>
        </div>
      )}
      
      <div className="prose-chat max-w-none">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
        {isStreaming && (
          <span className="inline-block w-2.5 h-5 ml-1 align-middle bg-white animate-pulse rounded-full" />
        )}
      </div>
      
      {sources && sources.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-full text-blue-400 transition-colors border border-white/10"
            >
              <Globe className="w-3 h-3 stroke-[1.5px]" />
              {source.title || "Source"}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
