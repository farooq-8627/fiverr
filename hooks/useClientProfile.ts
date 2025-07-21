"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export interface ClientProject {
  _id: string;
  title: string;
  description: string;
  automationTool: string;
  businessDomain: string;
  technology: string[];
  painPoints: string;
  budgetRange: string;
  timeline: string;
  projectComplexity: string;
  engagementType: string;
  teamSize: string;
  experienceLevel: string;
  priority: string;
  startDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfileData {
  _id: string;
  profileId: {
    current: string;
  };
  user: {
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
      bio?: string;
      tagline?: string;
    };
    companyDetails?: {
      hasCompany: boolean;
      companyId?: string;
      companyName?: string;
      companyWebsite?: string;
      companyDescription?: string;
      companyLink?: string;
      logo?: {
        asset: {
          url: string;
        };
      };
      bannerImage?: {
        asset: {
          url: string;
        };
      };
    };
  };
  automationNeeds?: {
    automationRequirements: string[];
    currentTools: string[];
  };
  projects?: ClientProject[];
  communicationPreferences?: {
    preferredContactMethod?: string;
    languagesSpoken?: Array<{
      language: string;
      proficiency: string;
    }>;
    updateFrequency?: string;
    meetingAvailability?: string;
  };
  mustHaveRequirements?: {
    experience: string;
    dealBreakers?: string[];
    industryDomain?: string[];
    customIndustry?: string[];
    requirements?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export function useClientProfile(profileId?: string, userId?: string) {
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!profileId && !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Build the query based on whether we're searching by profileId or userId
        const query = profileId
          ? `*[_type == "clientProfile" && profileId.current == $id][0]`
          : `*[_type == "clientProfile" && userId._ref == $id][0]`;

        const params = { id: profileId || `user-${userId}` };

        // Fetch client profile with all linked data
        const clientProfile = await client.fetch<ClientProfileData | null>(
          `${query}{
            _id,
            profileId,
            "user": userId-> {
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
                fullName
                bio,
                tagline
              },
              companyDetails {
                hasCompany,
                companyId,
                companyName,
                companyWebsite,
                companyDescription,
                companyLink,
                logo {
                  asset-> {
                    url
                  }
                },
                bannerImage {
                  asset-> {
                    url
                  }
                }
              }
            },
            automationNeeds {
              automationRequirements,
              currentTools
            },
            "projects": projects[]-> {
              _id,
              title,
              description,
              automationTool,
              businessDomain,
              technology,
              painPoints,
              budgetRange,
              timeline,
              projectComplexity,
              engagementType,
              teamSize,
              experienceLevel,
              priority,
              startDate,
              status,
              createdAt,
              updatedAt
            },
            communicationPreferences {
              preferredContactMethod,
              languagesSpoken,
              updateFrequency,
              meetingAvailability
            },
            mustHaveRequirements,
            createdAt,
            updatedAt
          }`,
          params
        );

        setProfile(clientProfile);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch client profile")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [profileId, userId]);

  return {
    profile,
    isLoading,
    error,
    hasProjects: profile?.projects && profile.projects.length > 0,
  };
}
