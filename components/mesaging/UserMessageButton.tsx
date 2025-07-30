"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import useChatStore from "@/hooks/useChatStore";
import { client } from "@/sanity/lib/client";

interface UserMessageButtonProps {
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function UserMessageButton({
  targetUserId,
  targetUserName,
  targetUserAvatar,
  variant = "outline",
  size = "sm",
  className,
  children,
}: UserMessageButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const { createOrJoinRoom } = useChatStore();
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

  // Fetch current user's profile from Sanity
  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      if (!user?.id) return;

      try {
        const query = `*[_type == "user" && clerkId == $clerkId][0]{
          _id,
          clerkId,
          personalDetails,
          coreIdentity
        }`;

        const profile = await client.fetch(query, { clerkId: user.id });

        if (profile) {
          setCurrentUserProfile(profile);
        } else {
          console.warn(
            "🔘 UserMessageButton: No profile found in Sanity for user:",
            user.id
          );
        }
      } catch (error) {
        console.error(
          "🔘 UserMessageButton: Failed to fetch current user profile:",
          error
        );
      }
    };

    fetchCurrentUserProfile();
  }, [user?.id]);

  const handleStartConversation = async (event: React.MouseEvent) => {
    // Prevent event bubbling to parent elements (like card clicks)
    event.preventDefault();
    event.stopPropagation();

    if (!user?.id || !targetUserId) {
      console.error(
        "🔘 UserMessageButton: Missing user authentication or target user"
      );
      return;
    }

    if (user.id === targetUserId) {
      console.error(
        "🔘 UserMessageButton: Cannot start conversation with yourself"
      );
      return;
    }

    if (!currentUserProfile) {
      console.warn(
        "🔘 UserMessageButton: Current user profile not loaded from Sanity, using Clerk data as fallback"
      );
    }

    try {
      // Create or join room with the target user using Sanity data for both users
      const participantData = [
        {
          id: user.id,
          name:
            currentUserProfile?.coreIdentity?.fullName ||
            user.fullName ||
            user.username ||
            "Unknown User",
          avatar:
            currentUserProfile?.personalDetails?.profilePicture?.asset?.url ||
            user.imageUrl,
        },
        {
          id: targetUserId,
          name: targetUserName,
          avatar: targetUserAvatar,
        },
      ];

      const roomId = await createOrJoinRoom(
        [user.id, targetUserId],
        participantData
      );

      // Small delay to ensure room is fully created and available
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to messaging page
      router.push("/messaging");
    } catch (error) {
      console.error(
        "🔘 UserMessageButton: Failed to start conversation:",
        error
      );
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
