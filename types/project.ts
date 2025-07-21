import { z } from "zod";

// Project Image Schema
const ProjectImageSchema = z.object({
  _type: z.literal("image"),
  asset: z.object({
    _type: z.literal("reference"),
    _ref: z.string(),
  }),
  alt: z.string().optional(),
  _key: z.string().optional(),
});

// Base Project Schema - Common fields for both agent and client projects
const BaseProjectSchema = z.object({
  _type: z.union([z.literal("agentProject"), z.literal("clientProject")]),
  title: z.string().min(1, "Project title is required"),
  slug: z.object({
    _type: z.literal("slug"),
    current: z.string(),
  }),
  description: z
    .string()
    .min(10, "Project description must be at least 10 characters"),
  businessDomain: z.string().optional(), // Make businessDomain optional
  images: z.array(ProjectImageSchema).optional(), // Make images optional
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Agent Project Schema
export const AgentProjectSchema = BaseProjectSchema.extend({
  _type: z.literal("agentProject"),
  agent: z.object({
    _type: z.literal("reference"),
    _ref: z.string(),
  }),
  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
  projectUrl: z.string().url("Invalid project URL").optional(),
  repositoryUrl: z.string().url("Invalid repository URL").optional(),
  clientReference: z
    .object({
      _type: z.literal("reference"),
      _ref: z.string(),
    })
    .optional(),
  testimonial: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 week"),
  teamSize: z.string(),
  startDate: z.string().optional(),
  completedAt: z.string().optional(),
});

// Client Project Schema
export const ClientProjectSchema = BaseProjectSchema.extend({
  _type: z.literal("clientProject"),
  client: z.object({
    _type: z.literal("reference"),
    _ref: z.string(),
  }),
  painPoints: z.string().min(10, "Pain points must be at least 10 characters"),
  budgetRange: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Timeline is required"),
  complexity: z.string().min(1, "Complexity is required"),
  engagementType: z.string().min(1, "Engagement type is required"),
  teamSize: z.string().min(1, "Team size is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  startDate: z.string().optional(),
  priority: z.string().optional(),
  assignedAgents: z
    .array(
      z.object({
        _type: z.literal("reference"),
        _ref: z.string(),
      })
    )
    .optional(),
});

// Export types
export type AgentProject = z.infer<typeof AgentProjectSchema>;
export type ClientProject = z.infer<typeof ClientProjectSchema>;
export type Project = AgentProject | ClientProject;

// Type guard to check project types
export function isAgentProject(project: Project): project is AgentProject {
  return project._type === "agentProject";
}

export function isClientProject(project: Project): project is ClientProject {
  return project._type === "clientProject";
}
