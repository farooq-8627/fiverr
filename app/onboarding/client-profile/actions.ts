"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClinet";
import {
  handleAsyncImageUploads,
  processProjectImagesAsync,
} from "@/lib/ImageUploads";
import { ensureUserDocumentExists } from "@/lib/UserProfiles";
export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// Main function to save client profile to Sanity
export async function saveClientProfile(
  formData: FormData
): Promise<FormState> {
  try {
    // Get authenticated user ID
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }

    // Ensure user document exists before proceeding
    const userExists = await ensureUserDocumentExists(userId);
    if (!userExists) {
      return {
        success: false,
        message:
          "User profile not found. Please complete your profile setup first.",
      };
    }

    // Create client profile document
    const clientProfile: any = {
      _type: "clientProfile",
      userId: {
        _type: "reference",
        _ref: `user-${userId}`, // This should match your user document ID
      },
      profileId: {
        _type: "slug",
        current: `${userId.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Track files to upload asynchronously
    const imagesToUpload: {
      type: string;
      file: File;
      path: string;
      additionalData?: any;
      documentId?: string;
    }[] = [];

    // Add automation needs and tools
    const automationNeeds = formData.getAll("automationNeeds");
    const currentTools = formData.getAll("currentTools");

    // Format the automation needs and tools according to schema
    clientProfile.automationNeeds = {
      _type: "automationNeeds",
      automationRequirements: automationNeeds,
      currentTools: currentTools,
    };

    // Create a separate client project document
    const projectData: any = {
      _type: "clientProject",
      title: formData.get("projectTitle") as string,
      businessDomain: formData.get("businessDomain") as string,
      description: formData.get("projectDescription") as string,
      painPoints: formData.get("painPoints") as string,
      budgetRange: formData.get("budgetRange") as string,
      timeline: formData.get("timeline") as string,
      complexity: formData.get("complexity") as string,
      engagementType: formData.get("engagementType") as string,
      teamSize: formData.get("teamSizeRequired") as string,
      experienceLevel: formData.get("experienceLevel") as string,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Remove any undefined or empty fields
    Object.keys(projectData).forEach((key) => {
      if (!projectData[key]) {
        delete projectData[key];
      }
    });

    // Only create project document if key details are provided
    try {
      const projectTitle = projectData.title?.trim();
      const businessDomain = projectData.businessDomain?.trim();
      const projectDescription = projectData.description?.trim();

      if (projectTitle && businessDomain && projectDescription) {
        console.log("Creating client project document:", projectData);
        const projectDoc = await backendClient.create(projectData);
        console.log("Created project document:", projectDoc._id);

        // Add the project reference to the client profile
        clientProfile.projects = [
          {
            _type: "reference",
            _key: `project_${Date.now()}`,
            _ref: projectDoc._id,
          },
        ];
      }
    } catch (error) {
      console.error("Error creating project document:", error);
    }

    // Debug log for project scope details
    console.log("Project Scope Details:", {
      budgetRange: formData.get("budgetRange"),
      timeline: formData.get("timeline"),
      complexity: formData.get("complexity"),
      engagementType: formData.get("engagementType"),
      teamSizeRequired: formData.get("teamSizeRequired"),
      experienceLevel: formData.get("experienceLevel"),
    });

    // Add project size preferences if provided
    const projectSizePreference = formData.getAll(
      "projectSizePreference"
    ) as string[];
    if (projectSizePreference && projectSizePreference.length > 0) {
      clientProfile.projectSizePreferences = projectSizePreference;
    }

    // Add team size if provided
    const teamSize = formData.get("teamSize") as string;
    if (teamSize) {
      clientProfile.teamSize = teamSize;
    }

    // Process projects data first (without images)
    const createdProjects: any[] = [];
    const projectsJSON = formData.get("projects") as string;
    if (projectsJSON) {
      const projects = JSON.parse(projectsJSON);

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const projectKey = `project_${i}_${Date.now()}`;

        // Create a proper client project document (without images initially)
        const clientProjectData: {
          _type: string;
          title: string;
          description: string;
          painPoints: string;
          createdAt: string;
          updatedAt: string;
        } = {
          _type: "clientProject",
          title: project.title,
          description: project.description,
          painPoints: project.painPoints || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Create the client project document
        try {
          const projectDoc = await backendClient.create(clientProjectData);
          console.log(`Created project document: ${projectDoc._id}`);

          createdProjects.push({
            _id: projectDoc._id,
            title: project.title,
          });

          // Add the project reference to the client profile
          clientProfile.projects = clientProfile.projects || [];
          clientProfile.projects.push({
            _type: "reference",
            _key: projectKey,
            _ref: projectDoc._id,
          });
        } catch (error) {
          console.error(`Error creating project document:`, error);
        }
      }
    }

    // Check if token is available
    if (!process.env.SANITY_API_TOKEN) {
      console.error(
        "Error: SANITY_API_TOKEN is not set in environment variables"
      );
      return {
        success: false,
        message:
          "Server configuration error: Missing API token. Please contact support.",
      };
    }

    console.log("Attempting to save client profile to Sanity...");
    console.log("Profile data:", JSON.stringify(clientProfile, null, 2));

    try {
      // Save the main client profile to Sanity
      console.log("Saving client profile to Sanity...");
      const result = await backendClient.create(clientProfile);
      const profileId = result._id;
      console.log("Client profile saved successfully:", profileId);

      // NOW UPDATE THE USER DOCUMENT WITH THE CLIENT PROFILE REFERENCE
      const userDocId = `user-${userId}`;
      console.log(
        `Updating user document ${userDocId} with new client profile reference...`
      );

      try {
        // First, try to get the current user document to check existing clientProfiles
        const currentUser = await backendClient.getDocument(userDocId);

        if (currentUser) {
          // Generate a unique key for the new client profile reference
          const referenceKey = `clientProfile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          // Update the user document with the new client profile reference
          await backendClient
            .patch(userDocId)
            .setIfMissing({ clientProfiles: [] })
            .append("clientProfiles", [
              {
                _type: "reference",
                _key: referenceKey,
                _ref: profileId,
              },
            ])
            .commit();

          console.log(
            `Successfully added client profile reference to user ${userDocId}`
          );
        } else {
          console.error(
            `User document ${userDocId} not found when trying to update`
          );
          return {
            success: false,
            message: "User document not found. Please contact support.",
          };
        }
      } catch (userUpdateError: any) {
        console.error(
          "Error updating user document with client profile reference:",
          userUpdateError
        );

        // Even if user update fails, the client profile was created successfully
        // So we should still return success but with a warning
        return {
          success: true,
          message:
            "Client profile created successfully, but there was an issue linking it to your user profile. Please contact support if you don't see it in your dashboard.",
        };
      }

      // Revalidate cached data immediately
      revalidatePath("/dashboard");
      revalidatePath("/profile");
      revalidatePath("/client-profile");

      // Start async image uploads in the background
      if (imagesToUpload.length > 0 || createdProjects.length > 0) {
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
          "Client profile created successfully and linked to your account! Images are still uploading in the background.",
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
    console.error("Error saving client profile to Sanity:", error);
    return {
      success: false,
      message: `Failed to save your profile: ${error.message || "Unknown error"}`,
    };
  }
}
