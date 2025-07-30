"use client";

import React, { useState, useCallback, memo } from "react";
import { useUser } from "@clerk/nextjs";
import { Message } from "@/hooks/useChatStore";
import { Button } from "@/components/mesaging/ui/button";
import { Check, X, Edit, Trash2 } from "lucide-react";
import useChatStore from "@/hooks/useChatStore";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isOwn,
}: ChatMessageProps) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const { editMessage, deleteMessage } = useChatStore();

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(message.text);
  }, [message.text]);

  const handleSaveEdit = useCallback(() => {
    if (editText.trim() !== message.text) {
      editMessage(message.id, editText.trim());
    }
    setIsEditing(false);
  }, [editText, message.id, message.text, editMessage]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditText(message.text);
  }, [message.text]);

  const handleDelete = useCallback(() => {
    deleteMessage(message.id);
  }, [message.id, deleteMessage]);

  const getStatusIcon = useCallback(() => {
    if (!isOwn) return null;
    switch (message.status) {
      case "sending":
        return (
          <svg
            className="h-3 w-3 text-gray-400 animate-spin"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      case "sent":
        return <span className="text-xs text-gray-600">✓</span>;
      case "delivered":
        return <span className="text-xs text-white ">✓✓</span>;
      case "read":
        return <span className="text-xs text-white">✓✓</span>;
      default:
        return null;
    }
  }, [isOwn, message.status]);

  const formattedTime = new Date(message.at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className={`flex mb-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className={`relative group ${isOwn ? "flex flex-row-reverse gap-2" : "flex gap-2"}`}
        >
          {isEditing ? (
            <div className="flex items-center gap-2 min-w-[200px]">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === "Escape") handleCancelEdit();
                }}
                className="flex-1 text-sm p-2 border rounded resize-none bg-blue-600"
                rows={1}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`
                  relative px-3 py-1 rounded-lg
                  ${isOwn ? "bg-violet-500 text-white" : "bg-muted"}
                `}
              >
                <div className="flex items-end gap-2">
                  <span className="text-sm whitespace-pre-wrap break-words flex-1">
                    {message.text}
                  </span>
                  <div className="flex items-center gap-1 gap-y-2 flex-shrink-0 ml-2">
                    {message.edited && (
                      <span className="text-[10px] opacity-70">(edited)</span>
                    )}
                    <span className="text-[10px] opacity-70">
                      {formattedTime}
                    </span>
                    {getStatusIcon()}
                  </div>
                </div>
              </div>

              {isOwn && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-700"
                    onClick={handleEdit}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";
