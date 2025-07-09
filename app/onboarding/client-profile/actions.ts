"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClinet";

export type FormState = {
  success: boolean;
  message: string;
};

export async function saveClientProfile(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Get the authenticated user
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }

    // Create the client profile document
    const clientProfileData: {
      _type: string;
      userId: string;
      personalDetails: {
        _type: string;
        email: string;
        phone: string;
        username: string;
        website: string;
        socialLinks?: Array<{
          _type: string;
          _key: string;
          platform: string;
          url: string;
        }>;
      };
      coreIdentity: {
        _type: string;
        fullName: string;
        hasCompany: boolean;
        companyId?: {
          _type: string;
          _ref: string;
        };
      };
      automationNeeds: {
        _type: string;
        automationRequirements: string[];
        currentTools: string[];
      };
      createdAt: string;
      updatedAt: string;
    } = {
      _type: "clientProfile",
      userId,

      // Personal Details (from UI)
      personalDetails: {
        _type: "personalDetails",
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        username: formData.get("username") as string,
        website: formData.get("website") as string,
        // Only add socialLinks if they exist
        ...(formData.get("socialLinks") && {
          socialLinks: JSON.parse(formData.get("socialLinks") as string).map(
            (link: any) => ({
              _type: "socialLink",
              _key: `social_${link.platform}_${Date.now()}`,
              platform: link.platform,
              url: link.url,
            })
          ),
        }),
      },

      // Core Identity (from UI)
      coreIdentity: {
        _type: "coreIdentity",
        fullName: formData.get("fullName") as string,
        hasCompany: formData.get("hasCompany") === "true",
      },

      // Automation Needs (from UI)
      automationNeeds: {
        _type: "automationNeeds",
        automationRequirements: formData.getAll("automationNeeds").map(String),
        currentTools: formData.getAll("currentTools").map(String),
      },

      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If hasCompany is true, create the company document first
    if (formData.get("hasCompany") === "true") {
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

      // Create the company document
      const company = await backendClient.create(companyData);

      // Update the client profile data with the company reference
      clientProfileData.coreIdentity.companyId = {
        _type: "reference",
        _ref: company._id,
      };
    }

    // Create the client profile
    const clientProfile = await backendClient.create(clientProfileData);

    // Handle file uploads if present
    const filesToUpload = [];

    const profilePicture = formData.get("profilePicture") as File;
    if (profilePicture?.size > 0) {
      filesToUpload.push({
        file: profilePicture,
        field: "personalDetails.profilePicture",
        documentId: clientProfile._id,
      });
    }

    const bannerImage = formData.get("bannerImage") as File;
    if (bannerImage?.size > 0) {
      filesToUpload.push({
        file: bannerImage,
        field: "personalDetails.bannerImage",
        documentId: clientProfile._id,
      });
    }

    if (
      formData.get("hasCompany") === "true" &&
      clientProfileData.coreIdentity.companyId?._ref
    ) {
      const companyLogo = formData.get("company.logo") as File;
      if (companyLogo?.size > 0) {
        filesToUpload.push({
          file: companyLogo,
          field: "logo",
          documentId: clientProfileData.coreIdentity.companyId._ref,
        });
      }

      const companyBanner = formData.get("company.banner") as File;
      if (companyBanner?.size > 0) {
        filesToUpload.push({
          file: companyBanner,
          field: "banner",
          documentId: clientProfileData.coreIdentity.companyId._ref,
        });
      }
    }

    // Upload files and update references
    for (const { file, field, documentId } of filesToUpload) {
      try {
        const asset = await backendClient.assets.upload("image", file);
        await backendClient
          .patch(documentId)
          .set({
            [field]: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: asset._id,
              },
            },
          })
          .commit();
      } catch (error) {
        console.error(`Error uploading ${field}:`, error);
      }
    }

    // If project details are provided, create a client project
    const projectTitle = formData.get("projectTitle") as string;
    if (projectTitle) {
      const clientProjectData = {
        _type: "clientProject",
        _key: `project_${Date.now()}`,
        title: projectTitle,
        description: (formData.get("projectDescription") as string) || "",
        businessDomain: (formData.get("businessDomain") as string) || "",
        painPoints: (formData.get("painPoints") as string) || "",
        status: "draft",

        // Project scope details (all optional)
        budgetRange: (formData.get("budgetRange") as string) || undefined,
        timeline: (formData.get("timeline") as string) || undefined,
        priority: (formData.get("priority") as string) || undefined,
        complexity: (formData.get("complexity") as string) || undefined,
        engagementType: (formData.get("engagementType") as string) || undefined,
        teamSize: (formData.get("teamSizeRequired") as string) || undefined,
        experienceLevel:
          (formData.get("experienceLevel") as string) || undefined,

        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create the project
      const project = await backendClient.create(clientProjectData);

      // Link the project to the client profile
      await backendClient
        .patch(clientProfile._id)
        .setIfMissing({ projects: [] })
        .append("projects", [
          {
            _type: "reference",
            _ref: project._id,
            _key: `project_ref_${Date.now()}`,
          },
        ])
        .commit();
    }

    revalidatePath("/onboarding/client-profile");
    return {
      success: true,
      message: "Client profile saved successfully!",
    };
  } catch (error) {
    console.error("Error saving client profile:", error);
    return {
      success: false,
      message: "Failed to save client profile. Please try again.",
    };
  }
}
