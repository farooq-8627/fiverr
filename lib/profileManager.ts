import { client } from "@/sanity/lib/client";
import {
  AgentProfile,
  ClientProfile,
  PersonalDetails,
  CoreIdentity,
  AutomationExpertise,
  Project,
  AgentBusinessDetails,
  AutomationNeeds,
  ProjectRequirements,
  ProjectScopeDetails,
  UserProfile,
} from "@/types/profile";

// Type guards
function isAgentProfile(
  profile: Partial<UserProfile>
): profile is Partial<AgentProfile> {
  return (
    "automationExpertise" in profile ||
    "projects" in profile ||
    "businessDetails" in profile
  );
}

function isClientProfile(
  profile: Partial<UserProfile>
): profile is Partial<ClientProfile> {
  return (
    "automationNeeds" in profile ||
    "projectRequirements" in profile ||
    "projectScope" in profile
  );
}

/**
 * ProfileManager class to handle interaction between the app and Sanity
 * for both agent and client profiles
 */
export class ProfileManager {
  /**
   * Create or update an agent profile
   */
  static async saveAgentProfile(
    profile: Partial<AgentProfile>
  ): Promise<string> {
    // Check if profile exists
    const existingProfile =
      profile.id ||
      (profile.userId
        ? await this.findProfileByUserId(profile.userId, "agentProfile")
        : null);

    const doc = {
      _type: "agentProfile",
      ...(existingProfile?._id
        ? { _id: existingProfile._id }
        : { _id: `agentProfile-${Date.now()}` }),
      userId: profile.userId,
      personalDetails: profile.personalDetails,
      coreIdentity: profile.coreIdentity,
      automationExpertise: profile.automationExpertise,
      projects: profile.projects,
      businessDetails: profile.businessDetails,
      updatedAt: new Date().toISOString(),
      ...(existingProfile?._id ? {} : { createdAt: new Date().toISOString() }),
    };

    const result = await client.createOrReplace(doc);
    return result._id;
  }

  /**
   * Create or update a client profile
   */
  static async saveClientProfile(
    profile: Partial<ClientProfile>
  ): Promise<string> {
    // Check if profile exists
    const existingProfile =
      profile.id ||
      (profile.userId
        ? await this.findProfileByUserId(profile.userId, "clientProfile")
        : null);

    const doc = {
      _type: "clientProfile",
      ...(existingProfile?._id
        ? { _id: existingProfile._id }
        : { _id: `clientProfile-${Date.now()}` }),
      userId: profile.userId,
      personalDetails: profile.personalDetails,
      coreIdentity: profile.coreIdentity,
      automationNeeds: profile.automationNeeds,
      projectRequirements: profile.projectRequirements,
      projectScope: profile.projectScope,
      updatedAt: new Date().toISOString(),
      ...(existingProfile?._id ? {} : { createdAt: new Date().toISOString() }),
    };

    const result = await client.createOrReplace(doc);
    return result._id;
  }

  /**
   * Generic method to save any profile type
   */
  static async saveProfile(profile: Partial<UserProfile>): Promise<string> {
    if (isAgentProfile(profile)) {
      return this.saveAgentProfile(profile);
    } else if (isClientProfile(profile)) {
      return this.saveClientProfile(profile);
    }
    throw new Error("Unknown profile type");
  }

  /**
   * Get an agent profile by ID
   */
  static async getAgentProfile(id: string): Promise<AgentProfile | null> {
    const profile = await client.fetch(
      `*[_type == "agentProfile" && _id == $id][0]`,
      { id }
    );
    return profile ? this.sanitizeProfile(profile) : null;
  }

  /**
   * Get a client profile by ID
   */
  static async getClientProfile(id: string): Promise<ClientProfile | null> {
    const profile = await client.fetch(
      `*[_type == "clientProfile" && _id == $id][0]`,
      { id }
    );
    return profile ? this.sanitizeProfile(profile) : null;
  }

  /**
   * Get a profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<UserProfile | null> {
    // Try agent profile first
    const agentProfile = await client.fetch(
      `*[_type == "agentProfile" && userId == $userId][0]`,
      { userId }
    );
    if (agentProfile) return this.sanitizeProfile(agentProfile);

    // Try client profile
    const clientProfile = await client.fetch(
      `*[_type == "clientProfile" && userId == $userId][0]`,
      { userId }
    );
    if (clientProfile) return this.sanitizeProfile(clientProfile);

    return null;
  }

  /**
   * Find a profile by user ID and type
   * @private
   */
  private static async findProfileByUserId(
    userId: string,
    type: "agentProfile" | "clientProfile"
  ) {
    return await client.fetch(`*[_type == $type && userId == $userId][0]`, {
      userId,
      type,
    });
  }

  /**
   * Update personal details section
   */
  static async updatePersonalDetails(
    userId: string,
    personalDetails: Partial<PersonalDetails>,
    profileType: "agentProfile" | "clientProfile"
  ): Promise<void> {
    const profile = await this.findProfileByUserId(userId, profileType);
    if (!profile) throw new Error("Profile not found");

    await client
      .patch(profile._id)
      .set({
        personalDetails: {
          ...profile.personalDetails,
          ...personalDetails,
        },
        updatedAt: new Date().toISOString(),
      })
      .commit();
  }

  /**
   * Update core identity section
   */
  static async updateCoreIdentity(
    userId: string,
    coreIdentity: Partial<CoreIdentity>,
    profileType: "agentProfile" | "clientProfile"
  ): Promise<void> {
    const profile = await this.findProfileByUserId(userId, profileType);
    if (!profile) throw new Error("Profile not found");

    await client
      .patch(profile._id)
      .set({
        coreIdentity: {
          ...profile.coreIdentity,
          ...coreIdentity,
        },
        updatedAt: new Date().toISOString(),
      })
      .commit();
  }

  /**
   * Update agent automation expertise
   */
  static async updateAutomationExpertise(
    userId: string,
    automationExpertise: Partial<AutomationExpertise>
  ): Promise<void> {
    const profile = await this.findProfileByUserId(userId, "agentProfile");
    if (!profile) throw new Error("Profile not found");

    await client
      .patch(profile._id)
      .set({
        automationExpertise: {
          ...profile.automationExpertise,
          ...automationExpertise,
        },
        updatedAt: new Date().toISOString(),
      })
      .commit();
  }

  /**
   * Update client automation needs
   */
  static async updateAutomationNeeds(
    userId: string,
    automationNeeds: Partial<AutomationNeeds>
  ): Promise<void> {
    const profile = await this.findProfileByUserId(userId, "clientProfile");
    if (!profile) throw new Error("Profile not found");

    await client
      .patch(profile._id)
      .set({
        automationNeeds: {
          ...profile.automationNeeds,
          ...automationNeeds,
        },
        updatedAt: new Date().toISOString(),
      })
      .commit();
  }

  /**
   * Add a project to agent profile
   */
  static async addProject(userId: string, project: Project): Promise<void> {
    const profile = await this.findProfileByUserId(userId, "agentProfile");
    if (!profile) throw new Error("Profile not found");

    await client
      .patch(profile._id)
      .setIfMissing({ projects: [] })
      .append("projects", [project])
      .set({ updatedAt: new Date().toISOString() })
      .commit();
  }

  /**
   * Remove a project from agent profile
   */
  static async removeProject(userId: string, projectId: string): Promise<void> {
    const profile = await this.findProfileByUserId(userId, "agentProfile");
    if (!profile) throw new Error("Profile not found");

    // Filter out the project to remove
    const updatedProjects = (profile.projects || []).filter(
      (project: { id: string }) => project.id !== projectId
    );

    await client
      .patch(profile._id)
      .set({
        projects: updatedProjects,
        updatedAt: new Date().toISOString(),
      })
      .commit();
  }

  /**
   * Update agent business details
   */
  static async updateBusinessDetails(
    userId: string,
    businessDetails: Partial<AgentBusinessDetails>
  ): Promise<void> {
    const profile = await this.findProfileByUserId(userId, "agentProfile");
    if (!profile) throw new Error("Profile not found");

    await client
      .patch(profile._id)
      .set({
        businessDetails: {
          ...profile.businessDetails,
          ...businessDetails,
        },
        updatedAt: new Date().toISOString(),
      })
      .commit();
  }

  /**
   * Update client project requirements
   */
  static async updateProjectRequirements(
    userId: string,
    projectRequirements: Partial<ProjectRequirements>
  ): Promise<void> {
    const profile = await this.findProfileByUserId(userId, "clientProfile");
    if (!profile) throw new Error("Profile not found");

    await client
      .patch(profile._id)
      .set({
        projectRequirements: {
          ...profile.projectRequirements,
          ...projectRequirements,
        },
        updatedAt: new Date().toISOString(),
      })
      .commit();
  }

  /**
   * Update client project scope
   */
  static async updateProjectScope(
    userId: string,
    projectScope: Partial<ProjectScopeDetails>
  ): Promise<void> {
    const profile = await this.findProfileByUserId(userId, "clientProfile");
    if (!profile) throw new Error("Profile not found");

    await client
      .patch(profile._id)
      .set({
        projectScope: {
          ...profile.projectScope,
          ...projectScope,
        },
        updatedAt: new Date().toISOString(),
      })
      .commit();
  }

  /**
   * Helper to sanitize Sanity response by removing Sanity-specific fields
   * @private
   */
  private static sanitizeProfile<T>(profile: any): T {
    const { _id, _type, _createdAt, _updatedAt, ...sanitized } = profile;
    return {
      id: _id,
      ...sanitized,
    } as T;
  }
}
