"use client";

import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import { useUser as useClerkUser } from "@clerk/nextjs";
import {
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
  AVAILABILITY_STATUSES,
  HOURLY_RATE_RANGES,
  INDUSTRY_DOMAINS,
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
    clerkId: string;
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
      industry?: string;
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
    mustHaveRequirements?: {
      industryDomain: string[];
    };
  };
}

interface AgentProfilesResponse {
  data: AgentWithProfile[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseAgentProfilesOptions {
  filters?: Record<string, any>;
  search?: string;
  sort?: { field: string; order: "asc" | "desc" };
}

export function useAgentProfiles(
  options: UseAgentProfilesOptions = {}
): AgentProfilesResponse {
  const { user } = useClerkUser();
  const { filters = {}, search = "", sort } = options;
  const [state, setState] = useState<Omit<AgentProfilesResponse, "refetch">>({
    data: [],
    loading: true,
    error: null,
  });

  const buildFilteredQuery = () => {
    let baseQuery = `*[_type == "user" && references(*[_type == "agentProfile"]._id)`;
    const filterConditions: string[] = [];

    // Add search condition
    if (search) {
      filterConditions.push(`(
        coreIdentity.fullName match "*${search}*" ||
        coreIdentity.tagline match "*${search}*" ||
        coreIdentity.bio match "*${search}*" ||
        personalDetails.username match "*${search}*"
      )`);
    }

    // Add filter conditions based on the agentProfile data
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      switch (key) {
        case "availability":
          if (value) {
            filterConditions.push(
              `*[_type == "agentProfile" && references(^._id)][0].availability.currentStatus == "available"`
            );
          }
          break;
        case "industry":
          if (Array.isArray(value) && value.length > 0) {
            const industryConditions = value
              .map(
                (v) =>
                  `"${v}" in *[_type == "agentProfile" && references(^._id)][0].mustHaveRequirements.industryDomain`
              )
              .join(" || ");
            filterConditions.push(`(${industryConditions})`);
          }
          break;
        case "automationServices":
          if (Array.isArray(value) && value.length > 0) {
            const serviceConditions = value
              .map(
                (v) =>
                  `"${v}" in *[_type == "agentProfile" && references(^._id)][0].automationExpertise.automationServices`
              )
              .join(" || ");
            filterConditions.push(`(${serviceConditions})`);
          }
          break;
        case "toolsExpertise":
          if (Array.isArray(value) && value.length > 0) {
            const toolConditions = value
              .map(
                (v) =>
                  `"${v}" in *[_type == "agentProfile" && references(^._id)][0].automationExpertise.toolsExpertise`
              )
              .join(" || ");
            filterConditions.push(`(${toolConditions})`);
          }
          break;
        case "hourlyRate":
          if (Array.isArray(value)) {
            const [min, max] = value;
            const rateRanges = [];

            // Map hourly rate ranges to their values based on the constants
            if (min <= 25) rateRanges.push('"under25"');
            if (min <= 25 && max >= 25) rateRanges.push('"25to50"');
            if (min <= 50 && max >= 50) rateRanges.push('"50to100"');
            if (max >= 100) rateRanges.push('"over100"');

            if (rateRanges.length > 0) {
              const rateCondition = rateRanges
                .map(
                  (range) =>
                    `*[_type == "agentProfile" && references(^._id)][0].pricing.hourlyRateRange == ${range}`
                )
                .join(" || ");
              filterConditions.push(`(${rateCondition})`);
            }
          }
          break;
      }
    });

    // Add filter conditions to base query
    if (filterConditions.length > 0) {
      baseQuery += ` && (${filterConditions.join(" && ")})`;
    }

    baseQuery += `]`;

    // Add sorting
    if (sort) {
      baseQuery += ` | order(${sort.field} ${sort.order})`;
    }

    return (
      baseQuery +
      ` {
        "userProfile": {
          "_id": _id,
          "clerkId": clerkId,
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
              },
              "industry": coalesce(companies[0]->industry, "other")
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
          },
          "mustHaveRequirements": {
            "industryDomain": coalesce(mustHaveRequirements.industryDomain, [])
          }
        }
      }`
    );
  };

  const fetchProfiles = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const query = buildFilteredQuery();
      const result = await client.fetch(query);

      // Transform the values to titles for UI display
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
          mustHaveRequirements: {
            industryDomain: (
              agent.agentProfile?.mustHaveRequirements?.industryDomain || []
            ).map((industry: string) =>
              getTitleByValue(INDUSTRY_DOMAINS, industry)
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
      console.error("Error fetching agent profiles:", error);
      setState({
        data: [],
        loading: false,
        error: error as Error,
      });
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters, search, sort]); // Add dependencies to trigger refetch

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchProfiles,
  };
}
