import type * as Party from "partykit/server";
import { json, ok } from "./utils/response";

export const SINGLETON_ROOM_ID = "chatrooms";

export interface ChatRoom {
  id: string;
  participants: string[]; // User IDs
  participantData?: { id: string; name: string; avatar?: string }[]; // User profile data
  lastActivity: number;
  createdAt: number;
  connections: number;
  lastMessage?: {
    text: string;
    from: string;
    at: number;
  };
}

export type RoomInfoUpdateRequest = {
  id: string;
  connections: number;
  action: "enter" | "leave" | "delete";
};

export type CreateRoomRequest = {
  participants: string[]; // Array of user IDs
  createdBy: string;
  participantData?: { id: string; name: string; avatar?: string }[]; // User profile data
};

/**
 * This party manages the list of all chat rooms and their metadata
 */
export default class ChatRoomsServer implements Party.Server {
  constructor(public party: Party.Party) {}

  async onRequest(request: Party.Request) {
    const url = new URL(request.url);

    if (request.method === "POST") {
      try {
        const body = (await request.json()) as any;

        // Handle room creation
        if (body.action === "create") {
          return this.createRoom(body as CreateRoomRequest);
        }

        // Handle room updates (enter/leave/delete)
        return this.updateRoom(body as RoomInfoUpdateRequest);
      } catch (error) {
        console.error("Error processing POST request:", error);
        return new Response("Bad Request", { status: 400 });
      }
    }

    if (request.method === "GET") {
      const userId = url.searchParams.get("userId");

      if (userId) {
        // Get rooms for specific user
        return this.getRoomsForUser(userId);
      }

      // Get all rooms
      return this.getAllRooms();
    }

    if (request.method === "DELETE") {
      // Clean up test rooms
      return this.cleanupTestRooms();
    }

    return new Response("Method Not Allowed", { status: 405 });
  }

  async createRoom(request: CreateRoomRequest) {
    const { participants, createdBy, participantData } = request;

    console.log(
      "Creating room with participants:",
      participants,
      "createdBy:",
      createdBy
    );

    if (
      !participants ||
      !Array.isArray(participants) ||
      participants.length < 2
    ) {
      console.error("Invalid participants:", participants);
      return new Response("Invalid participants", { status: 400 });
    }

    // Sort participants to ensure consistent room IDs for the same users
    const sortedParticipants = [...participants].sort();
    const roomId = `room-${sortedParticipants.join("-")}`;

    console.log("Generated room ID:", roomId);

    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    // Check if room already exists
    if (rooms[roomId]) {
      return json({ roomId, exists: true, room: rooms[roomId] });
    }

    // Create new room
    const newRoom: ChatRoom = {
      id: roomId,
      participants: sortedParticipants,
      participantData: participantData || [],
      lastActivity: Date.now(),
      createdAt: Date.now(),
      connections: 0,
    };

    rooms[roomId] = newRoom;
    await this.party.storage.put("rooms", rooms);

    // Create the actual room party
    try {
      await this.party.context.parties.chatroom.get(roomId).fetch({
        method: "POST",
      });
      console.log("Successfully created party for room:", roomId);
    } catch (error) {
      console.error("Failed to create party for room:", roomId, error);
      // Continue anyway, the room creation in storage succeeded
    }

    return json({ roomId, exists: false, room: newRoom });
  }

  async updateRoom(request: RoomInfoUpdateRequest) {
    const { id, connections, action } = request;
    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    if (action === "delete") {
      delete rooms[id];
      await this.party.storage.put("rooms", rooms);
      return ok();
    }

    if (rooms[id]) {
      rooms[id].connections = connections;
      rooms[id].lastActivity = Date.now();
      await this.party.storage.put("rooms", rooms);
    }

    return ok();
  }

  async getRoomsForUser(userId: string) {
    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    // Filter rooms where user is a participant
    const userRooms = Object.values(rooms).filter((room) =>
      room.participants.includes(userId)
    );

    return json({ rooms: userRooms });
  }

  async getAllRooms() {
    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};
    return json({ rooms: Object.values(rooms) });
  }

  async cleanupTestRooms() {
    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    // Remove rooms with test participants
    const filteredRooms: Record<string, ChatRoom> = {};
    let deletedCount = 0;

    for (const [roomId, room] of Object.entries(rooms)) {
      const hasTestUser = room.participants.some(
        (participant) =>
          participant.includes("test_user") ||
          participant.includes("user1") ||
          participant.includes("user2")
      );

      if (!hasTestUser) {
        filteredRooms[roomId] = room;
      } else {
        deletedCount++;
      }
    }

    // Save cleaned rooms
    await this.party.storage.put("rooms", filteredRooms);

    return json({
      message: `Cleaned up ${deletedCount} test rooms`,
      remainingRooms: Object.keys(filteredRooms).length,
    });
  }
}

ChatRoomsServer satisfies Party.Worker;
