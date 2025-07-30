import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query too short" },
        { status: 400 }
      );
    }

    // Search users in Sanity
    const searchQuery = `*[_type == "user" && (
      personalDetails.username match $query + "*" ||
      personalDetails.email match $query + "*" ||
      coreIdentity.fullName match $query + "*"
    ) && clerkId != $currentUserId][0...10] {
      _id,
      clerkId,
      "id": clerkId,
      "username": personalDetails.username,
      "fullName": coreIdentity.fullName,
      "avatar": personalDetails.profilePicture.asset->url,
      "email": personalDetails.email
    }`;

    const users = await client.fetch(searchQuery, {
      query: query.trim(),
      currentUserId: userId,
    } as any);

    return NextResponse.json(users);
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
