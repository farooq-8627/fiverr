import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  updateUserProfile,
  UserProfileUpdateData,
} from "@/lib/user-profile-utils";
import { client } from "@/sanity/lib/client";

// Handle profile update requests
export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to update your profile",
        },
        { status: 401 }
      );
    }

    const data: UserProfileUpdateData = await request.json();

    // Find the Sanity user document ID using Clerk ID
    const sanityUserQuery = `*[_type == "user" && clerkId == $clerkId][0]._id`;
    const sanityUserId = await client.fetch(sanityUserQuery, {
      clerkId: userId,
    });

    if (!sanityUserId) {
      return NextResponse.json(
        { error: "Not Found", message: "User profile not found" },
        { status: 404 }
      );
    }

    // Update the user profile
    const result = await updateUserProfile(sanityUserId, data);

    if (result.success) {
      return NextResponse.json({ message: "Profile updated successfully" });
    } else {
      return NextResponse.json(
        { error: "Update Failed", message: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PUT /api/user-profile:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get user profile data
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to view your profile",
        },
        { status: 401 }
      );
    }

    // Find the user in Sanity
    const userQuery = `*[_type == "user" && clerkId == $clerkId][0]{
      _id,
      personalDetails{
        username,
        email,
        phone,
        website,
        "profilePicture": profilePicture.asset->url,
        "bannerImage": bannerImage.asset->url,
        socialLinks
      },
      coreIdentity{
        fullName,
        tagline,
        bio
      },
      profileDetails{
        location,
        bio,
        yearsOfExperience,
        specialties,
        education,
        certifications,
        languages,
        extraDetailsJson
      }
    }`;

    const userProfile = await client.fetch(userQuery, { clerkId: userId });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Not Found", message: "User profile not found" },
        { status: 404 }
      );
    }

    // Parse extra details if present
    if (userProfile.profileDetails?.extraDetailsJson) {
      try {
        userProfile.profileDetails.extraDetails = JSON.parse(
          userProfile.profileDetails.extraDetailsJson
        );
      } catch (e) {
        console.error("Error parsing extraDetailsJson:", e);
        userProfile.profileDetails.extraDetails = {};
      }
    } else {
      userProfile.profileDetails = userProfile.profileDetails || {};
      userProfile.profileDetails.extraDetails = {};
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error in GET /api/user-profile:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
