import { z } from "zod";

// Project schema
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  description: z
    .string()
    .min(10, "Project description must be at least 10 characters"),
  projectLink: z.string().url("Invalid project URL").optional(),
  technologies: z.array(z.string()),
  images: z.array(z.instanceof(File)).optional(),
  imageUrls: z.array(z.string()).optional(),
});

// Company schema
export const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  teamSize: z.string().min(1, "Team size is required"),
  bio: z.string().min(10, "Company bio must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional(),
  logo: z.instanceof(File).optional().nullable(),
  banner: z.instanceof(File).optional().nullable(),
});

// Social link schema
export const SocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url("Invalid social media URL"),
});

// Main form schema
export const AgentProfileSchema = z.object({
  // Personal Details Section
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  website: z.string().url("Invalid website URL").optional(),
  profilePicture: z.instanceof(File).optional().nullable(),
  bannerImage: z.instanceof(File).optional().nullable(),
  socialLinks: z.array(SocialLinkSchema),

  // Core Identity Section
  fullName: z.string().min(1, "Full name is required"),
  hasCompany: z.boolean(),
  company: CompanySchema.optional(),

  // Automation Expertise Section
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  automationTools: z.array(z.string()).min(1, "Select at least one tool"),
  expertiseLevel: z.enum(["beginner", "intermediate", "expert"]),

  // Projects Section
  projects: z.array(ProjectSchema),

  // Business Details Section
  pricingModel: z.string().min(1, "Pricing model is required"),
  projectSizePreference: z
    .array(z.string())
    .min(1, "Select at least one project size"),
  teamSize: z.string().min(1, "Team size is required"),
  availability: z.string().min(1, "Availability is required"),
  workType: z.string().min(1, "Work type is required"),
});

export type AgentProfile = z.infer<typeof AgentProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
