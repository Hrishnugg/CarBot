"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Loader2, ArrowUp, Plus, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if ((message.trim() || files.length > 0) && !isLoading && !disabled) {
      onSendMessage(message.trim(), files.length > 0 ? files : undefined);
      setMessage("");
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* File previews */}
      {files.length > 0 && (
        <div className="w-full flex flex-wrap gap-2 mb-2 px-3">
          {files.map((file, index) => {
            const preview = getFilePreview(file);
            return (
              <div
                key={index}
                className="relative group flex items-center gap-2 bg-[#3a3a3a] rounded-lg px-3 py-2 text-sm text-gray-200"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt={file.name}
                    className="w-8 h-8 object-cover rounded"
                    onLoad={() => URL.revokeObjectURL(preview)}
                  />
                ) : (
                  getFileIcon(file)
                )}
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-1 p-0.5 hover:bg-[#4a4a4a] rounded transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div 
        className="relative w-full bg-[#303030] overflow-hidden grid items-center"
        style={{ borderRadius: '28px', padding: '10px', gridTemplateColumns: '48px 1fr 48px', gap: '8px' }}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          multiple
          accept="image/*,.pdf,.txt,.md"
          onChange={handleFileChange}
        />

        {/* Plus Button - Left column */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-9 w-9 flex items-center justify-center text-gray-400 hover:text-white bg-[#424242] hover:bg-[#505050] rounded-full transition-colors"
            aria-label="Add attachments"
          >
            <Plus className="w-5 h-5 stroke-[2px]" />
          </button>
        </div>

        {/* Text Input - Middle column */}
        <div className="flex items-center min-h-[36px] overflow-hidden">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            disabled={isLoading || disabled}
            rows={1}
            className="flex-1 max-h-[200px] bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-white placeholder-gray-500 text-[1rem]"
            style={{ overflowY: 'hidden', padding: 0, minHeight: '24px', lineHeight: '24px' }}
          />
        </div>
        
        {/* Send Button - Right column */}
        <div className="flex items-center gap-1.5 px-1">
          <Button
            onClick={handleSubmit}
            disabled={(!message.trim() && files.length === 0) || isLoading || disabled}
            size="icon"
            className={`h-9 w-9 rounded-full transition-all duration-200 ${
              (message.trim() || files.length > 0) && !isLoading 
                ? "bg-white text-black hover:bg-gray-200" 
                : "bg-[#676767]/30 text-gray-400 hover:bg-[#676767]/30 cursor-not-allowed"
            }`}
            variant="ghost"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5 stroke-[2.5px]" />
            )}
          </Button>
        </div>
      </div>
      <div className="text-center text-[11px] text-gray-500 pt-3 font-normal">
        <span>CarBot can make mistakes. Check important info.</span>
      </div>
    </div>
  );
}
