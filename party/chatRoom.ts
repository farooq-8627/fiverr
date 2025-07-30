import type * as Party from "partykit/server";
import { nanoid } from "nanoid";
import { SINGLETON_ROOM_ID } from "./chatRooms";
import type {
  Message,
  SyncMessage,
  UserMessage,
  ClearRoomMessage,
  TypingMessage,
  UserStatusMessage,
} from "./utils/message";
import {
  editMessage,
  newMessage,
  syncMessage,
  systemMessage,
  typingMessage,
  userStatusMessage,
  roomUsersMessage,
} from "./utils/message";
import { error, json, notFound, ok } from "./utils/response";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

export function isSessionValid(user?: User | null): user is User {
  return user != null && user.id != null;
}

export async function getClerkSession(
  request: Party.Request
): Promise<User | null> {
  try {
    // Parse user data from request headers
    const userDataHeader = request.headers.get("x-user-data");
    if (userDataHeader) {
      const userData = JSON.parse(userDataHeader);
      return {
        id: userData.id,
        username: userData.username || userData.id,
        email: userData.email || "",
        fullName: userData.fullName || "Unknown User",
        avatar: userData.avatar,
        isOnline: true,
        lastSeen: Date.now(),
      };
    }

    return null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

const DELETE_MESSAGES_AFTER_INACTIVITY_PERIOD = 1000 * 60 * 60 * 24 * 7; // 7 days

// Track additional information on room and connection objects
type ChatConnectionState = {
  user?: User | null;
  isTyping?: boolean;
  lastActivity?: number;
};

type ChatConnection = Party.Connection<ChatConnectionState>;

/**
 * This party manages the state and behaviour of an individual chat room
 */
export default class ChatRoomServer implements Party.Server {
  messages?: Message[];
  users: Map<string, User> = new Map();
  typingUsers: Set<string> = new Set();

  constructor(public party: Party.Party) {}

  /** Retrieve messages from room storage and store them on room instance */
  async ensureLoadMessages() {
    if (!this.messages) {
      this.messages =
        (await this.party.storage.get<Message[]>("messages")) ?? [];
    }
    return this.messages;
  }

  /** Clear room storage */
  async removeRoomMessages() {
    await this.party.storage.delete("messages");
    this.messages = [];
  }

  /** Remove this room from the room listing party */
  async removeRoomFromRoomList(id: string) {
    return this.party.context.parties.chatrooms.get(SINGLETON_ROOM_ID).fetch({
      method: "POST",
      body: JSON.stringify({
        id,
        action: "delete",
      }),
    });
  }

  /** Send room presence to the room listing party */
  async updateRoomList(action: "enter" | "leave", connection: ChatConnection) {
    const connections = Array.from(this.party.getConnections());
    return this.party.context.parties.chatrooms.get(SINGLETON_ROOM_ID).fetch({
      method: "POST",
      body: JSON.stringify({
        id: this.party.id,
        connections: connections.length,
        action,
      }),
    });
  }

  /** Broadcast current room users to all connections */
  async broadcastRoomUsers() {
    const activeUsers = Array.from(this.users.values());
    this.party.broadcast(roomUsersMessage(activeUsers));
  }

  /** Handle typing status */
  async handleTyping(userId: string, isTyping: boolean) {
    if (isTyping) {
      this.typingUsers.add(userId);
    } else {
      this.typingUsers.delete(userId);
    }

    // Broadcast typing status to all other users
    this.party.broadcast(typingMessage(userId, isTyping), [userId]);
  }

  /** Update user's last seen and online status */
  async updateUserStatus(userId: string, isOnline: boolean) {
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = Date.now();
      this.users.set(userId, user);

      // Broadcast user status to all connections
      this.party.broadcast(userStatusMessage(userId, isOnline, user.lastSeen));
    }
  }

  async authenticateUser(proxiedRequest: Party.Request) {
    // Find the connection
    const id = new URL(proxiedRequest.url).searchParams.get("_pk");
    const connection = id && this.party.getConnection(id);
    if (!connection) {
      return error(`No connection with id ${id}`);
    }

    // Authenticate the user with Clerk
    const session = await getClerkSession(proxiedRequest);
    if (!session) {
      return error(`No session found`);
    }

    // Update room list and user state
    this.updateRoomList("enter", connection);
    connection.setState({ user: session, lastActivity: Date.now() });

    // Add user to room users
    this.users.set(session.id, session);

    // Send welcome message
    connection.send(
      newMessage({
        id: nanoid(),
        from: { id: "system", name: "System" },
        text: `Welcome ${session.fullName}!`,
        at: Date.now(),
      })
    );

    // Broadcast updated user list
    this.broadcastRoomUsers();

    return ok();
  }

  /**
   * Responds to HTTP requests to /parties/main/:roomId endpoint
   */
  async onRequest(request: Party.Request) {
    const messages = await this.ensureLoadMessages();

    // Mark room as created by storing its id in object storage
    if (request.method === "POST") {
      // Respond to authentication requests
      if (new URL(request.url).pathname.endsWith("/auth")) {
        return await this.authenticateUser(request);
      }

      await this.party.storage.put("id", this.party.id);
      await this.party.storage.put("createdAt", Date.now());
      return ok();
    }

    // Return list of messages for server rendering pages
    if (request.method === "GET") {
      if (await this.party.storage.get("id")) {
        const roomData = {
          messages,
          users: Array.from(this.users.values()),
          roomId: this.party.id,
          createdAt: await this.party.storage.get("createdAt"),
        };
        return json(roomData);
      }
      return notFound();
    }

    // Clear room history
    if (request.method === "DELETE") {
      await this.removeRoomMessages();
      this.party.broadcast(JSON.stringify(<ClearRoomMessage>{ type: "clear" }));
      this.party.broadcast(
        newMessage({
          id: nanoid(),
          from: { id: "system", name: "System" },
          text: `Room history cleared`,
          at: Date.now(),
        })
      );
      return ok();
    }

    // Respond to cors preflight requests
    if (request.method === "OPTIONS") {
      return ok();
    }

    return notFound();
  }

  /**
   * Executes when a new WebSocket connection is made to the room
   */
  async onConnect(connection: ChatConnection, ctx: Party.ConnectionContext) {
    console.log("📨 ChatRoom: New connection:", connection.id);

    try {
      // Get user data from query parameters
      const url = new URL(ctx.request.url);
      const userDataString = url.searchParams.get("userData");

      if (!userDataString) {
        console.error("📨 ChatRoom: No userData in connection query");
        connection.close(1008, "Authentication required");
        return;
      }

      const userData = JSON.parse(userDataString);
      console.log("📨 ChatRoom: User data from connection:", userData);

      // Store user in connection state
      connection.setState({
        user: userData,
        lastActivity: Date.now(),
      });

      // Store user in users map
      this.users.set(userData.id, userData);

      await this.ensureLoadMessages();

      // Send the whole list of messages to user when they connect
      connection.send(syncMessage(this.messages ?? []));

      // Send current room users
      connection.send(roomUsersMessage(Array.from(this.users.values())));

      // Keep track of connections
      this.updateRoomList("enter", connection);

      console.log("📨 ChatRoom: User connected successfully:", userData.id);
    } catch (error) {
      console.error("📨 ChatRoom: Error in onConnect:", error);
      connection.close(1011, "Authentication failed");
    }
  }

  async onMessage(message: string, sender: ChatConnection) {
    console.log("📨 ChatRoom: Received message:", message);

    try {
      const data = JSON.parse(message);
      const user = sender.state?.user;

      if (!user) {
        console.error("📨 ChatRoom: User not found for connection:", sender.id);
        return;
      }

      switch (data.type) {
        case "message":
          await this.handleUserMessage(data, user, sender);
          break;
        case "typing":
          await this.handleTyping(user.id, data.isTyping);
          break;
        case "delete_message":
          await this.handleMessageDeletion(data, user);
          break;
        case "edit_message":
          await this.handleMessageEdit(data, user);
          break;
        case "delete_room":
          await this.handleRoomDeletion(data, user);
          break;
        default:
          console.log("📨 ChatRoom: Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("📨 ChatRoom: Error processing message:", error);
    }
  }

  async onClose(connection: ChatConnection) {
    const user = connection.state?.user;

    if (user) {
      // Remove user from active users
      this.users.delete(user.id);
      this.typingUsers.delete(user.id);

      // Update user status to offline
      await this.updateUserStatus(user.id, false);

      // Broadcast updated user list
      this.broadcastRoomUsers();
    }

    this.updateRoomList("leave", connection);
  }

  /**
   * A scheduled job that executes when the room storage alarm is triggered
   */
  async onAlarm() {
    // Alarms don't have access to room id, so retrieve it from storage
    const id = await this.party.storage.get<string>("id");
    if (id) {
      await this.removeRoomMessages();
      await this.removeRoomFromRoomList(id);
    }
  }

  private async handleUserMessage(
    data: any,
    user: User,
    sender: ChatConnection
  ) {
    if (!data.text || data.text.trim().length === 0) {
      return sender.send(systemMessage("Message cannot be empty"));
    }

    if (data.text.length > 2000) {
      return sender.send(
        systemMessage("Message too long (max 2000 characters)")
      );
    }

    const messageId = data.id || nanoid();
    const payload = {
      id: messageId,
      from: {
        id: user.id,
        name: user.fullName,
        avatar: user.avatar,
      },
      text: data.text.trim(),
      at: Date.now(),
      type: "text" as const,
    };

    // Send message to all connections
    this.party.broadcast(JSON.stringify(payload));
    this.messages!.push(payload);

    // Persist messages to storage
    await this.party.storage.put("messages", this.messages);
  }

  private async handleMessageDeletion(data: any, user: User) {
    const { messageId } = data;

    if (!messageId) {
      console.error("📨 ChatRoom: No messageId provided for deletion");
      return;
    }

    // Find the message to delete
    const messageIndex = this.messages!.findIndex(
      (msg) => msg.id === messageId
    );
    if (messageIndex === -1) {
      console.error("📨 ChatRoom: Message not found for deletion:", messageId);
      return;
    }

    const message = this.messages![messageIndex];

    // Check if user owns the message
    if (message.from.id !== user.id) {
      console.error("📨 ChatRoom: User cannot delete message they don't own");
      return;
    }

    // Remove message from array
    this.messages!.splice(messageIndex, 1);

    // Broadcast deletion to all users
    this.party.broadcast(
      JSON.stringify({
        type: "message_deleted",
        messageId: messageId,
      })
    );

    // Persist updated messages
    await this.party.storage.put("messages", this.messages);
    console.log("📨 ChatRoom: Message deleted:", messageId);
  }

  private async handleMessageEdit(data: any, user: User) {
    const { messageId, text } = data;

    if (!messageId || !text) {
      console.error("📨 ChatRoom: Missing messageId or text for edit");
      return;
    }

    if (text.trim().length === 0) {
      console.error("📨 ChatRoom: Cannot edit message to empty text");
      return;
    }

    if (text.length > 2000) {
      console.error("📨 ChatRoom: Edited message too long");
      return;
    }

    // Find the message to edit
    const messageIndex = this.messages!.findIndex(
      (msg) => msg.id === messageId
    );
    if (messageIndex === -1) {
      console.error("📨 ChatRoom: Message not found for editing:", messageId);
      return;
    }

    const message = this.messages![messageIndex];

    // Check if user owns the message
    if (message.from.id !== user.id) {
      console.error("📨 ChatRoom: User cannot edit message they don't own");
      return;
    }

    // Update message
    this.messages![messageIndex] = {
      ...message,
      text: text.trim(),
      edited: true,
      editedAt: Date.now(),
    } as Message;

    // Broadcast edit to all users
    this.party.broadcast(
      JSON.stringify({
        type: "message_edited",
        messageId: messageId,
        text: text.trim(),
        editedAt: Date.now(),
      })
    );

    // Persist updated messages
    await this.party.storage.put("messages", this.messages);
    console.log("📨 ChatRoom: Message edited:", messageId);
  }

  private async handleRoomDeletion(data: any, user: User) {
    console.log("📨 ChatRoom: Room deletion requested by user:", user.id);

    // Clear all messages
    this.messages = [];
    await this.party.storage.put("messages", this.messages);

    // Broadcast room deletion to all users
    this.party.broadcast(
      JSON.stringify({
        type: "room_deleted",
        roomId: this.party.id,
        deletedBy: user.id,
      })
    );

    // Optionally clear the room from the chatrooms storage
    try {
      const response = await fetch(
        `http://localhost:1999/parties/chatrooms/chatrooms`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "deleteRoom",
            roomId: this.party.id,
          }),
        }
      );
      console.log("📨 ChatRoom: Room deleted from chatrooms storage");
    } catch (error) {
      console.error(
        "📨 ChatRoom: Failed to delete room from chatrooms storage:",
        error
      );
    }

    console.log("📨 ChatRoom: Room deleted successfully");
  }
}

ChatRoomServer satisfies Party.Worker;
