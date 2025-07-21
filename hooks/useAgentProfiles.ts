import { groq } from "next-sanity";
import { useSanityQuery } from "./useSanityQuery";

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
      description?: string;
      logo?: { asset: { url: string } };
    };
  };
  agentProfile: {
    automationExpertise: {
      automationServices: string[];
    };
    availability: {
      currentStatus: string;
    };
    pricing: {
      hourlyRateRange: string;
    };
  };
}

const agentsQuery = groq`
  *[_type == "user" && references(*[_type == "agentProfile"]._id)] {
    "userProfile": {
      "_id": _id,
      "personalDetails": {
        "username": username,
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
        "automationServices": automationExpertise.automationServices
      },
      "availability": {
        "currentStatus": availability.currentStatus
      },
      "pricing": {
        "hourlyRateRange": pricing.hourlyRateRange
      }
    }
  }
`;

export function useAgentProfiles() {
  return useSanityQuery<AgentWithProfile>(agentsQuery);
}
