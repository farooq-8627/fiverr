"use client";

import { create } from "zustand";
import { useUser } from "@clerk/nextjs";
import PartySocket from "partysocket";

export interface Message {
  id: number;
  avatar: string;
  name: string;
  message?: string;
  isLoading?: boolean;
  timestamp?: string;
  role?: string;
  isLiked?: boolean;
}

export interface ChatUser {
  id: string;
  clerkId?: string;
  fullName: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: number;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantData?: { id: string; name: string; avatar?: string }[];
  lastActivity: number;
  createdAt: number;
  messages: Message[];
  users: ChatUser[];
  typingUsers: Set<string>;
}

interface ChatStore {
  messages: Message[];
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  connectedUsers: ChatUser[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  typingUsers: Set<string>;
  hasInitialResponse: boolean;

  // Socket connection
  socket: PartySocket | null;

  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: number, message: Partial<Message>) => void;
  setConnectedUsers: (users: ChatUser[]) => void;
  setTypingUsers: (users: Set<string>) => void;
  setHasInitialResponse: (hasInitialResponse: boolean) => void;

  // Real-time messaging actions
  connectToRoom: (roomId: string, userData: any) => void;
  disconnectFromRoom: () => void;
  sendMessage: (text: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  createOrJoinRoom: (
    participantIds: string[],
    participantData?: { id: string; name: string; avatar?: string }[]
  ) => Promise<string>;
  switchRoom: (roomId: string) => void;
  loadUserRooms: (userId: string) => Promise<void>;
}

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  rooms: [],
  currentRoom: null,
  connectedUsers: [],
  isConnected: false,
  isLoading: false,
  error: null,
  typingUsers: new Set(),
  hasInitialResponse: false,
  socket: null,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  setConnectedUsers: (users) => set({ connectedUsers: users }),

  setTypingUsers: (users) => set({ typingUsers: users }),

  setHasInitialResponse: (hasInitialResponse) => set({ hasInitialResponse }),

  connectToRoom: (roomId: string, userData: any) => {
    const { socket } = get();

    // Disconnect existing connection
    if (socket) {
      socket.close();
    }

    try {
      const partyHost =
        process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

      const newSocket = new PartySocket({
        host: partyHost,
        room: roomId,
        party: "chatroom",
        query: {
          userData: JSON.stringify(userData),
        },
      });

      newSocket.addEventListener("open", () => {
        set({ isConnected: true, error: null });
      });

      newSocket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          const state = get();

          switch (data.type) {
            case "sync":
              // Convert PartyKit messages to our format
              const convertedMessages = (data.messages || []).map(
                (msg: any, index: number) => ({
                  id: index + 1,
                  avatar: msg.from.avatar || "/default-avatar.png",
                  name: msg.from.name || "Unknown",
                  message: msg.text,
                  timestamp: new Date(msg.at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  role: msg.from.id === userData.id ? "user" : "other",
                })
              );

              set({
                messages: convertedMessages,
                hasInitialResponse: true,
              });
              break;

            case "new":
              // Add new message
              const newMessage: Message = {
                id: state.messages.length + 1,
                avatar: data.from.avatar || "/default-avatar.png",
                name: data.from.name || "Unknown",
                message: data.text,
                timestamp: new Date(data.at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                role: data.from.id === userData.id ? "user" : "other",
              };

              set((state) => ({
                messages: [...state.messages, newMessage],
              }));
              break;

            case "edit":
              // Update existing message
              set((state) => ({
                messages: state.messages.map((msg) => {
                  // Find message by comparing content and timestamp (since we don't have direct ID mapping)
                  if (
                    msg.message === data.text ||
                    (msg.timestamp &&
                      new Date(data.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) === msg.timestamp)
                  ) {
                    return {
                      ...msg,
                      message: data.text,
                      timestamp: new Date(data.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    };
                  }
                  return msg;
                }),
              }));
              break;

            case "room_users":
              set({ connectedUsers: data.users || [] });
              break;

            case "typing":
              const typingUsers = new Set(state.typingUsers);
              if (data.isTyping) {
                typingUsers.add(data.from);
              } else {
                typingUsers.delete(data.from);
              }
              set({ typingUsers });
              break;

            case "user_status":
              // Update user online status
              set((state) => ({
                connectedUsers: state.connectedUsers.map((user) =>
                  user.id === data.userId
                    ? {
                        ...user,
                        isOnline: data.isOnline,
                        lastSeen: data.lastSeen,
                      }
                    : user
                ),
              }));
              break;

            case "clear":
              set({ messages: [] });
              break;
          }
        } catch (err) {
          console.error("Failed to parse message:", err);
        }
      });

      newSocket.addEventListener("error", (event) => {
        console.error("Socket error:", event);
        set({ error: "Connection error", isConnected: false });
      });

      newSocket.addEventListener("close", () => {
        set({ isConnected: false });
      });

      set({ socket: newSocket });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to connect",
        isConnected: false,
      });
    }
  },

  disconnectFromRoom: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },

  sendMessage: (text: string) => {
    const { socket } = get();
    if (!socket || !text.trim()) return;

    const message = {
      type: "new",
      text: text.trim(),
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    };

    socket.send(JSON.stringify(message));
  },

  startTyping: () => {
    const { socket } = get();
    if (!socket) return;

    // Get current user data (you'll need to pass this from the component)
    const userData = JSON.parse(socket.protocol || "{}");

    socket.send(
      JSON.stringify({
        type: "typing",
        from: userData.id,
        isTyping: true,
      })
    );
  },

  stopTyping: () => {
    const { socket } = get();
    if (!socket) return;

    const userData = JSON.parse(socket.protocol || "{}");

    socket.send(
      JSON.stringify({
        type: "typing",
        from: userData.id,
        isTyping: false,
      })
    );
  },

  createOrJoinRoom: async (
    participantIds: string[],
    participantData?: { id: string; name: string; avatar?: string }[]
  ): Promise<string> => {
    try {
      const response = await fetch(`/api/messaging/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: participantIds,
          createdBy: participantIds[0], // Assuming first participant is creator
          participantData: participantData || [], // Include user profile data
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const { roomId } = await response.json();
      return roomId;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create room",
      });
      throw err;
    }
  },

  switchRoom: (roomId: string) => {
    const state = get();
    const room = state.rooms.find((r) => r.id === roomId);
    if (room) {
      set({ currentRoom: room });
      // Will need user data from component
    }
  },

  loadUserRooms: async (userId: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/messaging/rooms?userId=${userId}`);
      if (response.ok) {
        const { rooms: userRooms } = await response.json();
        const formattedRooms = userRooms.map((room: any) => ({
          ...room,
          messages: [],
          users:
            room.participantData?.map(
              (participant: { id: string; name: string; avatar?: string }) => ({
                id: participant.id,
                fullName: participant.name,
                avatar: participant.avatar || "/default-avatar.png",
                username: participant.name,
              })
            ) || [],
          typingUsers: new Set(),
        }));
        set({ rooms: formattedRooms });
      }
    } catch (err) {
      console.error("Failed to load rooms:", err);
      set({ error: "Failed to load conversations" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useChatStore;
