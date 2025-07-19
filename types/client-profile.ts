import { z } from "zod";

// Project schema
export const ProjectSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  businessDomain: z.string().min(1, "Business domain is required"),
  projectDescription: z.string().min(10, "Project description is required"),
  painPoints: z.string().min(10, "Pain points are required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Timeline is required"),
  complexity: z.string().min(1, "Complexity is required"),
  engagementType: z.string().min(1, "Engagement type is required"),
  teamSizeRequired: z.string().min(1, "Team size required is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
});

// Company schema
export const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  teamSize: z.string().min(1, "Team size is required").optional(),
  bio: z
    .string()
    .min(10, "Company bio must be at least 10 characters")
    .optional(),
  website: z.string().url("Invalid website URL").optional(),
  logo: z
    .object({
      asset: z.object({
        url: z.string(),
      }),
    })
    .optional()
    .nullable(),
  banner: z
    .object({
      asset: z.object({
        url: z.string(),
      }),
    })
    .optional()
    .nullable(),
});

// Social link schema
export const SocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url("Invalid social media URL"),
});

// Main form schema
export const ClientProfileSchema = z.object({
  // Personal Details Section
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  website: z.string().url("Invalid website URL").optional(),
  profilePicture: z
    .object({
      asset: z.object({
        url: z.string(),
      }),
    })
    .optional()
    .nullable(),
  bannerImage: z
    .object({
      asset: z.object({
        url: z.string(),
      }),
    })
    .optional()
    .nullable(),
  socialLinks: z.array(SocialLinkSchema),

  // Core Identity Section
  fullName: z.string().min(1, "Full name is required"),
  hasCompany: z.boolean(),
  company: CompanySchema.optional(),

  // Automation Expertise Section
  automationNeeds: z.array(z.string()).min(1, "Select at least one need"),
  currentTools: z.array(z.string()).min(1, "Select at least one tool"),

  // Project Details Section
  projectTitle: z.string().min(1, "Project title is required"),
  businessDomain: z.string().min(1, "Business domain is required"),
  projectDescription: z.string().min(10, "Project description is required"),
  painPoints: z.string().min(10, "Pain points are required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Timeline is required"),
  complexity: z.string().min(1, "Complexity is required"),
  engagementType: z.string().min(1, "Engagement type is required"),
  teamSizeRequired: z.string().min(1, "Team size required is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  priority: z.string().min(1, "Priority is required"),
});

export type ClientProfile = z.infer<typeof ClientProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
