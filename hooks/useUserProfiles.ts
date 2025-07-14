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

export interface UserProfiles {
  agentProfiles: Array<{
    _id: string;
    profileId: {
      current: string;
    };
    automationExpertise: {
      automationServices: string[];
      toolsExpertise: string[];
    };
    businessDetails: {
      pricingModel: string;
      availability: string;
      workType: string;
      projectSizePreferences?: string[];
      teamSize?: string;
    };
    projects?: Array<{
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
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  clientProfiles: Array<{
    _id: string;
    profileId: {
      current: string;
    };
    automationNeeds: {
      businessDomain: string;
      painPoints: string[];
      automationGoals: string[];
      toolPreferences?: string[];
    };
    communicationPreferences: {
      preferredLanguages: string[];
      timezone: string;
      availabilityHours?: {
        start: string;
        end: string;
        timeZone: string;
      };
    };
    projects?: Array<{
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
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  loading: boolean;
  error: string | null;
}

export function useUserProfiles(): UserProfiles {
  const { user } = useClerkUser();
  const [profiles, setProfiles] = useState<UserProfiles>({
    agentProfiles: [],
    clientProfiles: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchProfiles() {
      if (!user?.id) {
        setProfiles((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        // Fetch user document with expanded agent and client profiles
        const query = `*[_type == "user" && clerkId == $userId][0]{
          "agentProfiles": agentProfiles[]-> {
            _id,
            profileId,
            automationExpertise {
              automationServices,
              toolsExpertise
            },
            businessDetails {
              pricingModel,
              availability,
              workType,
              projectSizePreferences,
              teamSize
            },
            "projects": *[_type == "agentProject" && references(^._id)] {
              _id,
              title,
              description,
              projectLink,
              technologies,
              "images": images[] {
                "image": {
                  "asset": {
                    "url": asset->url
                  }
                },
                alt
              },
              status,
              isPortfolioProject,
              createdAt,
              updatedAt
            },
            createdAt,
            updatedAt
          },
          "clientProfiles": clientProfiles[]-> {
            _id,
            profileId,
            automationNeeds {
              businessDomain,
              painPoints,
              automationGoals,
              toolPreferences
            },
            communicationPreferences {
              preferredLanguages,
              timezone,
              availabilityHours
            },
            "projects": *[_type == "clientProject" && references(^._id)] {
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
            createdAt,
            updatedAt
          }
        }`;

        const result = await client.fetch(query, { userId: user.id });

        if (result) {
          setProfiles({
            agentProfiles: result.agentProfiles || [],
            clientProfiles: result.clientProfiles || [],
            loading: false,
            error: null,
          });
        } else {
          setProfiles({
            agentProfiles: [],
            clientProfiles: [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
        setProfiles((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch user profiles",
        }));
      }
    }

    fetchProfiles();
  }, [user?.id]);

  return profiles;
}
