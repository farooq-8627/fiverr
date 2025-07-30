"use client";

import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { EmojiPicker } from "../emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChatInput } from "./chat/chat-input";
import useChatStore from "@/hooks/useChatStore";

interface ChatBottombarProps {
  isMobile: boolean;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({ isMobile }: ChatBottombarProps) {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, startTyping, stopTyping, isConnected } = useChatStore();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);

    // Debounced typing indicator
    if (event.target.value.trim()) {
      if (!isTyping) {
        setIsTyping(true);
        startTyping();
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        stopTyping();
      }, 1000);
    } else {
      if (isTyping) {
        setIsTyping(false);
        stopTyping();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleThumbsUp = () => {
    if (!isConnected) return;

    sendMessage("👍");
    setMessage("");
  };

  const handleSend = () => {
    if (message.trim() && isConnected) {
      sendMessage(message.trim());
      setMessage("");

      // Clear typing state
      setIsTyping(false);
      stopTyping();

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Stop typing when component unmounts or message is cleared
  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [stopTyping]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="px-2 py-4 flex justify-between w-full items-center gap-3">
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "shrink-0"
              )}
            >
              <PlusCircle size={22} className="text-muted-foreground" />
            </Link>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-full p-2">
            {message.trim() || isMobile ? (
              <div className="flex gap-2">
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9",
                    "shrink-0"
                  )}
                >
                  <Mic size={22} className="text-muted-foreground" />
                </Link>
                {BottombarIcons.map((icon, index) => (
                  <Link
                    key={index}
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-9 w-9",
                      "shrink-0"
                    )}
                  >
                    <icon.icon size={22} className="text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  "shrink-0"
                )}
              >
                <Mic size={22} className="text-muted-foreground" />
              </Link>
            )}
          </PopoverContent>
        </Popover>
        {!message.trim() && !isMobile && (
          <div className="flex items-center">
            {BottombarIcons.map((icon, index) => (
              <Link
                key={index}
                href="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  "shrink-0"
                )}
              >
                <icon.icon size={22} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <ChatInput
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="rounded-full"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            className="h-9 w-9 shrink-0"
            onClick={handleSend}
            disabled={!isConnected}
            variant="ghost"
            size="icon"
          >
            <SendHorizontal size={22} className="text-muted-foreground" />
          </Button>
        ) : (
          <Button
            className="h-9 w-9 shrink-0"
            onClick={handleThumbsUp}
            disabled={!isConnected}
            variant="ghost"
            size="icon"
          >
            <ThumbsUp size={22} className="text-muted-foreground" />
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
