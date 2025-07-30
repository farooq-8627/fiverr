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

        // Handle last message updates
        if (body.action === "updateLastMessage") {
          return this.updateLastMessage(body.roomId, body.lastMessage);
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
      const action = url.searchParams.get("action");

      if (action === "cleanupEmptyRooms") {
        return this.cleanupRoomsWithoutParticipantData();
      }

      if (action === "deleteRoom") {
        const body = (await request.json()) as any;
        return this.deleteRoom(body.roomId);
      }

      if (url.searchParams.get("action") === "debugStorage") {
        return this.debugStorage();
      }

      // Default: Clean up test rooms
      return this.cleanupTestRooms();
    }

    if (url.searchParams.get("action") === "cleanupTestRooms") {
      return this.cleanupTestRooms();
    }

    if (url.searchParams.get("action") === "cleanupEmptyRooms") {
      return this.cleanupRoomsWithoutParticipantData();
    }

    return new Response("Method Not Allowed", { status: 405 });
  }

  async createRoom(request: CreateRoomRequest) {
    const { participants, createdBy, participantData } = request;

    console.log("🎈 PartyKit chatRooms: createRoom called");
    console.log("🎈 PartyKit chatRooms: participants:", participants);
    console.log("🎈 PartyKit chatRooms: createdBy:", createdBy);
    console.log("🎈 PartyKit chatRooms: participantData:", participantData);

    if (
      !participants ||
      !Array.isArray(participants) ||
      participants.length < 2
    ) {
      console.error(
        "🎈 PartyKit chatRooms: Invalid participants:",
        participants
      );
      return new Response("Invalid participants", { status: 400 });
    }

    // Sort participants to ensure consistent room IDs for the same users
    const sortedParticipants = [...participants].sort();
    const roomId = `room-${sortedParticipants.join("-")}`;

    console.log("🎈 PartyKit chatRooms: Generated room ID:", roomId);

    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    console.log("🎈 PartyKit chatRooms: Existing rooms:", Object.keys(rooms));

    // Check if room already exists
    if (rooms[roomId]) {
      console.log("🎈 PartyKit chatRooms: Room already exists:", rooms[roomId]);

      // Update existing room with participantData if it doesn't have it
      if (
        !rooms[roomId].participantData &&
        participantData &&
        participantData.length > 0
      ) {
        console.log(
          "🎈 PartyKit chatRooms: Updating existing room with participantData"
        );
        rooms[roomId].participantData = participantData;
        rooms[roomId].lastActivity = Date.now();
        await this.party.storage.put("rooms", rooms);
        console.log("🎈 PartyKit chatRooms: Updated room:", rooms[roomId]);
      }

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

    console.log("🎈 PartyKit chatRooms: Creating new room:", newRoom);

    rooms[roomId] = newRoom;
    await this.party.storage.put("rooms", rooms);

    console.log("🎈 PartyKit chatRooms: Room saved to storage");

    // Create the actual room party
    try {
      await this.party.context.parties.chatroom.get(roomId).fetch({
        method: "POST",
      });
      console.log(
        "🎈 PartyKit chatRooms: Successfully created party for room:",
        roomId
      );
    } catch (error) {
      console.error(
        "🎈 PartyKit chatRooms: Failed to create party for room:",
        roomId,
        error
      );
      // Continue anyway, the room creation in storage succeeded
    }

    console.log("🎈 PartyKit chatRooms: Returning room data:", {
      roomId,
      exists: false,
      room: newRoom,
    });
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

  async updateLastMessage(
    roomId: string,
    lastMessage: { text: string; from: string; at: number }
  ) {
    console.log(
      "🎈 PartyKit chatRooms: updateLastMessage called for room:",
      roomId
    );
    console.log("🎈 PartyKit chatRooms: lastMessage data:", lastMessage);

    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    if (rooms[roomId]) {
      rooms[roomId].lastMessage = lastMessage;
      rooms[roomId].lastActivity = Date.now();
      await this.party.storage.put("rooms", rooms);
      console.log(
        "🎈 PartyKit chatRooms: Updated lastMessage for room:",
        roomId
      );
    } else {
      console.warn(
        "🎈 PartyKit chatRooms: Room not found for lastMessage update:",
        roomId
      );
    }

    return ok();
  }

  async getRoomsForUser(userId: string) {
    console.log(
      "🎈 PartyKit chatRooms: getRoomsForUser called for userId:",
      userId
    );

    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    console.log("🎈 PartyKit chatRooms: All stored rooms:", rooms);
    console.log(
      "🎈 PartyKit chatRooms: Total rooms count:",
      Object.keys(rooms).length
    );

    // Filter rooms where user is a participant
    const userRooms = Object.values(rooms).filter((room) => {
      const isParticipant = room.participants.includes(userId);
      console.log(
        `🎈 PartyKit chatRooms: Room ${room.id} - User ${userId} is participant:`,
        isParticipant
      );
      console.log(
        `🎈 PartyKit chatRooms: Room ${room.id} participants:`,
        room.participants
      );
      console.log(
        `🎈 PartyKit chatRooms: Room ${room.id} participantData:`,
        room.participantData
      );
      return isParticipant;
    });

    console.log("🎈 PartyKit chatRooms: Filtered user rooms:", userRooms);
    console.log("🎈 PartyKit chatRooms: User rooms count:", userRooms.length);

    const result = { rooms: userRooms };
    console.log("🎈 PartyKit chatRooms: Returning result:", result);

    return json(result);
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

  async cleanupRoomsWithoutParticipantData() {
    console.log(
      "🎈 PartyKit chatRooms: Cleaning up rooms without participantData"
    );

    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    const roomsToDelete: string[] = [];

    Object.entries(rooms).forEach(([roomId, room]) => {
      if (!room.participantData || room.participantData.length === 0) {
        console.log(
          "🎈 PartyKit chatRooms: Marking room for deletion:",
          roomId
        );
        roomsToDelete.push(roomId);
      }
    });

    roomsToDelete.forEach((roomId) => {
      delete rooms[roomId];
    });

    if (roomsToDelete.length > 0) {
      await this.party.storage.put("rooms", rooms);
      console.log("🎈 PartyKit chatRooms: Deleted rooms:", roomsToDelete);
    }

    return json({ deletedRooms: roomsToDelete });
  }

  async deleteRoom(roomId: string) {
    console.log("🎈 PartyKit chatRooms: Deleting room:", roomId);

    const rooms =
      (await this.party.storage.get<Record<string, ChatRoom>>("rooms")) ?? {};

    if (rooms[roomId]) {
      delete rooms[roomId];
      await this.party.storage.put("rooms", rooms);
      console.log("🎈 PartyKit chatRooms: Room deleted from storage:", roomId);
      return json({ success: true, deletedRoom: roomId });
    } else {
      console.log(
        "🎈 PartyKit chatRooms: Room not found for deletion:",
        roomId
      );
      return json({ success: false, error: "Room not found" });
    }
  }

  async debugStorage() {
    console.log("🎈 PartyKit chatRooms: Debug storage called");
    const rooms =
      await this.party.storage.get<Record<string, ChatRoom>>("rooms");
    console.log("🎈 PartyKit chatRooms: All rooms in storage:", rooms);
    return json({ allRooms: rooms });
  }
}

ChatRoomsServer satisfies Party.Worker;
