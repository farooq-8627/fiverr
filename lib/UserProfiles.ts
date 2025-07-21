import { backendClient } from "@/sanity/lib/backendClient";

// Helper function to ensure user document exists
export async function ensureUserDocumentExists(userId: string) {
  const userDocId = `user-${userId}`;

  try {
    // Try to fetch the user document
    const existingUser = await backendClient.getDocument(userDocId);

    if (!existingUser) {
      console.log(
        `User document ${userDocId} not found. This shouldn't happen if user profile was created first.`
      );
      return false;
    }

    console.log(`User document ${userDocId} exists`);
    return true;
  } catch (error) {
    console.error(`Error checking user document ${userDocId}:`, error);
    return false;
  }
}
