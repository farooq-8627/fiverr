import type * as Party from "partykit/server";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

export async function getClerkSession(
  request: Party.Request
): Promise<User | null> {
  try {
    // Parse user data from request headers or query parameters
    const userDataHeader = request.headers.get("x-user-data");
    const url = new URL(request.url);
    const userDataQuery = url.searchParams.get("userData");

    const userDataString = userDataHeader || userDataQuery;

    if (userDataString) {
      const userData = JSON.parse(userDataString);
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

export function isSessionValid(user?: User | null): user is User {
  return user != null && user.id != null;
}
