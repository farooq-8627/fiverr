"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { randomUUID } from "crypto";
import { FeedPost } from "@/types/Posts";
import { uploadImageToSanity } from "@/lib/ImageUploads";
import { client } from "@/sanity/lib/client";
import { uploadMediaToSanity, handleMediaUploads } from "@/lib/mediaUploads";
import { handleAsyncImageUploads } from "@/lib/ImageUploads";

export interface FormState {
  success: boolean;
  message: string;
  data?: {
    profileImage?: string;
    bannerImage?: string;
  };
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

// Function to update user profile details
export async function updateUserProfileDetails(formData: {
  fullName?: string;
  tagline?: string;
  website?: string;
  location?: {
    cityState: string;
    country: string;
  };
  bio?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  profileImage?: File;
  bannerImage?: File;
}): Promise<FormState> {
  try {
    // Get authenticated user ID
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }

    // Find the user document in Sanity
    const userDocId = `user-${userId}`;
    const existingUser = await backendClient.getDocument(userDocId);

    if (!existingUser) {
      return {
        success: false,
        message: "User profile not found.",
      };
    }

    console.log("Existing user document:", existingUser);
    console.log("Form data being submitted:", formData);

    // Prepare update data - only include fields that are provided
    const updateData: any = {};

    if (formData.fullName !== undefined) {
      updateData["coreIdentity.fullName"] = formData.fullName;
    }
    if (formData.tagline !== undefined) {
      updateData["coreIdentity.tagline"] = formData.tagline;
    }
    if (formData.bio !== undefined) {
      updateData["coreIdentity.bio"] = formData.bio;
    }
    if (formData.website !== undefined) {
      updateData["personalDetails.website"] = formData.website;
    }
    if (formData.socialLinks) {
      updateData["personalDetails.socialLinks"] = formData.socialLinks.map(
        (link) => ({
          _key: `social_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          platform: link.platform,
          url: link.url,
        })
      );
    }

    // Only add location if it's provided and either cityState or country has a value
    if (
      formData.location &&
      (formData.location.cityState || formData.location.country)
    ) {
      updateData["profileDetails.location"] = {
        _type: "location",
        cityState: formData.location.cityState || "",
        country: formData.location.country || "",
      };
    }

    console.log("Update data being sent to Sanity:", updateData);

    try {
      // Handle image uploads if provided
      if (formData.profileImage) {
        try {
          const profileImageAsset = await uploadImageToSanity(
            formData.profileImage
          );
          if (profileImageAsset?._id) {
            updateData["personalDetails.profilePicture"] = {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: profileImageAsset._id,
              },
            };
          }
        } catch (error) {
          console.error("Failed to upload profile image:", error);
          return {
            success: false,
            message: "Failed to upload profile image. Please try again.",
          };
        }
      }

      if (formData.bannerImage) {
        try {
          const bannerImageAsset = await uploadImageToSanity(
            formData.bannerImage
          );
          if (bannerImageAsset?._id) {
            updateData["personalDetails.bannerImage"] = {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: bannerImageAsset._id,
              },
            };
          }
        } catch (error) {
          console.error("Failed to upload banner image:", error);
          return {
            success: false,
            message: "Failed to upload banner image. Please try again.",
          };
        }
      }

      // Update the user document
      const result = await backendClient
        .patch(userDocId)
        .set(updateData)
        .commit();
      console.log("Update result from Sanity:", result);

      return {
        success: true,
        message: "Profile updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        message: `Failed to update profile: ${error.message || "Unknown error"}`,
      };
    }
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: `Failed to update profile: ${error.message || "Unknown error"}`,
    };
  }
}

export interface CreatePostData {
  title?: string;
  content: string;
  authorId: string;
  authorType: "agent" | "client";
  media?: File[];
  id?: string; // Optional ID field for the post
  tags?: string[];
  isAchievement?: boolean;
  achievementType?: string;
}

export async function createPost(data: CreatePostData) {
  try {
    // First create the post document
    const doc = await backendClient.create({
      _type: "post",
      title: data.title,
      content: data.content,
      author: {
        _type: "reference",
        _ref: data.authorId,
      },
      authorType: data.authorType,
      tags: data.tags || [],
      isAchievement: data.isAchievement || false,
      achievementType: data.achievementType,
      media: [], // Initialize empty media array
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      comments: [],
    });

    // Handle media uploads if any exist
    if (data.media && data.media.length > 0) {
      try {
        // Upload all media files and collect their references
        const mediaPromises = data.media.map(async (file) => {
          // Use uploadMediaToSanity for all file types
          const result = await uploadMediaToSanity(file);
          console.log("Media Asset Result:", result);

          if (!result) {
            throw new Error(`Failed to upload media: ${file.name}`);
          }

          // Return consistent structure for all media types
          return {
            _type: "media",
            _key: Math.random().toString(36).substr(2, 9),
            type: file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("video/")
                ? "video"
                : "pdf",
            file: {
              asset: {
                _ref: result.file.asset._ref,
                _type: "reference",
              },
              url: result.file.url,
            },
            caption: file.name,
            altText: file.name,
          };
        });

        // Wait for all uploads to complete
        const mediaAssets = await Promise.all(mediaPromises);
        console.log("Final Media Assets Array:", mediaAssets);

        // Update the document with all media assets at once
        await backendClient.patch(doc._id).set({ media: mediaAssets }).commit();
      } catch (error) {
        console.error("Error uploading media:", error);
        return {
          success: false,
          message: "Failed to upload media files",
        };
      }
    }

    // Update the user's posts array
    try {
      await backendClient
        .patch(data.authorId)
        .setIfMissing({ posts: [] })
        .append("posts", [
          {
            _type: "reference",
            _ref: doc._id,
          },
        ])
        .commit();

      // Revalidate the feed page and user profile
      revalidatePath("/dashboard/[username]");
      revalidatePath("/user-details");

      return {
        success: true,
        data: {
          ...doc,
          likes: [],
          comments: [],
        },
      };
    } catch (error) {
      console.error("Error updating user posts array:", error);
      // Even if updating user's posts array fails, the post was created successfully
      return {
        success: true,
        data: {
          ...doc,
          likes: [],
          comments: [],
        },
      };
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}
