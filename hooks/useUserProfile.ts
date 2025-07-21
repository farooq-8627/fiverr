"use client";

import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export interface UserProfile {
  _id: string;
  clerkId: string;
  personalDetails: {
    email: string;
    username: string;
    phone?: string;
    website?: string;
    profilePicture?: {
      asset: {
        url: string;
      };
    };
    bannerImage?: {
      asset: {
        url: string;
      };
    };
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
  coreIdentity: {
    fullName: string;
    bio?: string;
    tagline?: string;
  };
}

export function useUserProfile(username: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!username) {
        setIsLoading(false);
        return;
      }

      try {
        const query = `*[_type == "user" && personalDetails.username == $username][0]{
          _id,
          clerkId,
          personalDetails {
            email,
            username,
            phone,
            website,
            profilePicture {
              asset-> {
                url
              }
            },
            bannerImage {
              asset-> {
                url
              }
            },
            socialLinks[] {
              platform,
              url
            }
          },
          coreIdentity {
            fullName,
            bio,
            tagline
          }
        }`;

        const result = await client.fetch(query, { username });

        if (result) {
          setProfile(result);
          setError(null);
        } else {
          setError("Profile not found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  return { profile, isLoading, error };
}
