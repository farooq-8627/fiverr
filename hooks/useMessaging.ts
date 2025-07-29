"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import PartySocket from "partysocket";

export interface ChatMessage {
  id: string;
  text: string;
  from: {
    id: string;
    name?: string;
    avatar?: string;
  };
  at: number;
  type?: "text" | "image" | "file";
  edited?: boolean;
  reactions?: Record<string, string[]>;
}

export interface ChatUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  users: ChatUser[];
  typingUsers: Set<string>;
}

export interface UseMessagingReturn {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  createOrJoinRoom: (participantIds: string[]) => Promise<string>;
  switchRoom: (roomId: string) => void;
  sendMessage: (text: string) => void;
  editMessage: (messageId: string, text: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  markAsRead: (roomId: string) => void;
}

export function useMessaging(): UseMessagingReturn {
  const { user } = useUser();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<PartySocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRoomIdRef = useRef<string | null>(null);

  // Initialize user data for PartyKit
  const userData = user
    ? {
        id: user.id,
        username: user.username || user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        fullName: user.fullName || "Unknown User",
        avatar: user.imageUrl,
      }
    : null;

  // Create or join a room
  const createOrJoinRoom = useCallback(
    async (participantIds: string[]): Promise<string> => {
      if (!userData) {
        throw new Error("User not authenticated");
      }

      try {
        const response = await fetch(`/api/messaging/rooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participants: participantIds,
            createdBy: userData.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create room");
        }

        const { roomId } = await response.json();
        return roomId;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create room");
        throw err;
      }
    },
    [userData]
  );

  // Connect to a specific room
  const connectToRoom = useCallback(
    (roomId: string) => {
      if (!userData || !roomId) return;

      // Disconnect from previous room
      if (socketRef.current) {
        socketRef.current.close();
      }

      try {
        const partyHost =
          process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

        socketRef.current = new PartySocket({
          host: partyHost,
          room: roomId,
          party: "main",
          // Pass user data in connection headers
          query: {
            userData: JSON.stringify(userData),
          },
        });

        socketRef.current.addEventListener("open", () => {
          setIsConnected(true);
          setError(null);
        });

        socketRef.current.addEventListener("message", (event) => {
          try {
            const data = JSON.parse(event.data);
            handleSocketMessage(roomId, data);
          } catch (err) {
            console.error("Failed to parse message:", err);
          }
        });

        socketRef.current.addEventListener("error", (event) => {
          console.error("Socket error:", event);
          setError("Connection error");
          setIsConnected(false);
        });

        socketRef.current.addEventListener("close", () => {
          setIsConnected(false);
        });

        currentRoomIdRef.current = roomId;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect");
        setIsConnected(false);
      }
    },
    [userData]
  );

  // Handle incoming socket messages
  const handleSocketMessage = useCallback((roomId: string, data: any) => {
    switch (data.type) {
      case "sync":
        // Initial message sync
        setRooms((prev) => {
          const roomIndex = prev.findIndex((r) => r.id === roomId);
          const newRoom: ChatRoom = {
            id: roomId,
            participants: [], // Will be updated with room_users
            messages: data.messages || [],
            users: [],
            typingUsers: new Set(),
          };

          if (roomIndex >= 0) {
            const updated = [...prev];
            updated[roomIndex] = {
              ...updated[roomIndex],
              messages: data.messages || [],
            };
            return updated;
          } else {
            return [...prev, newRoom];
          }
        });
        break;

      case "new":
      case "edit":
        // New or edited message
        setRooms((prev) =>
          prev.map((room) => {
            if (room.id === roomId) {
              const messageIndex = room.messages.findIndex(
                (m) => m.id === data.id
              );
              if (messageIndex >= 0 && data.type === "edit") {
                // Update existing message
                const updatedMessages = [...room.messages];
                updatedMessages[messageIndex] = data;
                return { ...room, messages: updatedMessages };
              } else if (data.type === "new") {
                // Add new message
                return { ...room, messages: [...room.messages, data] };
              }
            }
            return room;
          })
        );
        break;

      case "room_users":
        // Update room users
        setRooms((prev) =>
          prev.map((room) => {
            if (room.id === roomId) {
              return { ...room, users: data.users || [] };
            }
            return room;
          })
        );
        break;

      case "typing":
        // Handle typing indicators
        setRooms((prev) =>
          prev.map((room) => {
            if (room.id === roomId) {
              const newTypingUsers = new Set(room.typingUsers);
              if (data.isTyping) {
                newTypingUsers.add(data.from);
              } else {
                newTypingUsers.delete(data.from);
              }
              return { ...room, typingUsers: newTypingUsers };
            }
            return room;
          })
        );
        break;

      case "user_status":
        // Update user online status
        setRooms((prev) =>
          prev.map((room) => {
            if (room.id === roomId) {
              const updatedUsers = room.users.map((user) =>
                user.id === data.userId
                  ? {
                      ...user,
                      isOnline: data.isOnline,
                      lastSeen: data.lastSeen,
                    }
                  : user
              );
              return { ...room, users: updatedUsers };
            }
            return room;
          })
        );
        break;

      case "clear":
        // Clear room messages
        setRooms((prev) =>
          prev.map((room) => {
            if (room.id === roomId) {
              return { ...room, messages: [] };
            }
            return room;
          })
        );
        break;
    }
  }, []);

  // Switch to a different room
  const switchRoom = useCallback(
    (roomId: string) => {
      const room = rooms.find((r) => r.id === roomId);
      if (room) {
        setCurrentRoom(room);
        connectToRoom(roomId);
      }
    },
    [rooms, connectToRoom]
  );

  // Send a message
  const sendMessage = useCallback((text: string) => {
    if (!socketRef.current || !text.trim()) return;

    const message = {
      type: "new",
      text: text.trim(),
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    };

    socketRef.current.send(JSON.stringify(message));
  }, []);

  // Edit a message
  const editMessage = useCallback((messageId: string, text: string) => {
    if (!socketRef.current || !text.trim()) return;

    const message = {
      type: "edit",
      id: messageId,
      text: text.trim(),
    };

    socketRef.current.send(JSON.stringify(message));
  }, []);

  // Start typing indicator
  const startTyping = useCallback(() => {
    if (!socketRef.current || !userData) return;

    socketRef.current.send(
      JSON.stringify({
        type: "typing",
        from: userData.id,
        isTyping: true,
      })
    );

    // Auto-stop typing after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [userData]);

  // Stop typing indicator
  const stopTyping = useCallback(() => {
    if (!socketRef.current || !userData) return;

    socketRef.current.send(
      JSON.stringify({
        type: "typing",
        from: userData.id,
        isTyping: false,
      })
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [userData]);

  // Mark messages as read (placeholder for future implementation)
  const markAsRead = useCallback((roomId: string) => {
    // TODO: Implement read status tracking
    console.log("Marking room as read:", roomId);
  }, []);

  // Load user's rooms on component mount
  useEffect(() => {
    if (!userData) {
      setIsLoading(false);
      return;
    }

    const loadRooms = async () => {
      try {
        const response = await fetch(
          `/api/messaging/rooms?userId=${userData.id}`
        );
        if (response.ok) {
          const { rooms: userRooms } = await response.json();
          setRooms(
            userRooms.map((room: any) => ({
              ...room,
              messages: [],
              users: [],
              typingUsers: new Set(),
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load rooms:", err);
        setError("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, [userData]);

  // Update current room when rooms change
  useEffect(() => {
    if (currentRoomIdRef.current) {
      const updatedRoom = rooms.find((r) => r.id === currentRoomIdRef.current);
      if (updatedRoom) {
        setCurrentRoom(updatedRoom);
      }
    }
  }, [rooms]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    rooms,
    currentRoom,
    isConnected,
    isLoading,
    error,
    createOrJoinRoom,
    switchRoom,
    sendMessage,
    editMessage,
    startTyping,
    stopTyping,
    markAsRead,
  };
}
