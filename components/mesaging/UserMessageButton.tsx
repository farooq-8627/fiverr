"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import useChatStore from "@/hooks/useChatStore";

interface UserMessageButtonProps {
  targetUserId: string;
  targetUserName: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function UserMessageButton({
  targetUserId,
  targetUserName,
  variant = "outline",
  size = "sm",
  className,
  children,
}: UserMessageButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const { createOrJoinRoom } = useChatStore();

  const handleStartConversation = async () => {
    if (!user?.id || !targetUserId) {
      console.error("Missing user authentication or target user");
      return;
    }

    if (user.id === targetUserId) {
      console.error("Cannot start conversation with yourself");
      return;
    }

    try {
      // Create or join room with the target user
      const participantData = [
        {
          id: user.id,
          name: user.fullName || user.username || "Unknown User",
          avatar: user.imageUrl,
        },
        {
          id: targetUserId,
          name: targetUserName,
          avatar: undefined, // We don't have target user's avatar here
        },
      ];

      await createOrJoinRoom([user.id, targetUserId], participantData);

      // Navigate to messaging page
      router.push("/messaging");
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleStartConversation}
      className={className}
      disabled={!user?.id}
    >
      {children || (
        <>
          <MessageCircle className="h-4 w-4 mr-2" />
          Message {targetUserName}
        </>
      )}
    </Button>
  );
}
