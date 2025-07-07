// Shared profile types for both agents and clients

// Base types

// Social media link type
export interface SocialLink {
  platform: string;
  url: string;
}

// Basic personal details
export interface PersonalDetails {
  email: string;
  phone: string;
  username: string;
  website?: string;
  socialLinks?: SocialLink[];
  profilePicture?: string; // URL or reference to Sanity asset
  bannerImage?: string; // URL or reference to Sanity asset
}

// Company information
export interface CompanyDetails {
  name: string;
  teamSize: string;
  bio: string;
  website?: string;
  logo?: string; // URL or reference to Sanity asset
  banner?: string; // URL or reference to Sanity asset
}

// Core identity shared between users
export interface CoreIdentity {
  fullName: string;
  hasCompany: boolean;
  companyDetails?: CompanyDetails;
}

// Project image type
export interface ProjectImage {
  url: string;
  alt?: string;
}

// Project information
export interface Project {
  id: string;
  title: string;
  description: string;
  projectLink?: string;
  technologies: string[];
  // Fields for handling image uploads in the UI
  images: File[];
  imageUrls: string[];
  activeImageIndex: number;
  // Fields for Sanity storage
  projectType?: string;
  industry?: string;
  complexity?: string;
  duration?: string;
  outcome?: string;
  testimonial?: string;
  // For storing processed images in Sanity
  projectImages?: {
    url: string;
    alt?: string;
  }[];
}

// Agent-specific types

// Automation service categories for agents
export interface AutomationExpertise {
  automationServices: string[];
  customAutomationServices?: string[];
  toolsExpertise: string[];
  customToolsExpertise?: string[];
}

// Business details for agents
export interface AgentBusinessDetails {
  pricingModel: string;
  projectSizePreferences: string[];
  teamSize: string;
  availability: string;
}

// Client-specific types

// Automation needs for clients
export interface AutomationNeeds {
  automationRequirements: string[];
  customAutomationRequirements?: string[];
  currentTools: string[];
  customCurrentTools?: string[];
}

// Project requirements for clients
export interface ProjectRequirements {
  title: string;
  description: string;
  businessDomain: string;
  painPoints: string;
}

// Project scope details for clients
export interface ProjectScopeDetails {
  budget: string;
  timeline: string;
  startDate?: Date;
  priority: string;
}

// Complete profile types

// Agent profile - combines all agent-specific data
export interface AgentProfile {
  id: string;
  userId: string;
  personalDetails: PersonalDetails;
  coreIdentity: CoreIdentity;
  automationExpertise: AutomationExpertise;
  projects: Project[];
  businessDetails: AgentBusinessDetails;
  createdAt: Date;
  updatedAt: Date;
}

// Client profile - combines all client-specific data
export interface ClientProfile {
  id: string;
  userId: string;
  personalDetails: PersonalDetails;
  coreIdentity: CoreIdentity;
  automationNeeds: AutomationNeeds;
  projectRequirements?: ProjectRequirements;
  projectScope?: ProjectScopeDetails;
  createdAt: Date;
  updatedAt: Date;
}

// Combined user profile type that could be either agent or client
export type UserProfile = AgentProfile | ClientProfile;

// Type guard to check if a profile is an agent profile
export function isAgentProfile(profile: UserProfile): profile is AgentProfile {
  return "automationExpertise" in profile;
}

// Type guard to check if a profile is a client profile
export function isClientProfile(
  profile: UserProfile
): profile is ClientProfile {
  return "automationNeeds" in profile;
}
