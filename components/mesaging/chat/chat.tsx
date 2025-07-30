import React, { useEffect, useMemo } from "react";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import ChatBottombar from "./chat-bottombar";
import useChatStore from "@/hooks/useChatStore";
import { Message } from "@/hooks/useChatStore";

interface ChatProps {
  messages?: Message[];
  selectedUser: any;
  isMobile: boolean;
}

export function Chat({ messages, selectedUser, isMobile }: ChatProps) {
  const messagesState = useChatStore((state) => state.messages);
  const isConnected = useChatStore((state) => state.isConnected);

  // Use memo to prevent unnecessary re-renders
  const sortedMessages = useMemo(() => {
    return [...messagesState].sort((a, b) => a.at - b.at);
  }, [messagesState]);

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={sortedMessages}
        selectedUser={selectedUser}
        isMobile={isMobile}
      />

      <ChatBottombar isMobile={isMobile} />
    </div>
  );
}
