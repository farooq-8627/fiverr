// types/agent-profile.ts
export interface PortfolioItem {
  title: string;
  description: string;
  image?: File | null;
  url?: string;
  technologies: string[];
}

export interface Language {
  language: string;
  proficiency: "basic" | "conversational" | "fluent" | "native";
}

export interface WorkingHours {
  start: string;
  end: string;
  workingDays: string[];
}

export interface AgentProfileFormData {
  title: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  bio: string;
  portfolio: PortfolioItem[];
  languages: Language[];
  availability: "full-time" | "part-time" | "project-based" | "limited";
  location: string;
  timezone: string;
  workingHours: WorkingHours;
  responseTime: "1-hour" | "6-hours" | "24-hours" | "2-3-days";
}
