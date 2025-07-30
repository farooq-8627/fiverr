import { User } from "./auth";

export interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  at: number;
  type?: "text" | "image" | "file";
  edited?: boolean;
  editedAt?: number;
}

export interface UserMessage {
  type: "new" | "edit" | "delete";
  id?: string;
  text: string;
}

export interface SyncMessage {
  type: "sync";
  messages: Message[];
}

export interface ClearRoomMessage {
  type: "clear";
}

export interface TypingMessage {
  type: "typing";
  from: string;
  isTyping: boolean;
}

export interface UserStatusMessage {
  type: "user_status";
  userId: string;
  isOnline: boolean;
  lastSeen?: number;
}

export interface RoomUsersMessage {
  type: "room_users";
  users: User[];
}

export type MessageType =
  | Message
  | SyncMessage
  | ClearRoomMessage
  | TypingMessage
  | UserStatusMessage
  | RoomUsersMessage;

export function newMessage(message: Omit<Message, "type">): string {
  return JSON.stringify({
    type: "new",
    ...message,
  });
}

export function editMessage(message: Omit<Message, "type">): string {
  return JSON.stringify({
    type: "edit",
    ...message,
  });
}

export function syncMessage(messages: Message[]): string {
  return JSON.stringify({
    type: "sync",
    messages,
  });
}

export function systemMessage(text: string): string {
  return newMessage({
    id: `system-${Date.now()}`,
    from: { id: "system", name: "System" },
    text,
    at: Date.now(),
  });
}

export function typingMessage(from: string, isTyping: boolean): string {
  return JSON.stringify({
    type: "typing",
    from,
    isTyping,
  });
}

export function userStatusMessage(
  userId: string,
  isOnline: boolean,
  lastSeen?: number
): string {
  return JSON.stringify({
    type: "user_status",
    userId,
    isOnline,
    lastSeen,
  });
}

export function roomUsersMessage(users: User[]): string {
  return JSON.stringify({
    type: "room_users",
    users,
  });
}
