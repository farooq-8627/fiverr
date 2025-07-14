"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import { useUser as useClerkUser } from "@clerk/nextjs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export interface UserData {
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
  hasCompany: boolean;
  companies?: Array<{
    _id: string;
    name: string;
  }>;
  agentProfiles?: Array<{
    _id: string;
    profileId: {
      current: string;
    };
  }>;
  clientProfiles?: Array<{
    _id: string;
    profileId: {
      current: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export function useUser() {
  const { user: clerkUser } = useClerkUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!clerkUser?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data with linked profiles and companies
        const user = await client.fetch<UserData | null>(
          `*[_type == "user" && clerkId == $clerkId][0]{
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
              socialLinks
            },
            coreIdentity {
              fullName,
              bio,
              tagline
            },
            hasCompany,
            companies[]-> {
              _id,
              name
            },
            agentProfiles[]-> {
              _id,
              profileId
            },
            clientProfiles[]-> {
              _id,
              profileId
            },
            createdAt,
            updatedAt
          }`,
          { clerkId: clerkUser.id }
        );

        setUserData(user);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user data")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [clerkUser?.id]);

  return {
    user: userData,
    isLoading,
    error,
    hasAgentProfile:
      userData?.agentProfiles && userData.agentProfiles.length > 0,
    hasClientProfile:
      userData?.clientProfiles && userData.clientProfiles.length > 0,
  };
}
