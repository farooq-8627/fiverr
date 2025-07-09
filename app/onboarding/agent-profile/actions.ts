"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClinet";

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

// Helper function to upload an image to Sanity's asset store
async function uploadImageToSanity(file: File) {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Log file details for debugging
    console.log(
      `Uploading image: ${file.name}, size: ${file.size} bytes, type: ${file.type}`
    );

    // Upload to Sanity with retry logic
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const result = await backendClient.assets.upload("image", buffer, {
          filename: file.name,
          contentType: file.type,
        });

        console.log(
          `Successfully uploaded image: ${file.name}, id: ${result._id}`
        );
        return result;
      } catch (error) {
        attempts++;
        console.error(
          `Upload attempt ${attempts} failed for ${file.name}:`,
          error
        );

        if (attempts >= maxAttempts) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error(`Failed to upload image ${file.name}:`, error);
    throw error;
  }
}

// Async function to handle image uploads with retries
async function handleAsyncImageUploads(
  profileId: string,
  files: {
    type: string;
    file: File;
    path: string;
    additionalData?: any;
    documentId?: string;
  }[]
) {
  for (const { type, file, path, additionalData, documentId } of files) {
    if (!file || file.size === 0) continue;

    // Add retry logic for image uploads
    let retries = 0;
    const maxRetries = 3;
    let success = false;

    while (!success && retries < maxRetries) {
      try {
        console.log(
          `Uploading image ${file.name} (attempt ${retries + 1}/${maxRetries})...`
        );
        const imageAsset = await uploadImageToSanity(file);

        if (imageAsset) {
          // Create image reference
          const imageRef = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          };

          // Determine which document to patch
          const targetDocId = documentId || profileId;
          console.log(
            `Updating document ${targetDocId} with image at path: ${path}`
          );

          // Patch the document with the new image
          if (type === "array") {
            // For array types, we need to get the current array and append to it
            try {
              // First get the current document to see what's already in the array
              const doc = await backendClient.getDocument(targetDocId);

              if (doc) {
                // Create a new array with existing items + new item
                const currentArray = doc[path] || [];

                // Check if this is a projectImage type (from additionalData._type)
                let newItem;
                if (additionalData && additionalData._type === "projectImage") {
                  // For projectImage type, we need to structure it according to the schema
                  newItem = {
                    _type: "projectImage",
                    _key: additionalData._key,
                    alt: additionalData.alt || "Project image",
                    image: imageRef, // Nest the image reference inside the 'image' field
                  };
                } else {
                  // For regular images, just add the imageRef with additionalData
                  newItem = { ...imageRef, ...additionalData };
                }

                const updatedArray = [...currentArray, newItem];

                // Update with the new array
                await backendClient
                  .patch(targetDocId)
                  .set({ [path]: updatedArray })
                  .commit();
              } else {
                console.error(`Document not found for ID: ${targetDocId}`);
                throw new Error(`Document not found for ID: ${targetDocId}`);
              }
            } catch (error) {
              console.error(`Error updating array at path ${path}:`, error);
              throw error; // Rethrow to trigger retry
            }
          } else {
            // For simple object types
            await backendClient
              .patch(targetDocId)
              .set({ [path]: imageRef })
              .commit();
          }

          console.log(
            `Successfully added ${file.name} to document ${targetDocId} at path: ${path}`
          );
          success = true; // Mark as successful to exit retry loop
        } else {
          throw new Error("Image asset upload failed");
        }
      } catch (error) {
        retries++;
        console.error(
          `Attempt ${retries}/${maxRetries} failed for ${file.name}:`,
          error
        );

        if (retries >= maxRetries) {
          console.error(
            `Failed to upload and attach image ${file.name} after ${maxRetries} attempts:`,
            error
          );
        } else {
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, retries), 10000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }
}

// Process project images asynchronously
async function processProjectImagesAsync(profileId: string, projects: any[]) {
  // For each project that's been created
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (
      !project._id ||
      !project.imageFiles ||
      project.imageFiles.length === 0
    ) {
      console.log(
        `Skipping project with no images or invalid ID: ${project.title}`
      );
      continue;
    }

    console.log(
      `Processing ${project.imageFiles.length} images for project: ${project.title} (${project._id})`
    );

    // Collect all images for this project
    const imagesToUpload = [];
    for (let j = 0; j < project.imageFiles.length; j++) {
      const imageFile = project.imageFiles[j];

      if (imageFile && imageFile.size > 0) {
        try {
          imagesToUpload.push({
            type: "array",
            file: imageFile,
            path: "images",
            documentId: project._id,
            additionalData: {
              _type: "projectImage", // Changed from "image" to "projectImage"
              _key: `image_${j}_${Date.now()}`,
              alt: project.title || "Project image",
            },
          });
        } catch (error) {
          console.error(
            `Error preparing image ${j} for project ${project._id}:`,
            error
          );
        }
      }
    }

    // Upload images for this project if there are any
    if (imagesToUpload.length > 0) {
      try {
        await handleAsyncImageUploads(project._id, imagesToUpload);
      } catch (error) {
        console.error(
          `Failed to process images for project ${project._id}:`,
          error
        );
      }
    }
  }
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

    // Extract essential form fields
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;
    const fullName = formData.get("fullName") as string;
    const hasCompany = formData.get("hasCompany") === "true";
    const socialLinksJSON = formData.get("socialLinks") as string;
    const socialLinks = socialLinksJSON ? JSON.parse(socialLinksJSON) : [];

    // Create agent profile document
    const agentProfile: any = {
      _type: "agentProfile",
      userId: userId,
      personalDetails: {
        _type: "personalDetails",
        email,
        phone,
        username,
        website,
        socialLinks: socialLinks.map((link: any, index: number) => ({
          _type: "socialLink",
          _key: `social_${index}_${Date.now()}`,
          platform: link.platform,
          url: link.url,
        })),
      },
      coreIdentity: {
        _type: "coreIdentity",
        fullName,
        hasCompany,
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

    // Queue profile picture for async upload if provided
    const profilePicture = formData.get("profilePicture") as File;
    if (profilePicture && profilePicture.size > 0) {
      imagesToUpload.push({
        type: "object",
        file: profilePicture,
        path: "personalDetails.profilePicture",
      });
    }

    // Queue banner image for async upload if provided
    const bannerImage = formData.get("bannerImage") as File;
    if (bannerImage && bannerImage.size > 0) {
      imagesToUpload.push({
        type: "object",
        file: bannerImage,
        path: "personalDetails.bannerImage",
      });
    }

    // Add company details if applicable
    let companyId: string | undefined;
    if (hasCompany) {
      // Create a proper company reference instead of embedding company details
      interface CompanyData {
        _type: string;
        name: string;
        teamSize: string;
        bio: string;
        website: string;
        companyType: string;
        serviceOfferings?: string[];
        industries?: string[];
        yearsInBusiness?: number;
        createdAt: string;
        updatedAt: string;
      }

      const companyData: CompanyData = {
        _type: "company", // Use the base company type
        name: formData.get("company.name") as string,
        teamSize: formData.get("company.teamSize") as string, // Match the field name in the schema
        bio: formData.get("company.bio") as string,
        website: formData.get("company.website") as string,
        companyType: "agent", // Specify this is an agent company
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add service offerings if available
      const serviceOfferings = formData.getAll(
        "company.serviceOfferings"
      ) as string[];
      if (serviceOfferings && serviceOfferings.length > 0) {
        companyData.serviceOfferings = serviceOfferings;
      }

      // Add industries if available
      const industries = formData.getAll("company.industries") as string[];
      if (industries && industries.length > 0) {
        companyData.industries = industries;
      }

      // Add years in business if available
      const yearsInBusiness = formData.get("company.yearsInBusiness") as string;
      if (yearsInBusiness) {
        companyData.yearsInBusiness = parseInt(yearsInBusiness, 10);
      }

      // Queue company logo and banner for async upload
      const companyLogo = formData.get("company.logo") as File;
      const companyBanner = formData.get("company.banner") as File;

      try {
        // Create the company document first (without images)
        console.log("Creating company document:", companyData);
        const companyDoc = await backendClient.create(companyData);
        companyId = companyDoc._id;

        // Then reference it in the agent profile
        agentProfile.coreIdentity.companyId = {
          _type: "reference",
          _ref: companyDoc._id,
        };

        // Queue company logo for async upload if provided
        if (companyLogo && companyLogo.size > 0) {
          imagesToUpload.push({
            type: "object",
            file: companyLogo,
            path: "logo",
            documentId: companyDoc._id,
          });
        }

        // Queue company banner for async upload if provided
        if (companyBanner && companyBanner.size > 0) {
          imagesToUpload.push({
            type: "object",
            file: companyBanner,
            path: "banner",
            documentId: companyDoc._id,
          });
        }
      } catch (error) {
        console.error("Error creating company document:", error);
      }
    }

    // Add automation expertise
    const skills = formData.getAll("skills") as string[];
    const expertiseLevel = formData.get("expertiseLevel") as string;
    const automationTools = formData.getAll("automationTools") as string[];
    const yearsOfExperience = formData.get("yearsOfExperience") as string;
    const industries = formData.getAll("industries") as string[];

    agentProfile.automationExpertise = {
      _type: "automationExpertise",
      automationServices: skills,
      toolsExpertise: automationTools,
    };

    // Add business details
    agentProfile.businessDetails = {
      _type: "agentBusinessDetails",
      pricingModel: formData.get("pricingModel") as string,
      availability: formData.get("availability") as string,
    };

    // Log the pricing model value to debug
    console.log("Pricing Model Value:", formData.get("pricingModel"));

    // Add project size preferences if provided
    const projectSizePreference = formData.getAll(
      "projectSizePreference"
    ) as string[];
    if (projectSizePreference && projectSizePreference.length > 0) {
      agentProfile.businessDetails.projectSizePreferences =
        projectSizePreference;
    }

    // Add team size if provided
    const teamSize = formData.get("teamSize") as string;
    if (teamSize) {
      agentProfile.businessDetails.teamSize = teamSize;
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
          const imageKey = `projectImages[${i}][${j}]`;
          const image = formData.get(imageKey) as File;
          if (image && image.size > 0) {
            projectImageFiles.push(image);
          }
        }

        // Create a proper agent project document (without images initially)
        const agentProjectData: {
          _type: string;
          title: string;
          description: string;
          projectLink: string;
          technologies: string[];
          status: string;
          isPortfolioProject: boolean;
          createdAt: string;
          updatedAt: string;
        } = {
          _type: "agentProject",
          title: project.title,
          description: project.description,
          projectLink: project.projectLink || "",
          technologies: project.technologies || [],
          status: "completed", // Default status
          isPortfolioProject: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Create the agent project document
        try {
          const projectDoc = await backendClient.create(agentProjectData);
          console.log(`Created project document: ${projectDoc._id}`);

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
