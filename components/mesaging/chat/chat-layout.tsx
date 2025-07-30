"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Chat } from "./chat";
import { Button } from "@/components/mesaging/ui/button";
import { Menu } from "lucide-react";
import useChatStore from "@/hooks/useChatStore";
import { client } from "@/sanity/lib/client";

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
    selectedUser,
    connectToRoom,
    loadUserRooms,
    createOrJoinRoom,
    setSelectedUser,
    restoreSelectedChat,
    isLoading,
  } = useChatStore();

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Load user's rooms and restore selected chat when component mounts
  useEffect(() => {
    if (user?.id) {
      loadUserRooms(user.id);
      loadAvailableUsers();
      // Only restore in browser environment
      if (typeof window !== "undefined") {
        restoreSelectedChat(user.id);
      }
    }
  }, [user?.id, loadUserRooms, restoreSelectedChat]);

  // Refresh rooms when window gets focus (useful after room deletion redirects)
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) {
        loadUserRooms(user.id);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.id, loadUserRooms]);

  // Auto-reconnect to the selected room if it exists and we're not already connected
  useEffect(() => {
    if (selectedUser && selectedUser.roomId && !currentRoom && user?.id) {
      const room = rooms.find((r) => r.id === selectedUser.roomId);
      if (room) {
        const userData = {
          id: user.id,
          username: user.username || user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          fullName: user.fullName || "Unknown User",
          avatar: user.imageUrl,
        };
        connectToRoom(selectedUser.roomId, userData);
      }
    }
  }, [selectedUser, currentRoom, rooms, user, connectToRoom]);

  // Load available users for messaging
  const loadAvailableUsers = useCallback(async () => {
    try {
      // Users will be populated when they start conversations
      setAvailableUsers([]);
    } catch (error) {
      console.error("Failed to load available users:", error);
    }
  }, []);

  // Handle user selection and room creation
  const handleUserSelect = useCallback(
    async (chatUser: any) => {
      if (!user?.id || !chatUser.clerkId) return;

      try {
        // Create or join room with the selected user
        const roomId = await createOrJoinRoom([user.id, chatUser.clerkId]);

        // Fetch current user's profile from Sanity for enhanced connection data
        let userData = {
          id: user.id,
          username: user.username || user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          fullName: user.fullName || "Unknown User",
          avatar: user.imageUrl,
        };

        try {
          const query = `*[_type == "user" && clerkId == $clerkId][0]{
          _id,
          clerkId,
          personalDetails,
          coreIdentity
        }`;

          const profile = await client.fetch(query, { clerkId: user.id });
          if (profile) {
            userData = {
              ...userData,
              fullName: profile.coreIdentity?.fullName || userData.fullName,
              avatar:
                profile.personalDetails?.profilePicture?.asset?.url ||
                userData.avatar,
            };
          }
        } catch (error) {
          console.error(
            "💬 ChatLayout: Failed to fetch user profile from Sanity:",
            error
          );
        }

        connectToRoom(roomId, userData);

        // Update selected user for UI and persist it
        const selectedUserData = {
          ...chatUser,
          roomId,
        };

        setSelectedUser(selectedUserData, user.id);

        // Close mobile sidebar
        if (isMobile) {
          setSidebarOpen(false);
        }
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    },
    [user?.id, createOrJoinRoom, connectToRoom, setSelectedUser, isMobile]
  );

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
  const chatUsers = useMemo(() => {
    if (rooms.length === 0) return [];

    const { messages: globalMessages } = useChatStore.getState();

    return rooms.map((room) => {
      const otherParticipant = room.participants.find((p) => p !== user?.id);

      // Try to get user data from participantData first, then fall back to users array
      const participantUser = room.participantData?.find(
        (u) => u.id === otherParticipant
      );
      const roomUser = room.users?.find((u) => u.id === otherParticipant);

      const finalName =
        participantUser?.name || roomUser?.fullName || "Unknown User";
      const finalAvatar =
        participantUser?.avatar || roomUser?.avatar || "/default-avatar.png";

      // Determine which messages to use for this room
      let roomMessages: any[] = [];

      if (selectedUser?.roomId === room.id) {
        // For the currently selected room, use global messages
        roomMessages = globalMessages;
      } else if (room.lastMessage) {
        // For other rooms, if there's a lastMessage, create a message object from it
        roomMessages = [
          {
            id: `last-${room.id}`,
            text: room.lastMessage.text,
            from: {
              id: room.lastMessage.from,
              name:
                room.lastMessage.from === user?.id
                  ? user?.fullName || "You"
                  : finalName,
              avatar:
                room.lastMessage.from === user?.id
                  ? user?.imageUrl || ""
                  : finalAvatar,
            },
            at: room.lastMessage.at,
            type: "text",
          },
        ];
      } else {
        // No messages available
        roomMessages = room.messages || [];
      }

      const chatUser = {
        name: finalName,
        messages: roomMessages,
        avatar: finalAvatar,
        variant: (selectedUser?.roomId === room.id ? "secondary" : "ghost") as
          | "secondary"
          | "ghost",
        clerkId: otherParticipant,
      };

      return chatUser;
    });
  }, [rooms, user?.id, user?.fullName, user?.imageUrl, selectedUser?.roomId]);

  // Add available users who don't have rooms yet
  const allChatUsers = useMemo(() => {
    const result = [
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

    if (result.length > 0) {
    }

    return result;
  }, [chatUsers, availableUsers]);

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
        <div className="w-80 border-r bg-background/50 backdrop-blur-sm rounded-tl-xl rounded-bl-xl">
          <Sidebar
            isCollapsed={false}
            chats={allChatUsers as any}
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
              chats={allChatUsers as any}
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
