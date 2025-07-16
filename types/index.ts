export interface AgentProfile {
  _id: string;
  profileId: {
    current: string;
  };
  userId?: {
    _ref: string;
    _type: "reference";
  };
  automationExpertise: {
    automationServices: string[];
    toolsExpertise: string[];
    customAutomationServices?: string[];
    customToolsExpertise?: string[];
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
    technologies?: string[];
    images?: Array<{
      image: {
        asset: {
          url: string;
        };
      };
      alt: string;
    }>;
    status?: string;
    isPortfolioProject?: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
  _id: string;
  profileId: {
    current: string;
  };
  userId?: {
    _ref: string;
    _type: "reference";
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
    technologies?: string[];
    painPoints?: string;
    budgetRange?: string;
    timeline?: string;
    projectComplexity?: string;
    engagementType?: string;
    teamSize?: string;
    experienceLevel?: string;
    status?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Location {
  cityState: string;
  country: string;
}
