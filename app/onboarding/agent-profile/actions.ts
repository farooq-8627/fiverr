"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { AgentProject } from "@/types";

import {
  handleAsyncImageUploads,
  processProjectImagesAsync,
} from "@/lib/ImageUploads";
import { ensureUserDocumentExists } from "@/lib/UserProfiles";

interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// Add this interface at the top with other interfaces
interface FormStateWithProject extends FormState {
  project?: AgentProject;
}

// Main function to save agent profile to Sanity
export async function saveAgentProfile(formData: FormData): Promise<FormState> {
  console.log("Starting saveAgentProfile server action");
  try {
    // Get authenticated user ID
    console.log("Checking authentication...");
    const { userId } = await auth();

    if (!userId) {
      console.error("No userId found in auth context");
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }
    console.log("User authenticated:", userId);

    // Ensure user document exists before proceeding
    const userExists = await ensureUserDocumentExists(userId);
    if (!userExists) {
      return {
        success: false,
        message: "User profile not found. Please complete your profile first.",
      };
    }

    // Get the user document ID
    const userDocId = `user-${userId}`;
    console.log("User document found:", userDocId);

    // Extract essential form fields
    console.log("Extracting form fields...");

    // Create agent profile document
    console.log("Creating agent profile document structure...");
    const agentProfile: any = {
      _type: "agentProfile",
      userId: {
        _type: "reference",
        _ref: userDocId, // Use the full user document ID
      },
      profileId: {
        _type: "slug",
        current: `${userId.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Created agent profile structure:", agentProfile);

    // Track files to upload asynchronously
    console.log("Setting up image upload tracking...");
    const imagesToUpload: {
      type: string;
      file: File;
      path: string;
      additionalData?: any;
      documentId?: string;
    }[] = [];

    // Add automation expertise
    console.log("Processing automation expertise...");
    const skills = formData.getAll("skills") as string[];
    const expertiseLevel = formData.get("expertiseLevel") as string;
    const automationTools = formData.getAll("automationTools") as string[];
    console.log("Skills and tools:", {
      skills,
      expertiseLevel,
      automationTools,
    });

    agentProfile.automationExpertise = {
      _type: "automationExpertise",
      automationServices: skills,
      toolsExpertise: automationTools,
    };

    // Add business details
    console.log("Processing business details...");
    const pricingModel = formData.get("pricingModel") as string;
    const availability = formData.get("availability") as string;
    const workType = formData.get("workType") as string;
    console.log("Business details:", { pricingModel, availability, workType });

    agentProfile.businessDetails = {
      _type: "agentBusinessDetails",
      pricingModel,
      availability,
      workType,
    };

    // Add project size preferences if provided
    const projectSizePreference = formData.getAll(
      "projectSizePreference"
    ) as string[];
    if (projectSizePreference && projectSizePreference.length > 0) {
      console.log("Adding project size preferences:", projectSizePreference);
      agentProfile.businessDetails.projectSizePreferences =
        projectSizePreference;
    }

    // Add team size if provided
    const teamSize = formData.get("teamSize") as string;
    if (teamSize) {
      console.log("Adding team size:", teamSize);
      agentProfile.businessDetails.teamSize = teamSize;
    }

    // Process projects data
    console.log("Processing projects data...");
    const createdProjects: any[] = [];
    const projectsJSON = formData.get("projects") as string;
    if (projectsJSON) {
      const projects = JSON.parse(projectsJSON);
      console.log("Found projects:", projects);

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        console.log(`Processing project ${i}:`, project);

        const projectKey = `project_${i}_${Date.now()}`;

        // Collect project image files for later async processing
        const projectImageFiles = [];
        for (let j = 0; j < 10; j++) {
          const imageKey = `projectImages[${i}][${j}]`;
          const image = formData.get(imageKey) as File;
          if (image && image.size > 0) {
            console.log(`Found image ${j} for project ${i}:`, image.name);
            projectImageFiles.push(image);
          }
        }

        // Create project document
        try {
          const agentProjectData = {
            _type: "agentProject",
            title: project.title,
            description: project.description,
            projectLink: project.projectLink || "",
            technologies: project.technologies || [],
            status: "completed",
            isPortfolioProject: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          console.log("Creating project document:", agentProjectData);
          const projectDoc = await backendClient.create(agentProjectData);
          console.log(`Project document created: ${projectDoc._id}`);

          createdProjects.push({
            _id: projectDoc._id,
            title: project.title,
            imageFiles: projectImageFiles,
          });

          // Add the project reference to the agent profile
          agentProfile.projects = agentProfile.projects || [];
          agentProfile.projects.push({
            _type: "reference",
            _key: projectKey,
            _ref: projectDoc._id,
          });
        } catch (error) {
          console.error(`Error creating project document:`, error);
          throw error;
        }
      }
    }

    // Check if token is available
    if (!process.env.SANITY_API_TOKEN) {
      console.error("SANITY_API_TOKEN not found in environment variables");
      return {
        success: false,
        message:
          "Server configuration error: Missing API token. Please contact support.",
      };
    }

    console.log(
      "Final agent profile structure:",
      JSON.stringify(agentProfile, null, 2)
    );

    try {
      // Save the main profile to Sanity
      console.log("Saving agent profile to Sanity...");
      const result = await backendClient.create(agentProfile);
      const profileId = result._id;
      console.log("Profile saved successfully:", profileId);

      // Update user document to add this agent profile reference
      console.log("Updating user document with new agent profile reference...");

      // First, get the current user document to check existing agentProfiles
      const currentUserDoc = await backendClient.getDocument(userDocId);
      console.log("Current user document:", currentUserDoc);

      // Check if agentProfiles array exists, if not initialize it
      const currentAgentProfiles = currentUserDoc?.agentProfiles || [];
      console.log("Current agent profiles:", currentAgentProfiles);

      // Create new agent profile reference
      const newAgentProfileRef = {
        _type: "reference",
        _key: `agentProfile_${Date.now()}`, // Use timestamp for unique key
        _ref: profileId,
      };

      // Add the new reference to existing array
      const updatedAgentProfiles = [
        ...currentAgentProfiles,
        newAgentProfileRef,
      ];
      console.log("Updated agent profiles array:", updatedAgentProfiles);

      // Update the user document with the new agentProfiles array
      await backendClient
        .patch(userDocId)
        .set({ agentProfiles: updatedAgentProfiles })
        .commit();

      console.log(
        "User document updated successfully with agent profile reference"
      );

      // Verify the update
      const updatedUserDoc = await backendClient.getDocument(userDocId);
      console.log(
        "Verification - Updated user document agentProfiles:",
        updatedUserDoc?.agentProfiles
      );

      // Revalidate cached data immediately
      console.log("Revalidating paths...");
      revalidatePath("/dashboard");
      revalidatePath("/profile");

      // Start async image uploads in the background
      if (imagesToUpload.length > 0 || createdProjects.length > 0) {
        console.log("Starting background image processing...");
        console.log("Images to upload:", imagesToUpload.length);
        console.log("Projects with images:", createdProjects.length);

        // Don't await this - let it run in the background
        Promise.all([
          handleAsyncImageUploads(profileId, imagesToUpload),
          processProjectImagesAsync(profileId, createdProjects),
        ]).catch((error) => {
          console.error("Error in background image processing:", error);
        });
      }

      // Return success immediately without waiting for image uploads
      return {
        success: true,
        message:
          "Agent profile created successfully and linked to your user profile! Images are still uploading in the background.",
      };
    } catch (sanityError: any) {
      // Handle specific Sanity errors
      console.error("Sanity error details:", {
        message: sanityError.message,
        statusCode: sanityError.statusCode,
        responseBody: sanityError.responseBody,
      });

      // Return user-friendly error based on status code
      if (sanityError.statusCode === 401) {
        return {
          success: false,
          message:
            "Authentication error with content database. Please contact support with error code: SIO-401-AWH",
        };
      } else if (sanityError.statusCode === 403) {
        return {
          success: false,
          message:
            "Permission denied. Your account doesn't have write access to the database.",
        };
      } else {
        return {
          success: false,
          message: `Database error: ${sanityError.message || "Unknown error"}`,
        };
      }
    }
  } catch (error: any) {
    console.error("Error saving agent profile to Sanity:", error);
    return {
      success: false,
      message: `Failed to save your profile: ${error.message || "Unknown error"}`,
    };
  }
}

interface UpdateAgentProfileDetailsParams {
  profileId: string;
  businessDetails?: {
    pricingModel: string;
    availability: string;
    workType: string;
    teamSize: string;
    projectSizePreferences: string[];
  };
  availability?: {
    currentStatus: string;
    workingHours: string;
    timeZone: string;
    responseTime: string;
    availabilityHours: string;
  };
  automationExpertise?: {
    automationServices: string[];
    toolsExpertise: string[];
  };
  pricing?: {
    hourlyRateRange: string;
    minimumProjectBudget: string;
    preferredPaymentMethods: string[];
  };
  mustHaveRequirements?: {
    experience: string;
    dealBreakers: string[];
    industryDomain: string[];
    customIndustry?: string[];
    requirements: string[];
  };
}

// Updated function with Studio refresh
export async function updateAgentProfileDetails(
  params: UpdateAgentProfileDetailsParams
): Promise<FormState> {
  try {
    const { profileId, ...updateData } = params;

    console.log("=== DEBUG: Raw input data ===");
    console.log("profileId:", profileId);
    console.log("updateData:", JSON.stringify(updateData, null, 2));

    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }

    const existingProfile = await backendClient.getDocument(profileId);
    if (!existingProfile) {
      return {
        success: false,
        message: "Profile not found.",
      };
    }

    console.log("=== DEBUG: Existing Profile ===");
    console.log(JSON.stringify(existingProfile, null, 2));

    // Create mutation with proper structure
    const mutations: any = {};

    if (updateData.automationExpertise !== undefined) {
      const existingAutomationExpertise =
        existingProfile.automationExpertise || {};

      mutations.automationExpertise = {
        _type: "automationExpertise",
        automationServices: updateData.automationExpertise.automationServices,
        toolsExpertise: updateData.automationExpertise.toolsExpertise,
      };
    }

    if (
      updateData.businessDetails?.pricingModel !== undefined ||
      updateData.businessDetails?.workType !== undefined ||
      updateData.businessDetails?.teamSize !== undefined ||
      updateData.businessDetails?.projectSizePreferences !== undefined
    ) {
      const existingBusinessDetails = existingProfile?.businessDetails || {};

      mutations.businessDetails = {
        _type: "agentBusinessDetails",
        pricingModel:
          updateData.businessDetails?.pricingModel ||
          existingBusinessDetails.pricingModel,
        availability:
          updateData.businessDetails?.availability ||
          existingBusinessDetails.availability,
        workType:
          updateData.businessDetails?.workType ||
          existingBusinessDetails.workType,
        teamSize:
          updateData.businessDetails?.teamSize ||
          existingBusinessDetails.teamSize,
        projectSizePreferences:
          updateData.businessDetails?.projectSizePreferences ||
          existingBusinessDetails.projectSizePreferences,
      };
    }

    if (updateData.availability !== undefined) {
      mutations.availability = {
        _type: "object",
        availabilityStatus: updateData.availability.currentStatus,
        workingHoursPreference: updateData.availability.workingHours,
        timeZone: updateData.availability.timeZone,
        responseTimeCommitment: updateData.availability.responseTime,
        availabilityHours: updateData.availability.availabilityHours,
      };
    }

    if (updateData.pricing !== undefined) {
      mutations.pricing = {
        _type: "pricing",
        hourlyRateRange: updateData.pricing.hourlyRateRange,
        minimumProjectBudget: updateData.pricing.minimumProjectBudget,
        preferredPaymentMethods: updateData.pricing.preferredPaymentMethods,
      };
    }

    if (updateData.mustHaveRequirements !== undefined) {
      mutations.mustHaveRequirements = {
        _type: "mustHaveRequirements",
        experience: updateData.mustHaveRequirements.experience,
        dealBreakers: updateData.mustHaveRequirements.dealBreakers,
        industryDomain: updateData.mustHaveRequirements.industryDomain,
        customIndustry: updateData.mustHaveRequirements.customIndustry,
        requirements: updateData.mustHaveRequirements.requirements,
      };
    }

    mutations.updatedAt = new Date().toISOString();

    console.log("=== DEBUG: Final mutations ===");
    console.log(JSON.stringify(mutations, null, 2));

    // Update the document
    try {
      const result = await backendClient
        .patch(profileId)
        .set(mutations)
        .commit();

      console.log("=== DEBUG: Update result ===");
      console.log(JSON.stringify(result, null, 2));

      // Verify the update by fetching the document again
      const updatedDoc = await backendClient.getDocument(profileId);
      console.log("=== DEBUG: Updated document ===");
      console.log(JSON.stringify(updatedDoc, null, 2));

      // FORCE STUDIO TO REFRESH by invalidating the document
      try {
        await backendClient
          .patch(profileId)
          .set({ _updatedAt: new Date().toISOString() })
          .commit();
      } catch (e) {
        console.log("Studio refresh attempt failed (non-critical):", e);
      }

      // Aggressive cache clearing
      revalidatePath("/dashboard", "layout");
      revalidatePath(`/dashboard/${userId}`, "layout");
      revalidatePath("/dashboard", "page");
      revalidatePath(`/dashboard/${userId}`, "page");
      revalidatePath("/studio", "layout");
      revalidatePath("/studio", "page");

      return {
        success: true,
        message:
          "Profile updated successfully. Please refresh Sanity Studio to see changes.",
      };
    } catch (error: any) {
      console.error("=== ERROR: Sanity Update Failed ===");
      console.error("Error details:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);

      return {
        success: false,
        message: `Update failed: ${error.message || "Unknown error"}`,
      };
    }
  } catch (error: any) {
    console.error("=== ERROR: General Error ===", error);
    return {
      success: false,
      message: `Update failed: ${error.message || "Unknown error"}`,
    };
  }
}

interface UpdateAgentProjectParams {
  profileId: string;
  project: AgentProject;
}

export async function updateAgentProject(
  params: UpdateAgentProjectParams
): Promise<FormState> {
  try {
    const { profileId, project } = params;

    // Get authenticated user ID
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }

    // Verify ownership of the profile
    const profile = await backendClient.getDocument(profileId);
    if (!profile || profile.userId._ref !== `user-${userId}`) {
      return {
        success: false,
        message: "You don't have permission to update this project.",
      };
    }

    // Update the project document
    const projectUpdate = {
      title: project.title,
      description: project.description,
      projectLink: project.projectLink || "",
      technologies: project.technologies || [],
      status: project.status || "completed",
      isPortfolioProject: true,
      updatedAt: new Date().toISOString(),
    };

    await backendClient.patch(project._id).set(projectUpdate).commit();

    revalidatePath("/dashboard/[username]", "page");

    return {
      success: true,
      message: "Project updated successfully",
    };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      message: "Failed to update project. Please try again.",
    };
  }
}

export async function createAgentProject(
  profileId: string,
  projectData: FormData
): Promise<FormStateWithProject> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }

    const existingProfile = await backendClient.getDocument(profileId);
    if (!existingProfile) {
      return {
        success: false,
        message: "Profile not found.",
      };
    }

    // Parse project data
    const projectsJSON = projectData.get("projects") as string;
    if (!projectsJSON) {
      return {
        success: false,
        message: "No project data provided.",
      };
    }

    const projects = JSON.parse(projectsJSON);
    const createdProjects: any[] = [];

    // Process each project
    for (const project of projects) {
      const projectKey = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Collect project image files
      const projectImageFiles = [];
      for (let j = 0; j < 10; j++) {
        const imageKey = `projectImages[0][${j}]`;
        const image = projectData.get(imageKey) as File;
        if (image && image.size > 0) {
          projectImageFiles.push(image);
        }
      }

      // Create project document
      const agentProjectData = {
        _type: "agentProject",
        title: project.title,
        description: project.description,
        projectLink: project.projectLink || "",
        technologies: project.technologies || [],
        status: project.status || "completed",
        isPortfolioProject: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Creating project document:", agentProjectData);
      const projectDoc = await backendClient.create(agentProjectData);
      console.log(`Project document created: ${projectDoc._id}`);

      createdProjects.push({
        _id: projectDoc._id,
        title: project.title,
        imageFiles: projectImageFiles,
      });

      // Add project reference to the beginning of the projects array
      await backendClient
        .patch(profileId)
        .setIfMissing({ projects: [] })
        .insert("before", "projects[0]", [
          {
            _type: "reference",
            _key: projectKey,
            _ref: projectDoc._id,
          },
        ])
        .commit();

      console.log(
        `Successfully added project reference ${projectDoc._id} to agent profile ${profileId}`
      );
    }

    // Process images asynchronously
    if (createdProjects.length > 0) {
      console.log(
        "Starting background image processing for projects:",
        createdProjects.length
      );
      Promise.all([
        processProjectImagesAsync(profileId, createdProjects),
      ]).catch((error) => {
        console.error("Error in background image processing:", error);
      });
    }

    // Return with the created project
    const firstCreatedProject = createdProjects[0];
    const projectsData = JSON.parse(projectsJSON);
    const firstProjectData = projectsData[0];

    return {
      success: true,
      message: "Project created successfully",
      project: firstCreatedProject
        ? ({
            _id: firstCreatedProject._id,
            title: firstProjectData.title,
            description: firstProjectData.description,
            projectLink: firstProjectData.projectLink || "",
            technologies: firstProjectData.technologies || [],
            status: firstProjectData.status || "completed",
            isPortfolioProject: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as AgentProject)
        : undefined,
    };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return {
      success: false,
      message: error.message || "Failed to create project",
    };
  }
}

export async function deleteAgentProject(
  projectId: string
): Promise<FormState> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }

    // First, find all agent profiles that reference this project
    const query = `*[_type == "agentProfile" && references($projectId)]`;
    const agentProfiles = await backendClient.fetch(query, { projectId });

    // Remove the project reference from each agent profile
    for (const profile of agentProfiles) {
      await backendClient
        .patch(profile._id)
        .unset([`projects[_ref == "${projectId}"]`])
        .commit();
    }

    // Delete the project document
    await backendClient.delete(projectId);

    // Revalidate paths
    revalidatePath("/dashboard", "layout");
    revalidatePath(`/dashboard/${userId}`, "layout");
    revalidatePath("/dashboard", "page");
    revalidatePath(`/dashboard/${userId}`, "page");
    revalidatePath("/studio", "layout");
    revalidatePath("/studio", "page");

    return {
      success: true,
      message: "Project deleted successfully.",
    };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      message: `Failed to delete project: ${error.message || "Unknown error"}`,
    };
  }
}
