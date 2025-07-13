"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClinet";
import { randomUUID } from "crypto";
import { uploadImageToSanity } from "@/lib/ImageUploads";

export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// Main function to save user profile to Sanity
export async function saveUserProfile(formData: FormData): Promise<FormState> {
  console.log("Starting saveUserProfile server action");
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

    // Extract form fields
    console.log("Extracting form fields...");
    const socialLinksRaw = formData.get("socialLinks") as string;
    console.log("Raw social links from form:", socialLinksRaw);

    const personalDetails = {
      _type: "personalDetails",
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      socialLinks: JSON.parse(socialLinksRaw || "[]").map((link: any) => ({
        _key: `social_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        platform: link.platform,
        url: link.url,
      })),
    };

    console.log("Final personalDetails object:", personalDetails);

    const coreIdentity = {
      _type: "coreIdentity",
      fullName: formData.get("fullName") as string,
      bio: formData.get("bio") as string,
      tagline: formData.get("tagline") as string,
    };

    // Check if the hasCompany toggle is on
    const hasCompany = formData.get("hasCompany") === "true";

    // Only process company details if the toggle is on
    let companyId = null;
    if (hasCompany) {
      // Create company document
      const companyDoc = {
        _type: "company",
        name: formData.get("company.name") as string,
        bio: formData.get("company.bio") as string,
        website: formData.get("company.website") as string,
        tagline: formData.get("company.tagline") as string,
        teamSize: formData.get("company.teamSize") as string,
      };

      // Create the company document and get its ID
      const company = await backendClient.create(companyDoc);
      companyId = company._id;
    }

    // Create user document structure
    const userDoc = {
      _type: "user",
      _id: `user-${userId}`,
      clerkId: userId,
      personalDetails,
      coreIdentity,
      hasCompany,
      companies: hasCompany
        ? [{ _type: "reference", _ref: companyId, _key: randomUUID() }]
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Track files to upload asynchronously
    const imagePromises: Promise<void>[] = [];

    // Queue profile picture for async upload if provided
    const profilePicture = formData.get("profilePicture") as File;
    if (profilePicture?.size > 0) {
      imagePromises.push(
        (async () => {
          try {
            const imageAsset = await uploadImageToSanity(profilePicture);
            if (imageAsset) {
              await backendClient
                .patch(`user-${userId}`)
                .set({
                  "personalDetails.profilePicture": {
                    _type: "image",
                    asset: {
                      _type: "reference",
                      _ref: imageAsset._id,
                    },
                  },
                })
                .commit();
              console.log("Profile picture uploaded and linked");
            }
          } catch (error) {
            console.error("Error uploading profile picture:", error);
          }
        })()
      );
    }

    // Queue banner image for async upload if provided
    const bannerImage = formData.get("bannerImage") as File;
    if (bannerImage?.size > 0) {
      imagePromises.push(
        (async () => {
          try {
            const imageAsset = await uploadImageToSanity(bannerImage);
            if (imageAsset) {
              await backendClient
                .patch(`user-${userId}`)
                .set({
                  "personalDetails.bannerImage": {
                    _type: "image",
                    asset: {
                      _type: "reference",
                      _ref: imageAsset._id,
                    },
                  },
                })
                .commit();
              console.log("Banner image uploaded and linked");
            }
          } catch (error) {
            console.error("Error uploading banner image:", error);
          }
        })()
      );
    }

    // Queue company logo for async upload if provided
    const companyLogo = formData.get("company.logo") as File;
    if (hasCompany && companyLogo?.size > 0 && companyId) {
      imagePromises.push(
        (async () => {
          try {
            const imageAsset = await uploadImageToSanity(companyLogo);
            if (imageAsset) {
              await backendClient
                .patch(companyId)
                .set({
                  logo: {
                    _type: "image",
                    asset: {
                      _type: "reference",
                      _ref: imageAsset._id,
                    },
                  },
                })
                .commit();
              console.log("Company logo uploaded and linked");
            }
          } catch (error) {
            console.error("Error uploading company logo:", error);
          }
        })()
      );
    }

    // Company banner upload
    const companyBanner = formData.get("company.banner") as File;
    if (hasCompany && companyBanner?.size > 0 && companyId) {
      imagePromises.push(
        (async () => {
          try {
            const imageAsset = await uploadImageToSanity(companyBanner);
            if (imageAsset) {
              await backendClient
                .patch(companyId)
                .set({
                  banner: {
                    _type: "image",
                    asset: {
                      _type: "reference",
                      _ref: imageAsset._id,
                    },
                  },
                })
                .commit();
              console.log("Company banner uploaded and linked");
            }
          } catch (error) {
            console.error("Error uploading company banner:", error);
          }
        })()
      );
    }

    try {
      // Create or update the user document
      console.log("Saving user profile to Sanity...");
      await backendClient.createOrReplace(userDoc);

      // Handle image uploads asynchronously
      // const imagePromises: Promise<void>[] = []; // This line is removed as imagePromises is now declared outside

      // Start all image uploads in parallel
      if (imagePromises.length > 0) {
        console.log(
          `Starting ${imagePromises.length} image uploads in parallel`
        );
        // Don't await the image uploads - let them complete in the background
        Promise.all(imagePromises).catch((error) => {
          console.error("Error in background image processing:", error);
        });
      }

      // Revalidate cached data
      revalidatePath("/dashboard");
      revalidatePath("/profile");

      return {
        success: true,
        message:
          imagePromises.length > 0
            ? "Profile saved successfully! Images are being processed in the background."
            : "Profile saved successfully!",
      };
    } catch (error: any) {
      console.error("Error saving user profile:", error);
      return {
        success: false,
        message: `Failed to save profile: ${error.message || "Unknown error"}`,
      };
    }
  } catch (error: any) {
    console.error("Error in saveUserProfile:", error);
    return {
      success: false,
      message: `An error occurred: ${error.message || "Unknown error"}`,
    };
  }
}
