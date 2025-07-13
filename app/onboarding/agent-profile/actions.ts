"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClinet";
import {
  handleAsyncImageUploads,
  processProjectImagesAsync,
} from "@/lib/ImageUploads";

// Validation schema matching your Sanity schema
const agentProfileSchema = z.object({
  title: z.string().min(1, "Professional title is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters long"),
  skills: z
    .array(z.string())
    .min(1, "At least one skill is required")
    .max(10, "Maximum 10 skills allowed"),
  pricingModel: z.string().min(1, "Pricing model is required"),
  availability: z.string().min(1, "Availability status is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  timezone: z.string().min(1, "Timezone is required"),
  portfolio: z
    .array(
      z.object({
        title: z.string().min(1, "Project title is required"),
        description: z
          .string()
          .min(10, "Project description must be at least 10 characters"),
        url: z.string().url("Invalid URL").optional(),
      })
    )
    .optional(),
});

export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}
// Main function to save agent profile to Sanity
export async function saveAgentProfile(formData: FormData): Promise<FormState> {
  try {
    // Get authenticated user ID
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }
    // First, check if user exists in Sanity or create them
    let sanityUser = await backendClient.fetch(
      `*[_type == "user" && clerkId == $clerkId][0]`,
      { clerkId: userId }
    );

    if (!sanityUser) {
      // Create new user document in Sanity
      sanityUser = await backendClient.create({
        _type: "user",
        clerkId: userId,
        personalDetails: {
          email: formData.get("email") as string,
          username: formData.get("username") as string,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Create agent profile document with reference to Sanity user
    const agentProfile: any = {
      _type: "agentProfile",
      user: {
        _type: "reference",
        _ref: sanityUser._id, // Use Sanity user ID for reference
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

    // Add automation expertise
    const automationServices = formData.getAll(
      "automationExpertise.automationServices"
    ) as string[];
    const automationTools = formData.getAll(
      "automationExpertise.toolsExpertise"
    ) as string[];

    if (automationServices.length > 0 || automationTools.length > 0) {
      agentProfile.automationExpertise = {
        _type: "automationExpertise",
        automationServices:
          automationServices.length > 0 ? automationServices : [],
        toolsExpertise: automationTools.length > 0 ? automationTools : [],
      };
    }

    // Add business details
    agentProfile.businessDetails = {
      _type: "agentBusinessDetails",
      pricingModel: formData.get("businessDetails.pricingModel") as string,
      availability: formData.get("businessDetails.availability") as string,
      projectSizePreferences: formData.getAll(
        "businessDetails.projectSizePreferences"
      ) as string[],
      teamSize: formData.get("businessDetails.teamSize") as string,
      workType: formData.get("businessDetails.workType") as string,
    };

    // Add project size preferences if provided
    const projectSizePreference = formData.getAll(
      "businessDetails.projectSizePreferences"
    ) as string[];
    if (projectSizePreference && projectSizePreference.length > 0) {
      agentProfile.businessDetails.projectSizePreferences =
        projectSizePreference;
    }

    // Add team size if provided
    const teamSize = formData.get("businessDetails.teamSize") as string;
    if (teamSize) {
      agentProfile.businessDetails.teamSize = teamSize;
    }

    // Add work type if provided
    const workType = formData.get("businessDetails.workType") as string;
    if (workType) {
      agentProfile.businessDetails.workType = workType;
    }

    // Process projects data first (without images)
    const createdProjects: any[] = [];
    const projectsJSON = formData.get("projects") as string;
    if (projectsJSON) {
      const projects = JSON.parse(projectsJSON);

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const projectKey = `project_${i}_${Date.now()}`;

        // Collect project image files for later async processing
        const projectImageFiles = [];
        for (let j = 0; j < 10; j++) {
          const imageKey = `images[${i}][${j}]`;
          const image = formData.get(imageKey) as File;
          if (image && image.size > 0) {
            projectImageFiles.push(image);
          }
        }

        const slug =
          project.title +
          "-" +
          Math.random().toString(36).substring(2, 15).toLowerCase();

        // Create a proper agent project document (without images initially)
        const agentProjectData: {
          _type: string;
          slug: {
            _type: "slug";
            current: string;
          };
          agent: string;
          title: string;
          description: string;
          projectLink: string;
          technologies: string[];
          status: string;
          isPortfolioProject: boolean;
          createdAt: string;
          updatedAt: string;
          images: any[];
        } = {
          _type: "agentProject",
          slug: {
            _type: "slug",
            current: slug,
          },
          agent: agentProfile._id,
          title: project.title,
          description: project.description,
          projectLink: project.projectLink || "",
          technologies: project.technologies || [],
          status: "completed",
          isPortfolioProject: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          images: projectImageFiles.map((file) => ({
            _type: "image",
            asset: {
              _type: "reference",
              _ref: file,
            },
          })),
        };

        // Create the agent project document
        try {
          const projectDoc = await backendClient.create(agentProjectData);
          console.log(`Created project document: ${projectDoc._id}`);

          createdProjects.push({
            _id: projectDoc._id,
            title: project.title,
            images: projectImageFiles,
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

    console.log("Attempting to save agent profile to Sanity...");
    console.log("Profile data:", JSON.stringify(agentProfile, null, 2));

    try {
      // Save the main profile to Sanity
      const result = await backendClient.create(agentProfile);
      const profileId = result._id;
      console.log("Profile saved successfully:", profileId);

      // Revalidate cached data immediately
      revalidatePath("/dashboard");
      revalidatePath("/profile");

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
          "Agent profile created successfully! Images are still uploading in the background.",
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

// Additional server action for updating profile
export async function updateAgentProfile(
  profileId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      title: formData.get("title") as string,
      bio: formData.get("bio") as string,
      skills: formData.getAll("skills") as string[],
      pricingModel: formData.get("pricingModel") as string,
      availability: formData.get("availability") as string,
      languages: formData.getAll("languages") as string[],
      timezone: formData.get("timezone") as string,
      portfolio: parsePortfolioData(formData),
    };

    const validatedData = agentProfileSchema.parse(rawData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Example: Update in Sanity
    // const client = getSanityClient();
    // await client.patch(profileId).set({
    //   ...validatedData,
    //   updatedAt: new Date().toISOString(),
    // }).commit();

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully! ✅",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });

      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    console.error("Error updating agent profile:", error);
    return {
      success: false,
      message:
        "An error occurred while updating your profile. Please try again.",
    };
  }
}

// Helper function to parse portfolio data from FormData
function parsePortfolioData(formData: FormData) {
  const portfolioItems = [];
  let index = 0;

  while (formData.has(`portfolio[${index}].title`)) {
    portfolioItems.push({
      title: formData.get(`portfolio[${index}].title`) as string,
      description: formData.get(`portfolio[${index}].description`) as string,
      url: formData.get(`portfolio[${index}].url`) as string,
    });
    index++;
  }

  return portfolioItems.length > 0 ? portfolioItems : undefined;
}
