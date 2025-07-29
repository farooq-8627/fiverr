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
  async onConnect(connection: ChatConnection) {
    await this.ensureLoadMessages();

    // Send the whole list of messages to user when they connect
    connection.send(syncMessage(this.messages ?? []));

    // Send current room users
    connection.send(roomUsersMessage(Array.from(this.users.values())));

    // Keep track of connections
    this.updateRoomList("enter", connection);
  }

  async onMessage(messageString: string, connection: ChatConnection) {
    const message = JSON.parse(messageString) as UserMessage | TypingMessage;
    const user = connection.state?.user;

    if (!isSessionValid(user)) {
      return connection.send(
        systemMessage("You must sign in to send messages to this room")
      );
    }

    // Update user's last activity
    connection.setState({
      ...connection.state,
      lastActivity: Date.now(),
    });

    // Handle typing indicator
    if (message.type === "typing") {
      const typingMsg = message as TypingMessage;
      return this.handleTyping(user.id, typingMsg.isTyping);
    }

    // Handle user messages
    if (message.type === "new" || message.type === "edit") {
      if (message.text.length > 2000) {
        return connection.send(
          systemMessage("Message too long (max 2000 characters)")
        );
      }

      if (message.text.trim().length === 0) {
        return connection.send(systemMessage("Message cannot be empty"));
      }

      const payload = <Message>{
        id: message.id ?? nanoid(),
        from: {
          id: user.id,
          name: user.fullName,
          avatar: user.avatar,
        },
        text: message.text.trim(),
        at: Date.now(),
        type: "text",
      };

      // Send new message to all connections
      if (message.type === "new") {
        this.party.broadcast(newMessage(payload));
        this.messages!.push(payload);
      }

      // Send edited message to all connections
      if (message.type === "edit") {
        payload.edited = true;
        this.party.broadcast(editMessage(payload));
        this.messages = this.messages!.map((m) =>
          m.id === message.id ? payload : m
        );
      }

      // Persist the messages to storage
      await this.party.storage.put("messages", this.messages);

      // Automatically clear the room storage after period of inactivity
      await this.party.storage.deleteAlarm();
      await this.party.storage.setAlarm(
        new Date().getTime() + DELETE_MESSAGES_AFTER_INACTIVITY_PERIOD
      );
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
}

ChatRoomServer satisfies Party.Worker;
