// Common option type
export interface Option {
  title: string;
  value: string;
}

// Form state interface used in both client and agent forms
export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// Client profile data interface
export interface ClientProfileData {
  companyName: string;
  industry: string;
  budget: string;
  projectTypes: string[];
  description: string;
  location: string;
  timezone: string;
  communicationPreferences: {
    preferredMethod: string;
    availability: string;
  };
}

// Agent profile data interface
export interface AgentProfileData {
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: string;
  availability: string;
  languages: string[];
  timezone: string;
  portfolio?: Array<{
    title: string;
    description: string;
    url?: string;
  }>;
  experienceLevel?: string;
}

// Initial form state
export const initialFormState: FormState = {
  success: false,
  message: "",
};
