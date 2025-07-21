"use client";

import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import { useUser as useClerkUser } from "@clerk/nextjs";
import {
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
  AVAILABILITY_STATUSES,
  HOURLY_RATE_RANGES,
} from "@/sanity/schemaTypes/constants";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

// Helper function to get title by value from a constant array
const getTitleByValue = (
  constants: Array<{ title: string; value: string }>,
  value: string
): string => {
  const item = constants.find((item) => item.value === value);
  return item ? item.title : value;
};

export interface AgentWithProfile {
  userProfile: {
    _id: string;
    personalDetails: {
      username?: string;
      website?: string;
      socialLinks?: Array<{ platform: string; url: string }>;
      profilePicture?: { asset: { url: string } };
      bannerImage?: { asset: { url: string } };
    };
    coreIdentity: {
      fullName?: string;
      tagline?: string;
      bio?: string;
    };
    companyDetails?: {
      name?: string;
      bio?: string;
      logo?: { asset: { url: string } };
    };
  };
  agentProfile: {
    automationExpertise: {
      automationServices: string[];
      toolsExpertise: string[];
    };
    availability: {
      currentStatus: string;
    };
    pricing: {
      hourlyRateRange: string;
    };
  };
}

interface AgentProfilesResponse {
  data: AgentWithProfile[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAgentProfiles(): AgentProfilesResponse {
  const { user } = useClerkUser();
  const [state, setState] = useState<Omit<AgentProfilesResponse, "refetch">>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchProfiles = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const query = `*[_type == "user" && references(*[_type == "agentProfile"]._id)] {
        "userProfile": {
          "_id": _id,
          "personalDetails": {
            "username": personalDetails.username,
            "website": personalDetails.website,
            "socialLinks": personalDetails.socialLinks,
            "profilePicture": {
              "asset": {
                "url": personalDetails.profilePicture.asset->url
              }
            },
            "bannerImage": {
              "asset": {
                "url": personalDetails.bannerImage.asset->url
              }
            }
          },
          "coreIdentity": {
            "fullName": coreIdentity.fullName,
            "tagline": coreIdentity.tagline,
            "bio": coreIdentity.bio
          },
          "companyDetails": select(
            hasCompany && count(companies) > 0 => {
              "name": companies[0]->name,
              "bio": companies[0]->bio,
              "logo": {
                "asset": {
                  "url": companies[0]->logo.asset->url
                }
              }
            },
            null
          )
        },
        "agentProfile": *[_type == "agentProfile" && references(^._id)][0] {
          "automationExpertise": {
            "automationServices": coalesce(automationExpertise.automationServices, []),
            "toolsExpertise": coalesce(automationExpertise.toolsExpertise, [])
          },
          "availability": {
            "currentStatus": coalesce(availability.currentStatus, "unavailable")
          },
          "pricing": {
            "hourlyRateRange": coalesce(pricing.hourlyRateRange, "under25")
          }
        }
      }`;

      const result = await client.fetch(query);

      // Transform the values to titles
      const transformedData = (result || []).map((agent: AgentWithProfile) => ({
        ...agent,
        agentProfile: {
          ...agent.agentProfile,
          automationExpertise: {
            automationServices: (
              agent.agentProfile?.automationExpertise?.automationServices || []
            ).map((service) =>
              getTitleByValue(AGENT_AUTOMATION_SERVICES, service)
            ),
            toolsExpertise: (
              agent.agentProfile?.automationExpertise?.toolsExpertise || []
            ).map((tool) => getTitleByValue(AGENT_TOOLS_EXPERTISE, tool)),
          },
          availability: {
            currentStatus: getTitleByValue(
              AVAILABILITY_STATUSES,
              agent.agentProfile?.availability?.currentStatus || "unavailable"
            ),
          },
          pricing: {
            hourlyRateRange: getTitleByValue(
              HOURLY_RATE_RANGES,
              agent.agentProfile?.pricing?.hourlyRateRange || "under25"
            ),
          },
        },
      }));

      setState({
        data: transformedData,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch profiles"),
      });
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    ...state,
    refetch: fetchProfiles,
  };
}
