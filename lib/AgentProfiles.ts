import { backendClient } from "@/sanity/lib/backendClient";

// Helper function to check if user has existing agent profiles
export async function getUserAgentProfiles(userId: string) {
  try {
    const userDocId = `user-${userId}`;
    const userDoc = await backendClient.getDocument(userDocId);

    if (!userDoc) {
      console.log("User document not found");
      return [];
    }

    const agentProfiles = userDoc.agentProfiles || [];
    console.log("Found agent profiles for user:", agentProfiles);

    return agentProfiles;
  } catch (error) {
    console.error("Error fetching user agent profiles:", error);
    return [];
  }
}

// Helper function to remove agent profile reference from user
export async function removeAgentProfileFromUser(
  userId: string,
  profileId: string
) {
  try {
    const userDocId = `user-${userId}`;
    const userDoc = await backendClient.getDocument(userDocId);

    if (!userDoc) {
      throw new Error("User document not found");
    }

    const currentAgentProfiles = userDoc.agentProfiles || [];
    const updatedAgentProfiles = currentAgentProfiles.filter(
      (profile: any) => profile._ref !== profileId
    );

    await backendClient
      .patch(userDocId)
      .set({ agentProfiles: updatedAgentProfiles })
      .commit();

    console.log("Agent profile reference removed from user successfully");
    return true;
  } catch (error) {
    console.error("Error removing agent profile from user:", error);
    return false;
  }
}
