"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import { clientCache, cacheKeys } from "@/lib/cache";
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
  profileDetails?: {
    location?: {
      cityState: string;
      country: string;
    };
    yearsOfExperience?: string;
    specialties?: string;
    education?: string;
    certifications?: string;
    languages?: string;
    extraDetailsJson?: string;
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
  posts?: Array<{
    _id: string;
    title: string;
    content: string;
    media: Array<{
      _key: string;
      type: string;
      file: {
        asset: {
          _ref: string;
          _type: string;
          url: string;
        };
      };
      caption: string;
      altText: string;
    }>;
    tags: string[];
    author: {
      _id: string;
      coreIdentity: {
        fullName: string;
      };
      personalDetails: {
        username: string;
        tagline?: string;
        profilePicture?: {
          asset: {
            url: string;
          };
        };
      };
      authorType: string;
    };
    likes: Array<any>;
    comments: Array<any>;
    isAchievement: boolean;
    achievementType: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export function useUser(username?: string) {
  const { user: clerkUser } = useClerkUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!clerkUser?.id && !username) {
        setIsLoading(false);
        return;
      }

      // Check cache first
      const identifier = username || clerkUser?.id;
      const cacheKey = cacheKeys.user(identifier || "");
      const cachedUser = clientCache.get(cacheKey);
      if (cachedUser) {
        setUserData(cachedUser);
        setIsLoading(false);
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Build the query based on whether we're fetching by clerkId or username
        const query = username
          ? `*[_type == "user" && personalDetails.username == $identifier][0]`
          : `*[_type == "user" && clerkId == $identifier][0]`;

        const params = { identifier };

        // Fetch user data with linked profiles and companies
        const user = await client.fetch<UserData | null>(
          `${query}{
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
            profileDetails {
              location,
              yearsOfExperience,
              specialties,
              education,
              certifications,
              languages,
              extraDetailsJson
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
            posts[]-> {
              _id,
              title,
              content,
              media[] {
                _key,
                type,
                file {
                  asset-> {
                    _ref,
                    _type,
                    url
                  }
                },
                caption,
                altText
              },
              tags,
              author-> {
                _id,
                coreIdentity {
                  fullName
                },
                personalDetails {
                  username,
                  tagline,
                  profilePicture {
                    asset-> {
                      url
                    }
                  }
                },
                authorType
              },
              likes,
              comments,
              isAchievement,
              achievementType,
              createdAt,
              updatedAt
            },
            createdAt,
            updatedAt
          }`,
          params
        );

        setUserData(user);

        // Cache the result for 5 minutes
        if (user) {
          clientCache.set(cacheKey, user, 5 * 60 * 1000);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user data")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [clerkUser?.id, username]);

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
