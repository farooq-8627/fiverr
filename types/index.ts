export interface AgentProfile {
  _id: string;
  profileId: {
    current: string;
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
    technologies?: string[];
    images?: Array<{
      image: {
        asset: {
          url: string;
        };
      };
      alt: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
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
    budgetRange: string;
    timeline: string;
    projectComplexity: string;
    status: string;
    technology: string[];
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
