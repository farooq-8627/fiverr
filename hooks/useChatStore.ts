"use client";

import { create } from "zustand";
import { useUser } from "@clerk/nextjs";
import PartySocket from "partysocket";
import { client } from "@/sanity/lib/client";
import { nanoid } from "nanoid";

export interface Message {
  id: string;
  text: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
  };
  at: number;
  type?: "text" | "image" | "file";
  edited?: boolean;
  editedAt?: number;
  status?: "sending" | "sent" | "delivered" | "read";
}

export interface ChatUser {
  id: string;
  clerkId?: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantData?: { id: string; name: string; avatar?: string }[];
  messages: Message[];
  lastActivity: number;
  createdAt: number;
  users: ChatUser[];
  typingUsers: Set<string>;
  lastMessage?: {
    text: string;
    from: string;
    at: number;
  };
}

interface SelectedUserState {
  name: string;
  clerkId: string;
  avatar?: string;
  roomId: string;
}

interface MessageState {
  messages: Message[];
  lastSyncTimestamp: number;
}

interface ChatStore {
  messages: Message[];
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  selectedUser: SelectedUserState | null;
  connectedUsers: ChatUser[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  typingUsers: Set<string>;
  hasInitialResponse: boolean;
  lastSyncTimestamp: number;

  // Socket connection
  socket: PartySocket | null;

  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updatedMessage: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteChat: () => void;
  setConnectedUsers: (users: ChatUser[]) => void;
  setTypingUsers: (users: Set<string>) => void;
  setHasInitialResponse: (hasInitialResponse: boolean) => void;
  setLastSyncTimestamp: (timestamp: number) => void;
  refreshRooms: () => Promise<void>;

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

  // New persistence actions
  setSelectedUser: (user: SelectedUserState | null, userId?: string) => void;
  restoreSelectedChat: (userId: string) => Promise<void>;
  clearSelectedUser: (userId: string) => void;
}

interface MessageUpdate extends Partial<Message> {
  status?: "sending" | "sent" | "delivered" | "read";
}

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  rooms: [],
  currentRoom: null,
  selectedUser: null,
  connectedUsers: [],
  isConnected: false,
  isLoading: false,
  error: null,
  typingUsers: new Set(),
  hasInitialResponse: false,
  lastSyncTimestamp: 0,
  socket: null,

  setMessages: (messages) => {
    console.log("🏪 useChatStore: Setting messages, count:", messages.length);
    set({ messages: messages.sort((a, b) => a.at - b.at) });
  },

  addMessage: (message: Message) => {
    const { messages } = get();
    const existingIndex = messages.findIndex((m) => m.id === message.id);

    if (existingIndex !== -1) {
      // Update existing message - preserve important fields
      const existingMessage = messages[existingIndex];
      const updatedMessages = [...messages];

      updatedMessages[existingIndex] = {
        ...existingMessage,
        ...message,
        // Preserve status if the new message doesn't have a status or has a "lower" status
        status: message.status || existingMessage.status,
        // Always use the most recent timestamp
        at: message.at || existingMessage.at,
      };

      set({ messages: updatedMessages });
      return;
    }

    // Add new message
    const newMessages = [...messages, message].sort((a, b) => a.at - b.at);

    set({ messages: newMessages });
  },

  updateMessage: (messageId: string, update: MessageUpdate) => {
    set((state) => {
      const messageIndex = state.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) {
        return state;
      }

      const oldMessage = state.messages[messageIndex];
      const updatedMessages = [...state.messages];
      updatedMessages[messageIndex] = {
        ...oldMessage,
        ...update,
      };

      return { messages: updatedMessages };
    });
  },

  deleteMessage: (messageId: string) => {
    const { socket } = get();
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "delete_message",
        messageId: messageId,
      })
    );
  },

  editMessage: (messageId: string, newText: string) => {
    const { socket } = get();
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "edit_message",
        messageId: messageId,
        text: newText,
      })
    );
  },

  deleteChat: () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.send(
      JSON.stringify({
        type: "delete_room",
        roomId: currentRoom.id,
      })
    );
  },

  setConnectedUsers: (users) => set({ connectedUsers: users }),

  setTypingUsers: (users) => set({ typingUsers: users }),

  setHasInitialResponse: (hasInitialResponse) => set({ hasInitialResponse }),

  setLastSyncTimestamp: (timestamp) => set({ lastSyncTimestamp: timestamp }),

  refreshRooms: async () => {
    const { socket } = get();
    if (!socket) return;

    // Get current user ID from socket
    const url = new URL(socket.url);
    const userDataString = url.searchParams.get("userData");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);

        const { loadUserRooms } = get();
        await loadUserRooms(userData.id);
      } catch (error) {
        console.error("🏪 useChatStore: Failed to refresh rooms:", error);
      }
    }
  },

  connectToRoom: async (roomId: string, userData: any) => {
    try {
      const { socket } = get();
      if (socket) {
        socket.close();
      }

      // Fetch current user's profile from Sanity for complete data
      let enhancedUserData = userData;
      try {
        const query = `*[_type == "user" && clerkId == $clerkId][0]{
          _id,
          clerkId,
          personalDetails,
          coreIdentity
        }`;

        const profile = await client.fetch(query, { clerkId: userData.id });
        if (profile) {
          enhancedUserData = {
            ...userData,
            fullName: profile.coreIdentity?.fullName || userData.fullName,
            avatar:
              profile.personalDetails?.profilePicture?.asset?.url ||
              userData.avatar,
          };
        }
      } catch (error) {
        console.error(
          "🏪 useChatStore: Failed to fetch user profile from Sanity:",
          error
        );
      }

      const partySocket = new PartySocket({
        host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
        room: roomId,
        party: "chatroom",
        query: {
          userData: JSON.stringify(enhancedUserData),
        },
      });

      partySocket.onopen = () => {
        set({
          isConnected: true,
          currentRoom: {
            id: roomId,
            participants: [],
            messages: [],
            lastActivity: Date.now(),
            createdAt: Date.now(),
            users: [],
            typingUsers: new Set(),
          },
        });
      };

      partySocket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case "sync": {
            const syncedMessages = message.messages || [];
            const currentMessages = get().messages;
            const { lastSyncTimestamp } = get();

            // Create maps for efficient lookup
            const currentMessageMap = new Map<string, Message>(
              currentMessages.map((msg: Message) => [msg.id, msg])
            );
            const syncedMessageMap = new Map<string, Message>(
              syncedMessages.map((msg: Message) => [msg.id, msg])
            );

            // Merge messages, preserving local state for messages we already have
            const mergedMessages = new Map<string, Message>();

            // First, add all synced messages
            syncedMessages.forEach((msg: Message) => {
              const existingMsg = currentMessageMap.get(msg.id);
              mergedMessages.set(msg.id, {
                ...msg,
                status: existingMsg?.status || "delivered",
              });
            });

            // Then, add any local messages that aren't in the sync
            currentMessages.forEach((msg: Message) => {
              if (!syncedMessageMap.has(msg.id) && msg.at > lastSyncTimestamp) {
                mergedMessages.set(msg.id, msg);
              }
            });

            // Convert to array and sort
            const finalMessages = Array.from(mergedMessages.values()).sort(
              (a, b) => a.at - b.at
            );

            set({
              messages: finalMessages,
              lastSyncTimestamp: Math.max(
                ...syncedMessages.map((msg: Message) => msg.at),
                lastSyncTimestamp
              ),
            });
            break;
          }

          case "text": {
            const { socket, addMessage, updateMessage } = get();
            let currentUserId = "unknown";

            if (socket) {
              const url = new URL(socket.url);
              const userDataString = url.searchParams.get("userData");
              if (userDataString) {
                try {
                  const userData = JSON.parse(userDataString);
                  currentUserId = userData.id;
                } catch (error) {
                  console.error("Failed to parse user data:", error);
                }
              }
            }

            const isOwnMessage = message.from.id === currentUserId;

            if (isOwnMessage) {
              // This is our own message coming back from server
              updateMessage(message.id, {
                status: "delivered",
                at: message.at, // Update with server timestamp
              });
            } else {
              // This is a message from another user - add it immediately
              const incomingMessage: Message = {
                ...message,
                status: "received",
              };
              addMessage(incomingMessage);
            }
            break;
          }

          case "message_deleted":
            const { messages } = get();
            set({
              messages: messages.filter((msg) => msg.id !== message.messageId),
            });
            break;
          case "message_edited":
            const { updateMessage } = get();
            updateMessage(message.messageId, {
              text: message.text,
              edited: true,
              editedAt: message.editedAt,
            });
            break;
          case "room_deleted":
            const { currentRoom } = get();

            // Remove the room from the rooms array
            set((state) => ({
              rooms: state.rooms.filter((room) => room.id !== currentRoom?.id),
              currentRoom: null,
              messages: [],
              isConnected: false,
            }));

            // Disconnect the socket
            const { socket } = get();
            if (socket) {
              socket.close();
              set({ socket: null });
            }

            // Redirect to main messaging page
            if (typeof window !== "undefined") {
              window.location.href = "/messaging";
            }
            break;
          case "room_users":
            const { setConnectedUsers } = get();
            setConnectedUsers(message.users || []);
            break;
          case "typing":
            const { typingUsers, setTypingUsers } = get();
            if (message.isTyping) {
              typingUsers.add(message.userId);
            } else {
              typingUsers.delete(message.userId);
            }
            setTypingUsers(new Set(typingUsers));
            break;

          default:
            // Handle raw message objects that don't have a type wrapper
            // This happens when PartyKit broadcasts user messages directly
            if (message.id && message.from && message.text && message.at) {
              const { socket, addMessage, updateMessage } = get();
              let currentUserId = "unknown";

              if (socket) {
                const url = new URL(socket.url);
                const userDataString = url.searchParams.get("userData");
                if (userDataString) {
                  try {
                    const userData = JSON.parse(userDataString);
                    currentUserId = userData.id;
                  } catch (error) {
                    console.error(
                      "🏪 useChatStore: Failed to parse user data:",
                      error
                    );
                  }
                }
              }

              const isOwnMessage = message.from.id === currentUserId;
              console.log(
                "🏪 useChatStore: Processing raw message, isOwn:",
                isOwnMessage,
                "messageFromId:",
                message.from.id,
                "currentUserId:",
                currentUserId
              );

              if (isOwnMessage) {
                // This is our own message coming back from server - update the optimistic message
                updateMessage(message.id, {
                  status: "delivered",
                  at: message.at, // Update with server timestamp
                  from: message.from, // Update with server data
                });
                console.log(
                  "🏪 useChatStore: Updated own message:",
                  message.id
                );
              } else {
                // This is a message from another user - add it immediately
                const incomingMessage: Message = {
                  ...message,
                  status: "received",
                };
                addMessage(incomingMessage);
                console.log(
                  "🏪 useChatStore: Added incoming message:",
                  message.id
                );
              }
            }
            break;
        }
      };

      partySocket.onerror = (error) => {
        console.error("🏪 useChatStore: Socket error:", error);
        set({ isConnected: false, error: "Connection error" });
      };

      partySocket.onclose = () => {
        set({ isConnected: false });
      };

      set({ socket: partySocket });
    } catch (error) {
      console.error("🏪 useChatStore: Failed to connect to room:", error);
      set({ error: "Failed to connect to chat room" });
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
    const { socket, addMessage } = get();
    if (!socket) {
      console.error("🏪 useChatStore: No socket connection for sendMessage");
      return;
    }

    // Get current user data from socket connection
    const url = new URL(socket.url);
    const userDataString = url.searchParams.get("userData");
    let currentUser: any = {
      id: "unknown",
      name: "You",
      avatar: "",
    };

    if (userDataString) {
      try {
        currentUser = JSON.parse(userDataString);
      } catch (error) {
        console.error("🏪 useChatStore: Failed to parse user data:", error);
      }
    }

    const messageId = nanoid();
    const optimisticMessage: Message = {
      id: messageId,
      text,
      from: {
        id: currentUser.id,
        name: currentUser.fullName || currentUser.name || "You",
        avatar: currentUser.avatar || "",
      },
      at: Date.now(),
      status: "sending",
    };

    // Add optimistic message
    addMessage(optimisticMessage);

    // Send message via socket
    socket.send(JSON.stringify({ type: "message", text, id: messageId }));

    // Trigger a refresh of rooms to update sidebar with latest message
    const { refreshRooms } = get();
    setTimeout(() => {
      refreshRooms();
    }, 1000); // Small delay to allow message to be processed
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
      const requestBody = {
        participants: participantIds,
        createdBy: participantIds[0], // Assuming first participant is creator
        participantData: participantData || [], // Include user profile data
      };

      const response = await fetch(`/api/messaging/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🏪 useChatStore: API error response:", errorText);
        console.error("🏪 useChatStore: Full response object:", response);
        throw new Error(
          `Failed to create room: ${response.status} - ${errorText}`
        );
      }

      const responseData = await response.json();

      const { roomId } = responseData;
      if (!roomId) {
        console.error("🏪 useChatStore: No roomId in response:", responseData);
        throw new Error("No roomId received from server");
      }

      return roomId;
    } catch (err) {
      console.error("🏪 useChatStore: Error in createOrJoinRoom:", err);
      console.error(
        "🏪 useChatStore: Error stack:",
        err instanceof Error ? err.stack : undefined
      );
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

      const url = `/api/messaging/rooms?userId=${userId}`;

      const response = await fetch(url);

      if (response.ok) {
        const responseData = await response.json();

        const { rooms: userRooms } = responseData;

        const formattedRooms = userRooms.map((room: any) => {
          const users =
            room.participantData?.map(
              (participant: { id: string; name: string; avatar?: string }) => ({
                id: participant.id,
                fullName: participant.name,
                avatar: participant.avatar || "/default-avatar.png",
                username: participant.name,
              })
            ) || [];

          return {
            ...room,
            messages: [],
            users: users,
            typingUsers: new Set(),
          };
        });

        set({ rooms: formattedRooms });
      } else {
        const errorText = await response.text();
        console.error("🏪 useChatStore: loadUserRooms API error:", errorText);
      }
    } catch (err) {
      console.error("🏪 useChatStore: Failed to load rooms:", err);
      set({ error: "Failed to load conversations" });
    } finally {
      set({ isLoading: false });
    }
  },

  // New persistence actions
  setSelectedUser: (user, userId) => {
    if (userId && user) {
      try {
        localStorage.setItem(`selectedUser_${userId}`, JSON.stringify(user));
        console.log(
          "🏪 useChatStore: Saved selectedUser to localStorage:",
          user
        );
      } catch (e) {
        console.error(
          "🏪 useChatStore: Failed to save selectedUser to localStorage:",
          e
        );
      }
    } else if (userId && !user) {
      // Remove from localStorage if user is null
      try {
        localStorage.removeItem(`selectedUser_${userId}`);
        console.log("🏪 useChatStore: Removed selectedUser from localStorage");
      } catch (e) {
        console.error(
          "🏪 useChatStore: Failed to remove selectedUser from localStorage:",
          e
        );
      }
    }
    set({ selectedUser: user });
  },

  restoreSelectedChat: async (userId) => {
    console.log(
      "🏪 useChatStore: Attempting to restore selected chat for user:",
      userId
    );

    // Only proceed if we're in browser environment
    if (typeof window === "undefined") {
      console.log(
        "🏪 useChatStore: Not in browser environment, skipping restore"
      );
      return;
    }

    try {
      const storedUser = localStorage.getItem(`selectedUser_${userId}`);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("🏪 useChatStore: Found stored selectedUser:", parsedUser);

        // Validate that the stored user has the required properties
        if (parsedUser.name && parsedUser.clerkId && parsedUser.roomId) {
          set({ selectedUser: parsedUser });
          console.log("🏪 useChatStore: Successfully restored selectedUser");
        } else {
          console.warn(
            "🏪 useChatStore: Stored selectedUser is invalid, clearing localStorage"
          );
          localStorage.removeItem(`selectedUser_${userId}`);
        }
      } else {
        console.log("🏪 useChatStore: No stored selectedUser found");
      }
    } catch (e) {
      console.error(
        "🏪 useChatStore: Failed to restore selectedUser from localStorage:",
        e
      );
      // Clear corrupted data
      try {
        localStorage.removeItem(`selectedUser_${userId}`);
      } catch (clearError) {
        console.error(
          "🏪 useChatStore: Failed to clear corrupted localStorage data:",
          clearError
        );
      }
    }
  },

  clearSelectedUser: (userId) => {
    localStorage.removeItem(`selectedUser_${userId}`);
    set({ selectedUser: null });
    console.log("🏪 useChatStore: Cleared selected user for userId:", userId);
  },
}));

export default useChatStore;
