import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export async function POST(request: NextRequest) {
  console.log("🌐 API Route: POST /api/messaging/rooms called");
  try {
    const { userId } = await auth();
    console.log("🌐 API Route: Authenticated user ID:", userId);

    if (!userId) {
      console.error("🌐 API Route: No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("🌐 API Route: Request body:", body);

    const { participants, createdBy, participantData } = body;
    console.log("🌐 API Route: Extracted data:");
    console.log("🌐 API Route: - participants:", participants);
    console.log("🌐 API Route: - createdBy:", createdBy);
    console.log("🌐 API Route: - participantData:", participantData);

    if (
      !participants ||
      !Array.isArray(participants) ||
      participants.length < 2
    ) {
      console.error("🌐 API Route: Invalid participants:", participants);
      return NextResponse.json(
        { error: "At least 2 participants required" },
        { status: 400 }
      );
    }

    const partyKitBody = {
      action: "create",
      participants,
      createdBy,
      participantData,
    };

    console.log("🌐 API Route: Sending to PartyKit:", partyKitBody);

    // Create room via PartyKit
    const response = await fetch(
      `http://${PARTYKIT_HOST}/parties/chatrooms/chatrooms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partyKitBody),
      }
    );

    console.log("🌐 API Route: PartyKit response status:", response.status);
    console.log("🌐 API Route: PartyKit response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "🌐 API Route: PartyKit error:",
        response.status,
        errorText
      );
      throw new Error(
        `Failed to create room: ${response.status} - ${errorText}`
      );
    }

    const roomData = await response.json();
    console.log("🌐 API Route: PartyKit response data:", roomData);

    console.log("🌐 API Route: Returning room data to client");
    return NextResponse.json(roomData);
  } catch (error) {
    console.error("🌐 API Route: Room creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log("🌐 API Route: GET /api/messaging/rooms called");
  try {
    const { userId } = await auth();
    console.log("🌐 API Route: Authenticated user ID for GET:", userId);

    if (!userId) {
      console.error("🌐 API Route: No authenticated user for GET");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId");
    console.log("🌐 API Route: URL search params userId:", userIdParam);

    if (userIdParam && userIdParam !== userId) {
      console.error(
        "🌐 API Route: Forbidden - userId mismatch:",
        userIdParam,
        "vs",
        userId
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log("🌐 API Route: Fetching rooms from PartyKit for user:", userId);

    // Get user's rooms from PartyKit
    const partyKitUrl = `http://${PARTYKIT_HOST}/parties/chatrooms/chatrooms?userId=${userId}`;
    console.log("🌐 API Route: PartyKit URL:", partyKitUrl);

    const response = await fetch(partyKitUrl);

    console.log("🌐 API Route: PartyKit GET response status:", response.status);
    console.log("🌐 API Route: PartyKit GET response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🌐 API Route: PartyKit GET error:", errorText);
      throw new Error("Failed to fetch rooms");
    }

    const roomsData = await response.json();
    console.log("🌐 API Route: PartyKit rooms data:", roomsData);
    console.log("🌐 API Route: PartyKit rooms data type:", typeof roomsData);
    console.log(
      "🌐 API Route: PartyKit rooms data keys:",
      Object.keys(roomsData)
    );

    console.log("🌐 API Route: Returning rooms data to client");
    return NextResponse.json(roomsData);
  } catch (error) {
    console.error("🌐 API Route: Rooms fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
