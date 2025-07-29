import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Social link type
interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

// Location type from userProfileDetails
interface Location {
  cityState?: string;
  country?: string;
}

// Company reference type
interface CompanyReference {
  _ref: string;
  _type: "reference";
}

// Profile reference type
interface ProfileReference {
  _ref: string;
  _type: "reference";
}

export interface User {
  _id: string;
  _type: "user";
  clerkId: string;

  // Personal Details
  personalDetails: {
    email: string;
    username: string;
    phone?: string;
    website?: string;
    profilePicture?: SanityImageSource;
    bannerImage?: SanityImageSource;
    socialLinks?: SocialLink[];
  };

  // Core Identity
  coreIdentity: {
    fullName: string;
    bio?: string;
    tagline?: string;
  };

  // Profile Details
  profileDetails?: {
    location?: Location;
  };

  // Company Details
  hasCompany: boolean;
  companies?: CompanyReference[];

  // Profile References
  agentProfiles?: ProfileReference[];
  clientProfiles?: ProfileReference[];
  posts?: ProfileReference[];

  // System Fields
  createdAt: string;
  updatedAt?: string;
}
