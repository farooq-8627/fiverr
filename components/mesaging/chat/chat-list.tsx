import React, { useEffect, useRef, useCallback } from "react";
import { ChatMessage } from "./chat-message";
import { Message } from "@/hooks/useChatStore";
import { useUser } from "@clerk/nextjs";

interface ChatListProps {
  messages: Message[];
  selectedUser: any;
  isMobile: boolean;
}

export function ChatList({ messages, selectedUser, isMobile }: ChatListProps) {
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={`${message.id}-${message.status}`}
              message={message}
              isOwn={message.from.id === user?.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
