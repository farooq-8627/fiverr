import { z } from "zod";

export interface Project {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  projectLink?: string;
  imageFiles?: File[];
  activeImageIndex?: number;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}

export interface ProjectImage {
  _type: "projectImage";
  image: SanityImage;
}

export const ProjectFormSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  projectLink: z.string().optional(),
  imageFiles: z.array(z.instanceof(File)).optional(),
});

export const AgentProfileSchema = z.object({
  automationExpertise: z.object({
    automationServices: z.array(z.string()),
    toolsExpertise: z.array(z.string()),
  }),
  businessDetails: z.object({
    pricingModel: z.string(),
    projectSizePreferences: z.array(z.string()),
    teamSize: z.string(),
    availability: z.string(),
    workType: z.string(),
  }),
  availability: z.object({
    availabilityStatus: z.string(),
    workingHoursPreference: z.string(),
    responseTimeCommitment: z.string(),
  }),
  pricing: z.object({
    hourlyRateRange: z.string(),
    minimumProjectBudget: z.string(),
    preferredPaymentMethods: z.array(z.string()),
  }),
  communicationPreferences: z.object({
    preferredContactMethod: z.string(),
    languagesSpoken: z.array(
      z.object({
        language: z.string(),
        proficiency: z.string(),
      })
    ),
  }),
  mustHaveRequirements: z.object({
    dealBreakers: z.array(z.string()),
    industryDomain: z.array(z.string()),
    requirements: z.array(z.string()),
  }),
  projects: z.array(ProjectFormSchema).optional(),
});

export type AgentProfile = z.infer<typeof AgentProfileSchema>;
