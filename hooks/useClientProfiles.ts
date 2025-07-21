import { groq } from "next-sanity";
import { useSanityQuery } from "./useSanityQuery";

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
      description?: string;
      logo?: { asset: { url: string } };
      teamSize?: string;
    };
  };
  clientProfile: {
    automationNeeds: {
      automationRequirements: string[];
    };
    projects?: Array<{
      title: string;
      description: string;
      businessDomain: string;
    }>;
  };
}

const clientsQuery = groq`
  *[_type == "user" && references(*[_type == "clientProfile"]._id)] {
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
          },
          "teamSize": companies[0]->teamSize
        },
        null
      )
    },
    "clientProfile": *[_type == "clientProfile" && references(^._id)][0] {
      "automationNeeds": {
        "automationRequirements": automationNeeds.automationRequirements
      },
      "projects": projects[] {
        "title": title,
        "description": description,
        "businessDomain": businessDomain
      }
    }
  }
`;

export function useClientProfiles() {
  return useSanityQuery<ClientWithProfile>(clientsQuery);
}
