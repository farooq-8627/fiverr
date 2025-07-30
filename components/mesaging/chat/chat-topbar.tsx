import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Info, Phone, Video, Trash2 } from "lucide-react";
import useChatStore from "@/hooks/useChatStore";

interface ChatTopbarProps {
  selectedUser: any;
}

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  const { deleteChat, typingUsers, connectedUsers } = useChatStore();

  const handleDeleteChat = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this entire chat? This action cannot be undone."
      )
    ) {
      deleteChat();
    }
  };

  const isTyping = typingUsers.has(selectedUser.clerkId);
  const otherUser = connectedUsers.find(
    (user) => user.id === selectedUser.clerkId
  );
  const isOnline = otherUser?.isOnline;
  const lastSeen = otherUser?.lastSeen;

  const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return "";
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "last seen just now";
    if (minutes < 60) return `last seen ${minutes}m ago`;
    if (hours < 24) return `last seen ${hours}h ago`;
    return `last seen ${days}d ago`;
  };

  const getStatusText = () => {
    if (isTyping) return "typing...";
    if (isOnline) return "online";
    if (lastSeen) return formatLastSeen(lastSeen);
    return "";
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src={selectedUser.avatar || "/default-avatar.png"}
            alt={selectedUser.name}
            width={6}
            height={6}
            className="w-10 h-10"
          />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{selectedUser.name}</span>
          {getStatusText() && (
            <span
              className={`text-xs ${
                isTyping ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              {getStatusText()}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDeleteChat}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
