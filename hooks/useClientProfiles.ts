"use client";

import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import { useUser as useClerkUser } from "@clerk/nextjs";
import {
  INDUSTRY_DOMAINS,
  COMPANY_SIZES,
  CLIENT_AUTOMATION_NEEDS,
  CLIENT_CURRENT_TOOLS,
  TIMELINE_OPTIONS,
  PROJECT_COMPLEXITY,
  ENGAGEMENT_TYPES,
  TEAM_SIZES,
  EXPERIENCE_LEVELS,
  PRIORITY_LEVELS,
  LANGUAGE_OPTIONS,
  UPDATE_FREQUENCIES,
  MEETING_AVAILABILITIES,
  BUDGET_RANGES,
} from "@/sanity/schemaTypes/constants";
import { availabilityOptions } from "@/app/onboarding/constants/agent-options";

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

export interface ClientWithProfile {
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
      size?: string;
    };
  };
  clientProfile: {
    automationNeeds: {
      automationRequirements: string[];
      currentTools: string[];
      businessDomain?: string;
      painPoints?: string[];
    };
    communicationPreferences: {
      languagesSpoken: string[];
      timeZone: string;
      updateFrequency: string;
      meetingAvailability: string;
    };
    projectPreferences: {
      budgetRange?: string;
      timeline?: string;
      projectComplexity?: string;
      engagementType?: string;
      teamSize?: string;
      experienceLevel?: string;
    };
    mustHaveRequirements?: {
      industryDomain: string[];
    };
    activeProjects?: Array<{
      _id: string;
      title: string;
      description: string;
      status: string;
      priority: string;
      startDate: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}

interface ClientProfilesResponse {
  data: ClientWithProfile[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseClientProfilesOptions {
  filters?: Record<string, any>;
  search?: string;
  sort?: { field: string; order: "asc" | "desc" };
}

export function useClientProfiles(
  options: UseClientProfilesOptions = {}
): ClientProfilesResponse {
  const { user } = useClerkUser();
  const { filters = {}, search = "", sort } = options;
  const [state, setState] = useState<Omit<ClientProfilesResponse, "refetch">>({
    data: [],
    loading: true,
    error: null,
  });

  const buildFilteredQuery = () => {
    let baseQuery = `*[_type == "user" && references(*[_type == "clientProfile"]._id)`;
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

    // Add filter conditions based on the clientProfile data
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      switch (key) {
        case "availability":
          if (value) {
            // For clients, we might check if they have active projects
            filterConditions.push(
              `count(*[_type == "project" && references(^._id) && status == "active"]) > 0`
            );
          }
          break;
        case "industry":
          if (Array.isArray(value) && value.length > 0) {
            const industryConditions = value
              .map(
                (v) =>
                  `"${v}" in *[_type == "clientProfile" && references(^._id)][0].mustHaveRequirements.industryDomain`
              )
              .join(" || ");
            filterConditions.push(`(${industryConditions})`);
          }
          break;
        case "automationNeeds":
          if (Array.isArray(value) && value.length > 0) {
            const needsConditions = value
              .map(
                (v) =>
                  `"${v}" in *[_type == "clientProfile" && references(^._id)][0].automationNeeds.automationRequirements`
              )
              .join(" || ");
            filterConditions.push(`(${needsConditions})`);
          }
          break;
        case "tools":
          if (Array.isArray(value) && value.length > 0) {
            const toolsConditions = value
              .map(
                (v) =>
                  `"${v}" in *[_type == "clientProfile" && references(^._id)][0].automationNeeds.currentTools`
              )
              .join(" || ");
            filterConditions.push(`(${toolsConditions})`);
          }
          break;
        case "budgetRange":
          if (Array.isArray(value) && value.length > 0) {
            const budgetConditions = value
              .map(
                (v) =>
                  `*[_type == "clientProfile" && references(^._id)][0].projectPreferences.budgetRange == "${v}"`
              )
              .join(" || ");
            filterConditions.push(`(${budgetConditions})`);
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
              "industry": coalesce(companies[0]->industry, "other"),
              "size": coalesce(companies[0]->size, "solo")
            },
            null
          )
        },
        "clientProfile": *[_type == "clientProfile" && references(^._id)][0] {
          "automationNeeds": {
            "automationRequirements": coalesce(automationNeeds.automationRequirements, []),
            "currentTools": coalesce(automationNeeds.currentTools, []),
            "businessDomain": coalesce(automationNeeds.businessDomain, "other"),
            "painPoints": coalesce(automationNeeds.painPoints, [])
          },
          "communicationPreferences": {
            "languagesSpoken": coalesce(communicationPreferences.languagesSpoken, ["english"]),
            "timeZone": coalesce(communicationPreferences.timeZone, "UTC"),
            "updateFrequency": coalesce(communicationPreferences.updateFrequency, "asNeeded"),
            "meetingAvailability": coalesce(communicationPreferences.meetingAvailability, "flexible")
          },
          "projectPreferences": {
            "budgetRange": coalesce(projectPreferences.budgetRange, "micro"),
            "timeline": coalesce(projectPreferences.timeline, "flexible"),
            "projectComplexity": coalesce(projectPreferences.projectComplexity, "simple"),
            "engagementType": coalesce(projectPreferences.engagementType, "oneTime"),
            "teamSize": coalesce(projectPreferences.teamSize, "solo"),
            "experienceLevel": coalesce(projectPreferences.experienceLevel, "none")
          },
          "mustHaveRequirements": {
            "industryDomain": coalesce(mustHaveRequirements.industryDomain, [])
          },
          "activeProjects": *[_type == "project" && references(^._id) && status == "active"]| order(startDate desc) {
            _id,
            title,
            description,
            status,
            priority,
            startDate,
            createdAt,
            updatedAt
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
      const transformedData = (result || []).map(
        (client: ClientWithProfile) => ({
          ...client,
          clientProfile: {
            ...client.clientProfile,
            automationNeeds: {
              ...client.clientProfile.automationNeeds,
              automationRequirements: (
                client.clientProfile?.automationNeeds?.automationRequirements ||
                []
              ).map((requirement: string) =>
                getTitleByValue(CLIENT_AUTOMATION_NEEDS, requirement)
              ),
              currentTools: (
                client.clientProfile?.automationNeeds?.currentTools || []
              ).map((tool: string) =>
                getTitleByValue(CLIENT_CURRENT_TOOLS, tool)
              ),
              businessDomain: getTitleByValue(
                INDUSTRY_DOMAINS,
                client.clientProfile?.automationNeeds?.businessDomain || "other"
              ),
            },
            projectPreferences: {
              ...client.clientProfile.projectPreferences,
              budgetRange: getTitleByValue(
                BUDGET_RANGES,
                client.clientProfile?.projectPreferences?.budgetRange || "micro"
              ),
              timeline: getTitleByValue(
                TIMELINE_OPTIONS,
                client.clientProfile?.projectPreferences?.timeline || "flexible"
              ),
              projectComplexity: getTitleByValue(
                PROJECT_COMPLEXITY,
                client.clientProfile?.projectPreferences?.projectComplexity ||
                  "simple"
              ),
              engagementType: getTitleByValue(
                ENGAGEMENT_TYPES,
                client.clientProfile?.projectPreferences?.engagementType ||
                  "oneTime"
              ),
              teamSize: getTitleByValue(
                TEAM_SIZES,
                client.clientProfile?.projectPreferences?.teamSize || "solo"
              ),
              experienceLevel: getTitleByValue(
                EXPERIENCE_LEVELS,
                client.clientProfile?.projectPreferences?.experienceLevel ||
                  "none"
              ),
            },
            communicationPreferences: {
              ...client.clientProfile.communicationPreferences,
              languagesSpoken: (
                client.clientProfile?.communicationPreferences
                  ?.languagesSpoken || ["english"]
              ).map((language: string) =>
                getTitleByValue(LANGUAGE_OPTIONS, language)
              ),
              updateFrequency: getTitleByValue(
                UPDATE_FREQUENCIES,
                client.clientProfile?.communicationPreferences
                  ?.updateFrequency || "asNeeded"
              ),
              meetingAvailability: getTitleByValue(
                MEETING_AVAILABILITIES,
                client.clientProfile?.communicationPreferences
                  ?.meetingAvailability || "flexible"
              ),
            },
            mustHaveRequirements: {
              industryDomain: (
                client.clientProfile?.mustHaveRequirements?.industryDomain || []
              ).map((industry: string) =>
                getTitleByValue(INDUSTRY_DOMAINS, industry)
              ),
            },
          },
          userProfile: {
            ...client.userProfile,
            companyDetails: client.userProfile.companyDetails
              ? {
                  ...client.userProfile.companyDetails,
                  industry: getTitleByValue(
                    INDUSTRY_DOMAINS,
                    client.userProfile.companyDetails.industry || "other"
                  ),
                  size: getTitleByValue(
                    COMPANY_SIZES,
                    client.userProfile.companyDetails.size || "solo"
                  ),
                }
              : undefined,
          },
        })
      );

      setState({
        data: transformedData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching client profiles:", error);
      setState({
        data: [],
        loading: false,
        error: error as Error,
      });
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters, search, sort]); // Add dependencies to useEffect

  return {
    ...state,
    refetch: fetchProfiles,
  };
}
