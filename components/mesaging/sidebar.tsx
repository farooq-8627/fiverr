"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/mesaging/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/mesaging/ui/tooltip";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Message } from "@/hooks/useChatStore";

interface SidebarProps {
  isCollapsed: boolean;
  chats: {
    name: string;
    messages: Message[];
    avatar: string;
    variant: "secondary" | "ghost";
  }[];
  onClick?: () => void;
  isMobile: boolean;
  onChatSelect?: (chat: {
    name: string;
    messages: Message[];
    avatar: string;
    variant: "secondary" | "ghost";
  }) => void;
}

// Helper function to format timestamp
const formatMessageTime = (timestamp: number): string => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInHours =
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return diffInMinutes <= 1 ? "now" : `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h`;
  } else if (diffInDays === 1) {
    return "yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else {
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }
};

// Helper function to truncate message text
const truncateMessage = (text: string, maxLength: number = 35): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export function Sidebar({
  chats,
  isCollapsed,
  isMobile,
  onChatSelect,
}: SidebarProps) {
  const handleChatClick = (chat: {
    name: string;
    messages: Message[];
    avatar: string;
    variant: "secondary" | "ghost";
  }) => {
    if (onChatSelect) {
      onChatSelect(chat);
    }
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full bg-muted/10 dark:bg-muted/20 "
    >
      <div className="flex justify-between p-2">
        <div className="flex gap-2 items-center text-2xl">
          <p className="font-medium">Chats</p>
          <span className="text-zinc-300">({chats.length})</span>
        </div>

        <div>
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9"
            )}
          >
            <MoreHorizontal size={20} />
          </Link>

          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9"
            )}
          >
            <SquarePen size={20} />
          </Link>
        </div>
      </div>
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {chats.map((chat, index) => {
          const lastMessage =
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1]
              : null;

          return (
            <button
              key={index}
              className={cn(
                buttonVariants({ variant: chat.variant, size: "xl" }),
                chat.variant === "secondary" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start gap-4 p-3 h-auto min-h-[60px]"
              )}
              onClick={() => handleChatClick(chat)}
            >
              <Avatar className="flex justify-center items-center flex-shrink-0">
                <AvatarImage
                  src={chat.avatar}
                  alt={chat.name}
                  width={6}
                  height={6}
                  className="w-10 h-10"
                />
              </Avatar>

              <div className="flex flex-col flex-1 text-left min-w-0">
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-medium truncate text-sm">
                    {chat.name}
                  </span>
                  {lastMessage && (
                    <span className="text-xs text-zinc-400 flex-shrink-0 ml-2">
                      {formatMessageTime(lastMessage.at)}
                    </span>
                  )}
                </div>

                {lastMessage ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-400 truncate max-w-full">
                      {lastMessage.from?.name === chat.name
                        ? truncateMessage(lastMessage.text)
                        : `You: ${truncateMessage(lastMessage.text)}`}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-500 italic">
                    No messages yet
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
