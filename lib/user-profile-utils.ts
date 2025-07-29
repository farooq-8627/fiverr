import { client } from "@/sanity/lib/client";

export interface UserProfileUpdateData {
  fullName?: string;
  tagline?: string;
  website?: string;
  location?: string;
  bio?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  extraDetails?: {
    yearsOfExperience?: string;
    specialties?: string;
    education?: string;
    certifications?: string;
    languages?: string;
    [key: string]: any;
  };
}

export async function updateUserProfile(
  userId: string,
  data: UserProfileUpdateData
) {
  try {
    const {
      fullName,
      tagline,
      website,
      location,
      bio,
      socialLinks,
      extraDetails,
    } = data;

    // Prepare the mutation object
    const mutation: Record<string, any> = {};

    // Update core identity fields
    if (fullName) {
      mutation["coreIdentity.fullName"] = fullName;
    }
    if (tagline) {
      mutation["coreIdentity.tagline"] = tagline;
    }
    if (bio) {
      mutation["coreIdentity.bio"] = bio;
    }

    // Update personal details
    if (website) {
      mutation["personalDetails.website"] = website;
    }
    if (socialLinks && socialLinks.length > 0) {
      mutation["personalDetails.socialLinks"] = socialLinks.map((link) => ({
        _type: "socialLink",
        platform: link.platform,
        url: link.url,
      }));
    }

    // Update profile details
    if (location) {
      mutation["profileDetails.location"] = location;
    }

    // Handle extra details
    if (extraDetails) {
      Object.entries(extraDetails).forEach(([key, value]) => {
        if (value) {
          mutation[`profileDetails.${key}`] = value;
        }
      });

      // Also store the entire object as JSON for future extensibility
      mutation["profileDetails.extraDetailsJson"] =
        JSON.stringify(extraDetails);
    }

    // Update timestamp
    mutation.updatedAt = new Date().toISOString();

    // Execute the transaction
    await client
      .patch(userId)
      .set(mutation)
      .commit({ autoGenerateArrayKeys: true });

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
