"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClinet";
import { randomUUID } from "crypto";
import { ClientProjectSchema } from "@/types/project";
import { z } from "zod";

export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// Process project images asynchronously
async function processProjectImages(projectId: string, imageFiles: File[]) {
  const imagePromises = imageFiles.map(async (file, index) => {
    try {
      const imageAsset = await backendClient.assets.upload("image", file);
      return {
        _type: "projectImage",
        _key: `image_${index}_${Date.now()}`,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
        alt: "Project image",
        order: index,
        isFeatured: index === 0,
      };
    } catch (error) {
      console.error(`Error uploading image ${index}:`, error);
      throw error;
    }
  });

  const images = await Promise.all(imagePromises);

  // Update project with images
  await backendClient.patch(projectId).set({ images }).commit();

  return images;
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

    // Extract essential form fields
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;
    const fullName = formData.get("fullName") as string;
    const hasCompany = formData.get("hasCompany") === "true";
    const socialLinksJSON = formData.get("socialLinks") as string;
    const socialLinks = socialLinksJSON ? JSON.parse(socialLinksJSON) : [];

    // Create client profile document
    const clientProfile: any = {
      _type: "clientProfile",
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
      profileId: {
        _type: "slug",
        current: `${fullName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add automation needs and tools
    const automationNeeds = formData.getAll("automationNeeds");
    const currentTools = formData.getAll("currentTools");

    // Format the automation needs and tools according to schema
    clientProfile.automationNeeds = {
      _type: "automationNeeds",
      automationRequirements: automationNeeds,
      currentTools: currentTools,
    };

    // Create a client project document
    const projectDoc = {
      _type: "clientProject",
      _id: `project_${randomUUID()}`,
      title: formData.get("projectTitle") as string,
      slug: {
        _type: "slug",
        current: `${(formData.get("projectTitle") as string).toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      },
      description: formData.get("projectDescription") as string,
      businessDomain: formData.get("businessDomain") as string,
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

    // Validate project data
    ClientProjectSchema.parse(projectDoc);

    // Create project document
    try {
      console.log("Creating client project document:", projectDoc);
      const createdProject = await backendClient.create(projectDoc);
      console.log("Created project document:", createdProject._id);

      // Process project images if any
      const projectImages: File[] = [];
      for (let i = 0; ; i++) {
        const imageFile = formData.get(`projectImages[${i}]`) as File;
        if (!imageFile) break;
        projectImages.push(imageFile);
      }

      if (projectImages.length > 0) {
        await processProjectImages(createdProject._id, projectImages);
      }

      // Add the project reference to the client profile
      clientProfile.projects = [
        {
          _type: "reference",
          _key: `project_${Date.now()}`,
          _ref: createdProject._id,
        },
      ];
    } catch (error) {
      console.error("Error creating project document:", error);
      throw error;
    }

    // Add company details if applicable
    if (hasCompany) {
      const companyData = {
        _type: "company",
        name: formData.get("company.name") as string,
        teamSize: formData.get("company.teamSize") as string,
        bio: formData.get("company.bio") as string,
        website: formData.get("company.website") as string,
        companyType: "client",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const companyDoc = await backendClient.create(companyData);
        clientProfile.coreIdentity.companyId = {
          _type: "reference",
          _ref: companyDoc._id,
        };

        // Handle company images
        const companyLogo = formData.get("company.logo") as File;
        const companyBanner = formData.get("company.banner") as File;

        if (companyLogo?.size > 0) {
          const logoAsset = await backendClient.assets.upload(
            "image",
            companyLogo
          );
          await backendClient
            .patch(companyDoc._id)
            .set({
              logo: {
                _type: "image",
                asset: {
                  _type: "reference",
                  _ref: logoAsset._id,
                },
              },
            })
            .commit();
        }

        if (companyBanner?.size > 0) {
          const bannerAsset = await backendClient.assets.upload(
            "image",
            companyBanner
          );
          await backendClient
            .patch(companyDoc._id)
            .set({
              banner: {
                _type: "image",
                asset: {
                  _type: "reference",
                  _ref: bannerAsset._id,
                },
              },
            })
            .commit();
        }
      } catch (error) {
        console.error("Error creating company document:", error);
        throw error;
      }
    }

    // Save the main profile to Sanity
    try {
      const result = await backendClient.create(clientProfile);
      console.log("Profile saved successfully:", result._id);

      // Handle profile images
      const profilePicture = formData.get("profilePicture") as File;
      const bannerImage = formData.get("bannerImage") as File;

      if (profilePicture?.size > 0) {
        const profilePictureAsset = await backendClient.assets.upload(
          "image",
          profilePicture
        );
        await backendClient
          .patch(result._id)
          .set({
            "personalDetails.profilePicture": {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: profilePictureAsset._id,
              },
            },
          })
          .commit();
      }

      if (bannerImage?.size > 0) {
        const bannerImageAsset = await backendClient.assets.upload(
          "image",
          bannerImage
        );
        await backendClient
          .patch(result._id)
          .set({
            "personalDetails.bannerImage": {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: bannerImageAsset._id,
              },
            },
          })
          .commit();
      }

      // Revalidate cached data
      revalidatePath("/dashboard");
      revalidatePath("/profile");

      return {
        success: true,
        message: "Client profile created successfully!",
      };
    } catch (error: any) {
      console.error("Error saving client profile:", error);
      return {
        success: false,
        message: `Failed to save profile: ${error.message || "Unknown error"}`,
      };
    }
  } catch (error: any) {
    console.error("Error in saveClientProfile:", error);
    return {
      success: false,
      message: `An error occurred: ${error.message || "Unknown error"}`,
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
