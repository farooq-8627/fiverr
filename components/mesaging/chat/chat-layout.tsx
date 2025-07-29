"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Chat } from "./chat";
import { Button } from "@/components/mesaging/ui/button";
import { Menu } from "lucide-react";
import useChatStore from "@/hooks/useChatStore";

interface ChatLayoutProps {
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const { user } = useUser();
  const {
    rooms,
    currentRoom,
    connectToRoom,
    loadUserRooms,
    createOrJoinRoom,
    isLoading,
  } = useChatStore();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Load user's rooms when component mounts
  useEffect(() => {
    if (user?.id) {
      loadUserRooms(user.id);
      loadAvailableUsers();
    }
  }, [user?.id, loadUserRooms]);

  // Load available users for messaging
  const loadAvailableUsers = async () => {
    try {
      // Users will be populated when they start conversations
      setAvailableUsers([]);
    } catch (error) {
      console.error("Failed to load available users:", error);
    }
  };

  // Handle user selection and room creation
  const handleUserSelect = async (chatUser: any) => {
    if (!user?.id || !chatUser.clerkId) return;

    try {
      // Create or join room with the selected user
      const roomId = await createOrJoinRoom([user.id, chatUser.clerkId]);

      // Connect to the room
      const userData = {
        id: user.id,
        username: user.username || user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        fullName: user.fullName || "Unknown User",
        avatar: user.imageUrl,
      };

      connectToRoom(roomId, userData);

      // Update selected user for UI
      setSelectedUser({
        ...chatUser,
        roomId,
      });

      // Close mobile sidebar
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById("mobile-sidebar");
        const button = document.getElementById("sidebar-toggle");

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          button &&
          !button.contains(event.target as Node)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  // Convert rooms to the expected chat format
  const chatUsers = rooms.map((room) => {
    const otherParticipant = room.participants.find((p) => p !== user?.id);

    // Try to get user data from participantData first, then fall back to users array
    const participantUser = room.participantData?.find(
      (u) => u.id === otherParticipant
    );
    const roomUser = room.users?.find((u) => u.id === otherParticipant);

    return {
      name: participantUser?.name || roomUser?.fullName || "Unknown User",
      messages: room.messages || [],
      avatar:
        participantUser?.avatar || roomUser?.avatar || "/default-avatar.png",
      variant: (selectedUser?.roomId === room.id ? "secondary" : "ghost") as
        | "secondary"
        | "ghost",
      clerkId: otherParticipant,
    };
  });

  // Add available users who don't have rooms yet
  const allChatUsers = [
    ...chatUsers,
    ...availableUsers
      .filter(
        (user) => !chatUsers.some((chat) => chat.clerkId === user.clerkId)
      )
      .map((user) => ({
        name: user.name,
        messages: [],
        avatar: user.avatar,
        variant: "ghost" as const,
      })),
  ];

  return (
    <div className="flex h-full w-full relative">
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <Button
          id="sidebar-toggle"
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar for Desktop/Tablet */}
      {!isMobile && (
        <div className="w-80 border-r bg-background/50 backdrop-blur-sm">
          <Sidebar
            isCollapsed={false}
            chats={allChatUsers}
            isMobile={false}
            onChatSelect={(chat) => {
              const user = allChatUsers.find((u) => u.name === chat.name);
              if (user) handleUserSelect(user);
            }}
          />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div
            id="mobile-sidebar"
            className={cn(
              "fixed left-0 top-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar
              isCollapsed={false}
              chats={allChatUsers}
              isMobile={true}
              onChatSelect={(chat) => {
                const user = allChatUsers.find((u) => u.name === chat.name);
                if (user) handleUserSelect(user);
              }}
            />
          </div>
        </>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <Chat
            messages={currentRoom?.messages || []}
            selectedUser={selectedUser}
            isMobile={isMobile}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                No conversations yet
              </h3>
              <p className="text-muted-foreground">
                Use the message button on user profiles to start conversations
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
