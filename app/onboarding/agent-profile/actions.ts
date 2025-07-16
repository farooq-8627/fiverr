"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

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

// Function to update agent profile automation expertise
export async function updateAgentProfileAutomation(formData: {
  profileId: string;
  skills?: string[];
  automationTools?: string[];
}): Promise<FormState> {
  console.log("Starting updateAgentProfileAutomation server action");
  try {
    // Get authenticated user ID
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
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

    // Update the automation expertise section
    await backendClient
      .patch(formData.profileId)
      .set({
        "automationExpertise.automationServices": formData.skills,
        "automationExpertise.toolsExpertise": formData.automationTools,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    // Revalidate cached data
    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Automation expertise updated successfully!",
    };
  } catch (error: any) {
    console.error("Error updating agent profile automation:", error);
    return {
      success: false,
      message: `Failed to update automation expertise: ${error.message || "Unknown error"}`,
    };
  }
}
