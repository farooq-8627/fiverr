import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { participants, createdBy, participantData } = body;

    if (
      !participants ||
      !Array.isArray(participants) ||
      participants.length < 2
    ) {
      return NextResponse.json(
        { error: "At least 2 participants required" },
        { status: 400 }
      );
    }

    // Create room via PartyKit
    const response = await fetch(
      `http://${PARTYKIT_HOST}/parties/chatrooms/chatrooms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          participants,
          createdBy,
          participantData,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PartyKit error:", response.status, errorText);
      throw new Error(
        `Failed to create room: ${response.status} - ${errorText}`
      );
    }

    const roomData = await response.json();
    return NextResponse.json(roomData);
  } catch (error) {
    console.error("Room creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId");

    if (userIdParam && userIdParam !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user's rooms from PartyKit
    const response = await fetch(
      `http://${PARTYKIT_HOST}/parties/chatrooms/chatrooms?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }

    const roomsData = await response.json();
    return NextResponse.json(roomsData);
  } catch (error) {
    console.error("Rooms fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
