"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [centerFiles, setCenterFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const centerFileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    api: "/api/chat",
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendWithFiles = async (text: string, files?: File[]) => {
    // For now, just send text - file handling will be added with multimodal support
    if (text.trim() || (files && files.length > 0)) {
      sendMessage({ text: text || "Please analyze the attached file(s)." });
    }
  };

  const handleCenterSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((inputValue.trim() || centerFiles.length > 0) && !isLoading) {
      handleSendWithFiles(inputValue, centerFiles);
      setInputValue('');
      setCenterFiles([]);
    }
  };

  const handleCenterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCenterFiles((prev) => [...prev, ...newFiles]);
    }
    if (centerFileInputRef.current) {
      centerFileInputRef.current.value = "";
    }
  };

  const removeCenterFile = (index: number) => {
    setCenterFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearChat = () => {
    setMessages([]);
    setSidebarOpen(true); // Keep sidebar open on desktop usually
  };

  return (
    <div className="chatgpt-container">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo-container" onClick={clearChat} style={{cursor: 'pointer'}}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <button className="icon-btn" onClick={() => setSidebarOpen(false)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="sidebar-content">
            <div className="nav-item" onClick={clearChat}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span>New chat</span>
            </div>
            <div className="nav-item">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>Search chats</span>
            </div>

            <div className="section-label">Your chats</div>
            <div className="nav-item">
              <span>D&B Document Requirements</span>
            </div>
          </div>

          <div className="user-profile">
            <div className="user-profile-inner">
              <div className="avatar">H</div>
              <div className="user-info">
                <span className="user-name">Hrishi Hari</span>
                <span className="user-plan">Plus</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <div className="model-selector" style={{cursor: 'default'}}>
            {!sidebarOpen && (
              <button className="icon-btn" onClick={() => setSidebarOpen(true)} style={{marginRight: '8px'}}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <span className="model-name">CarBot</span>
          </div>
          <div className="top-bar-actions">
            <button className="icon-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </button>
            <button className="icon-btn" onClick={clearChat}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center Content / Chat Area */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center">
             {messages.length === 0 ? (
                <div className="center-content w-full">
                    <h1 className="heading">What's on your mind today?</h1>
                    <div className="input-container">
                    {/* File previews for center input */}
                    {centerFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2 px-3">
                        {centerFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative flex items-center gap-2 bg-[#3a3a3a] rounded-lg px-3 py-2 text-sm text-gray-200"
                          >
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                            <span className="max-w-[120px] truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeCenterFile(index)}
                              className="ml-1 p-0.5 hover:bg-[#4a4a4a] rounded transition-colors"
                            >
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <form onSubmit={handleCenterSubmit} className="input-wrapper">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={centerFileInputRef}
                          hidden
                          multiple
                          accept="image/*,.pdf,.txt,.md"
                          onChange={handleCenterFileChange}
                        />
                        <button type="button" className="input-icon-btn" onClick={() => centerFileInputRef.current?.click()}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Ask anything"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" className="send-btn" disabled={!inputValue.trim() && centerFiles.length === 0}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
                            </svg>
                        </button>
                    </form>
                    </div>
                </div>
             ) : (
                <div className="flex flex-col w-full max-w-[48rem] pt-4 px-4" style={{ paddingBottom: '100px' }}>
                    {messages.map((message) => {
                      // Extract text content and check for tool calls from message.parts (AI SDK format)
                      let textContent = '';
                      let isToolCalling = false;
                      let toolName = '';
                      
                      if (message.parts) {
                        for (const part of message.parts) {
                          if (part.type === 'text') {
                            textContent += (part as { type: 'text'; text: string }).text;
                          } else if (part.type === 'tool-invocation') {
                            const toolPart = part as { type: 'tool-invocation'; toolInvocation: { toolName: string; state: string } };
                            if (toolPart.toolInvocation.state === 'call' || toolPart.toolInvocation.state === 'partial-call') {
                              isToolCalling = true;
                              toolName = toolPart.toolInvocation.toolName;
                            }
                          }
                        }
                      }
                      
                      const isLastMessage = message.id === messages[messages.length - 1]?.id;
                      
                      return (
                        <ChatMessage
                          key={message.id}
                          role={message.role as "user" | "assistant"}
                          content={textContent}
                          sources={[]}
                          isStreaming={isLoading && isLastMessage && message.role === 'assistant'}
                          isToolCalling={isToolCalling && isLastMessage && isLoading}
                          toolName={toolName === 'searchWeb' ? 'Web Search' : toolName}
                        />
                      );
                    })}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
             )}
        </div>
        
        {/* Chat Input (Bottom - Only visible when there are messages) */}
        {messages.length > 0 && (
             <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center" style={{
                 background: 'linear-gradient(to top, #212121 70%, transparent)',
             }}>
               <div className="w-full max-w-[48rem] px-4 pt-10 pb-6">
                 <ChatInput 
                   onSendMessage={handleSendWithFiles}
                   isLoading={isLoading}
                 />
               </div>
             </div>
        )}
      </div>
    </div>
  );
}
