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
      automationRequirements: string[];
      currentTools: string[];
    };
    communicationPreferences: {
      languagesSpoken: string[];
      timeZone: string;
      updateFrequency: string;
      meetingAvailability: string;
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
  refetch: () => Promise<void>;
}

export function useUserProfiles(): UserProfiles {
  const { user } = useClerkUser();
  const [profiles, setProfiles] = useState<Omit<UserProfiles, "refetch">>({
    agentProfiles: [],
    clientProfiles: [],
    loading: true,
    error: null,
  });

  const fetchProfiles = async () => {
    if (!user?.id) {
      setProfiles((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setProfiles((prev) => ({ ...prev, loading: true }));

      // Fetch user document with expanded agent and client profiles
      const query = `*[_type == "user" && clerkId == $userId][0]{
        "agentProfiles": agentProfiles[]-> {
          _id,
          profileId,
          userId,
          automationExpertise {
            automationServices,
            toolsExpertise
          },
          businessDetails {
            _type,
            pricingModel,
            availability,
            workType,
            projectSizePreferences,
            teamSize
          },
          projects[]-> {
            _id,
            title,
            description,
            projectLink,
            technologies,
            "images": images[] {
              "image": {
                "asset": {
                  "url": image.asset->url
                }
              },
              alt
            },
            status,
            isPortfolioProject,
            clientReference,
            testimonial,
            completionDate,
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
            automationRequirements,
            currentTools,
          },
          communicationPreferences {
            languagesSpoken,
            preferredContactMethod,
            updateFrequency,
            meetingAvailability
          },
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

      console.log("Query for UserProfiles Result:", result);

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
      setProfiles((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch profiles",
      }));
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user?.id]);

  return {
    ...profiles,
    refetch: fetchProfiles,
  };
}
