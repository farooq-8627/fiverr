"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import { useUser } from "@clerk/nextjs";

// Define the types based on the Sanity schema
export interface SocialLink {
  platform: string;
  url: string;
}

export interface PersonalDetails {
  email: string;
  phone: string;
  username: string;
  website?: string;
  socialLinks?: SocialLink[];
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
}

export interface CoreIdentity {
  fullName: string;
  hasCompany: boolean;
  companyId?: string;
  logo?: {
    asset: {
      url: string;
    };
  };
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
}

export interface AutomationExpertise {
  automationServices: string[];
  toolsExpertise: string[];
}

export interface BusinessDetails {
  pricingModel: string;
  projectSizePreferences: string[];
  teamSize: string;
  availability: string;
}

export interface AgentAvailability {
  availabilityStatus: string;
  workingHoursPreference: string;
  availabilityHours: string;
  timeZone: string;
  responseTimeCommitment: string;
}

export interface AgentPricing {
  hourlyRateRange: string;
  minimumProjectBudget: string;
  preferredPaymentMethods: string[];
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface CommunicationPreferences {
  preferredContactMethod: string;
  languagesSpoken: Language[];
  updateFrequency?: string;
  meetingAvailability?: string;
}

// Updated Project interfaces to match your requirements
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
}

export interface AgentProject {
  _id: string;
  title: string;
  description: string;
  projectLink: string;
  technologies: string[];
  images: {
    image: {
      asset: {
        url: string;
      };
    };
    alt: string;
  }[];
  clientReference?: {
    _id: string;
    personalDetails: {
      username: string;
    };
  };
  testimonial?: string;
  completionDate: string;
  status: string;
  isPortfolioProject: boolean;
}

export interface AgentProfile {
  _id: string;
  profileId: string;
  userId: string;
  personalDetails: PersonalDetails;
  coreIdentity: CoreIdentity;
  automationExpertise?: AutomationExpertise;
  projects?: AgentProject[];
  businessDetails?: BusinessDetails;
  availability?: AgentAvailability;
  pricing?: AgentPricing;
  communicationPreferences?: CommunicationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationNeeds {
  automationRequirements: string[];
  currentTools: string[];
}

export interface MustHaveRequirements {
  dealBreakers: string[];
  industryDomain: string[];
  customIndustry?: string[];
}

export interface ClientProfile {
  _id: string;
  profileId: string;
  userId: string;
  personalDetails: PersonalDetails;
  coreIdentity: CoreIdentity;
  automationNeeds?: AutomationNeeds;
  projects?: ClientProject[];
  communicationPreferences?: CommunicationPreferences;
  mustHaveRequirements?: MustHaveRequirements;
  createdAt: string;
  updatedAt: string;
}

export type UserProfile = AgentProfile | ClientProfile;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export function useUserProfile(username: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  useEffect(() => {
    async function fetchProfile() {
      if (!username) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First try to find an agent profile
        const agentProfile = await client.fetch<AgentProfile | null>(
          `
          *[_type == "agentProfile" && personalDetails.username == $username][0] {
            _id,
            profileId,
            userId,
            personalDetails {
              email,
              phone,
              username,
              website,
              socialLinks,
              profilePicture {
                asset-> {
                  url
                }
              },
              bannerImage {
                asset-> {
                  url
                }
              }
            },
            coreIdentity,
            automationExpertise,
            projects[]-> {
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
              clientReference-> {
                _id,
                personalDetails {
                  username
                }
              },
              testimonial,
              completionDate,
              status,
              isPortfolioProject
            },
            businessDetails,
            availability,
            pricing,
            communicationPreferences,
            createdAt,
            updatedAt
          }
        `,
          { username }
        );

        if (agentProfile) {
          setProfile(agentProfile);
          setIsLoading(false);
          return;
        }

        // If no agent profile found, try to find a client profile
        const clientProfile = await client.fetch<ClientProfile | null>(
          `
          *[_type == "clientProfile" && personalDetails.username == $username][0] {
            _id,
            profileId,
            userId,
            personalDetails {
              email,
              phone,
              username,
              website,
              socialLinks,
              profilePicture {
                asset-> {
                  url
                }
              },
              bannerImage {
                asset-> {
                  url
                }
              }
            },
            coreIdentity,
            automationNeeds,
            projects[]-> {
              _id,
              title,
              description,
              automationTool,
              businessDomain,
              technology,
              painPoints,
              budgetRange,
              timeline,
              complexity as projectComplexity,
              engagementType,
              teamSize,
              experienceLevel,
              priority,
              startDate,
              status
            },
            communicationPreferences,
            mustHaveRequirements,
            createdAt,
            updatedAt
          }
        `,
          { username }
        );

        if (clientProfile) {
          setProfile(clientProfile);
        } else {
          setError(new Error("Profile not found"));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch profile")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  // Helper function to determine if the profile is an agent profile
  const isAgentProfile = (
    profile: UserProfile | null
  ): profile is AgentProfile => {
    return profile ? "automationExpertise" in profile : false;
  };

  // Helper function to determine if the profile is a client profile
  const isClientProfile = (
    profile: UserProfile | null
  ): profile is ClientProfile => {
    return profile ? "automationNeeds" in profile : false;
  };

  // Helper function to determine if this is the user's own profile
  const isOwnProfile = user?.username === username;

  return {
    profile,
    isLoading,
    error,
    isAgentProfile,
    isClientProfile,
    isOwnProfile,
  };
}
