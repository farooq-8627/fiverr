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

export interface UserDataLight {
  _id: string;
  clerkId: string;
  personalDetails: {
    email: string;
    username: string;
    profilePicture?: {
      asset: {
        url: string;
      };
    };
  };
  coreIdentity: {
    fullName: string;
    tagline?: string;
  };
  hasCompany: boolean;
}

// Lightweight user hook for navigation and basic display - no heavy joins
export function useUserLight(username?: string) {
  const { user: clerkUser } = useClerkUser();
  const [userData, setUserData] = useState<UserDataLight | null>(null);
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
      const cacheKey = `${cacheKeys.user(identifier || "")}_light`;
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

        // Simple query - no expensive joins
        const query = username
          ? `*[_type == "user" && personalDetails.username == $identifier][0]`
          : `*[_type == "user" && clerkId == $identifier][0]`;

        const params = { identifier };

        const user = await client.fetch<UserDataLight | null>(
          `${query}{
            _id,
            clerkId,
            personalDetails {
              email,
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            },
            coreIdentity {
              fullName,
              tagline
            },
            hasCompany
          }`,
          params
        );

        setUserData(user);

        // Cache the result for 10 minutes (longer since it's lighter)
        if (user) {
          clientCache.set(cacheKey, user, 10 * 60 * 1000);
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
  };
}
