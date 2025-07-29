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
  availability?: {
    currentStatus: string;
    workingHours: string;
    timeZone: string;
    responseTime: string;
    availabilityHours: string;
  };
  pricing?: {
    hourlyRateRange: string;
    minimumProjectBudget: string;
    preferredPaymentMethods: string[];
  };
  mustHaveRequirements?: {
    experience: string;
    dealBreakers: string[];
    industryDomain: string[];
    customIndustry?: string[];
    requirements: string[];
  };
  projects?: AgentProject[];
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
  projects?: ClientProject[];
  mustHaveRequirements?: {
    experience: string;
    dealBreakers: string[];
    industryDomain: string[];
    customIndustry?: string[];
    requirements: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | "planning"
  | "inProgress"
  | "completed"
  | "onHold"
  | "cancelled";

export interface AgentProject {
  _id: string;
  title: string;
  description: string;
  projectLink?: string;
  technologies?: string[];
  images?: {
    _key?: string;
    image: {
      asset: {
        url: string;
      };
    };
    alt: string;
  }[];
  status: ProjectStatus;
  isPortfolioProject?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProject {
  _id: string;
  title: string;
  description: string;
  businessDomain: string;
  painPoints: string;
  budgetRange: string;
  timeline: string;
  complexity: string;
  engagementType: string;
  teamSize: string;
  experienceLevel: string;
  startDate: string;
  priority: string;
  status: string;
  assignedAgents?: Array<{
    _ref: string;
    _type: "reference";
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
