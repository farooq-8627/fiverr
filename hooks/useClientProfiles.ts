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

export function useClientProfiles(): ClientProfilesResponse {
  const { user } = useClerkUser();
  const [state, setState] = useState<Omit<ClientProfilesResponse, "refetch">>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchProfiles = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const query = `*[_type == "user" && references(*[_type == "clientProfile"]._id)] {
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
      }`;

      const result = await client.fetch(query);

      // Transform the values to titles
      const transformedData = (result || []).map(
        (client: ClientWithProfile) => ({
          ...client,
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
          clientProfile: {
            ...client.clientProfile,
            automationNeeds: {
              ...client.clientProfile?.automationNeeds,
              automationRequirements: (
                client.clientProfile?.automationNeeds?.automationRequirements ||
                []
              ).map((req) => getTitleByValue(CLIENT_AUTOMATION_NEEDS, req)),
              currentTools: (
                client.clientProfile?.automationNeeds?.currentTools || []
              ).map((tool) => getTitleByValue(CLIENT_CURRENT_TOOLS, tool)),
              businessDomain: getTitleByValue(
                INDUSTRY_DOMAINS,
                client.clientProfile?.automationNeeds?.businessDomain || "other"
              ),
            },
            communicationPreferences: {
              ...client.clientProfile?.communicationPreferences,
              languagesSpoken: (
                client.clientProfile?.communicationPreferences
                  ?.languagesSpoken || ["english"]
              ).map((lang) => getTitleByValue(LANGUAGE_OPTIONS, lang)),
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
            projectPreferences: {
              ...client.clientProfile?.projectPreferences,
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
            availabilityOptions: availabilityOptions,
            activeProjects:
              client.clientProfile?.activeProjects?.map((project) => ({
                ...project,
                priority: getTitleByValue(PRIORITY_LEVELS, project.priority),
              })) || [],
          },
        })
      );

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
