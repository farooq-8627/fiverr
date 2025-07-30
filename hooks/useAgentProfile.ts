"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export interface AgentProject {
  _id: string;
  title: string;
  description: string;
  projectLink?: string;
  technologies: string[];
  images?: Array<{
    image: {
      asset: {
        url: string;
      };
    };
    alt: string;
  }>;
  status: string;
  isPortfolioProject: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentProfileData {
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
  automationExpertise?: {
    automationServices: string[];
    toolsExpertise: string[];
  };
  projects?: AgentProject[];
  businessDetails?: {
    pricingModel: string;
    projectSizePreferences?: string[];
    teamSize?: string;
    availability: string;
    workType: string;
  };
  availability?: {
    availabilityStatus: string;
    workingHoursPreference?: string;
    availabilityHours?: string;
    timeZone?: string;
    responseTimeCommitment?: string;
  };
  pricing?: {
    hourlyRateRange?: string;
    minimumProjectBudget?: string;
    preferredPaymentMethods?: string[];
  };
  communicationPreferences?: {
    preferredContactMethod?: string;
    languagesSpoken?: Array<{
      language: string;
      proficiency: string;
    }>;
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

export function useAgentProfile(profileId?: string, userId?: string) {
  const [profile, setProfile] = useState<AgentProfileData | null>(null);
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
          ? `*[_type == "agentProfile" && profileId.current == $id][0]`
          : `*[_type == "agentProfile" && userId._ref == $id][0]`;

        const params = { id: profileId || `user-${userId}` };

        // Fetch agent profile with all linked data
        const agentProfile = await client.fetch<AgentProfileData | null>(
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
            automationExpertise {
              automationServices,
              toolsExpertise
            },
            "projects": projects[]-> {
              _id,
              title,
              description,
              projectLink,
              technologies,
              images[] {
                image {
                  asset-> {
                    url
                  }
                },
                alt
              },
              status,
              isPortfolioProject,
              createdAt,
              updatedAt
            },
            businessDetails {
              pricingModel,
              projectSizePreferences,
              teamSize,
              availability,
              workType
            },
            availability {
              availabilityStatus,
              workingHoursPreference,
              availabilityHours,
              timeZone,
              responseTimeCommitment
            },
            pricing {
              hourlyRateRange,
              minimumProjectBudget,
              preferredPaymentMethods
            },
            communicationPreferences {
              preferredContactMethod,
              languagesSpoken
            },
            mustHaveRequirements,
            createdAt,
            updatedAt
          }`,
          params
        );

        setProfile(agentProfile);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch agent profile")
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
