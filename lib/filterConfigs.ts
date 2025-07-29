import { FilterConfig, EntityType } from "@/types/filters";
import {
  INDUSTRY_DOMAINS,
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
  CLIENT_AUTOMATION_NEEDS,
  BUDGET_RANGES,
  CLIENT_CURRENT_TOOLS,
  TEAM_SIZES,
} from "@/sanity/schemaTypes/constants";

const industryOptions = INDUSTRY_DOMAINS.map((domain) => ({
  label: domain.title,
  value: domain.value,
}));

const automationServicesOptions = AGENT_AUTOMATION_SERVICES.map((service) => ({
  label: service.title,
  value: service.value,
}));

const toolsExpertiseOptions = AGENT_TOOLS_EXPERTISE.map((tool) => ({
  label: tool.title,
  value: tool.value,
}));

const automationNeedsOptions = CLIENT_AUTOMATION_NEEDS.map((need) => ({
  label: need.title,
  value: need.value,
}));

const budgetOptions = BUDGET_RANGES.map((budget) => ({
  label: budget.title,
  value: budget.value,
}));

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const authorTypeOptions = [
  { label: "Agents", value: "agent" },
  { label: "Clients", value: "client" },
];

const achievementTypeOptions = [
  { label: "Project Completion", value: "projectCompletion" },
  { label: "Milestone Achievement", value: "milestoneAchievement" },
  { label: "Skill Certification", value: "skillCertification" },
  { label: "Business Growth", value: "businessGrowth" },
  { label: "Client Success", value: "clientSuccess" },
  { label: "Innovation", value: "innovation" },
];

const statusOptions = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on-hold" },
];

const teamSizeOptions = TEAM_SIZES.map((size) => ({
  label: size.title,
  value: size.value,
}));

const toolsOptions = CLIENT_CURRENT_TOOLS.map((tool) => ({
  label: tool.title,
  value: tool.value,
}));

export const filterConfigs: Record<EntityType, FilterConfig[]> = {
  agent: [
    {
      id: "availability",
      label: "Availability",
      type: "toggle",
      field: "availability.currentStatus",
    },
    {
      id: "industry",
      label: "Industry",
      type: "multiSelect",
      options: industryOptions,
      field: "mustHaveRequirements.industryDomain",
    },
    {
      id: "automationServices",
      label: "Automation Services",
      type: "multiSelect",
      options: automationServicesOptions,
      field: "automationExpertise.automationServices",
    },
    {
      id: "toolsExpertise",
      label: "Tools Expertise",
      type: "multiSelect",
      options: toolsExpertiseOptions,
      field: "automationExpertise.toolsExpertise",
    },
    {
      id: "hourlyRate",
      label: "Hourly Rate ($)",
      type: "range",
      field: "pricing.hourlyRateRange",
    },
  ],

  client: [
    {
      id: "availability",
      label: "Availability",
      type: "toggle",
      field: "activeProjects",
    },
    {
      id: "industry",
      label: "Industry",
      type: "multiSelect",
      options: industryOptions,
      field: "mustHaveRequirements.industryDomain",
    },
    {
      id: "automationNeeds",
      label: "Automation Needs",
      type: "multiSelect",
      options: automationNeedsOptions,
      field: "automationNeeds.automationRequirements",
    },
    {
      id: "budgetRange",
      label: "Budget Range",
      type: "multiSelect",
      options: budgetOptions,
      field: "projectPreferences.budgetRange",
    },
    {
      id: "tools",
      label: "Current Tools",
      type: "multiSelect",
      options: toolsOptions,
      field: "automationNeeds.currentTools",
    },
  ],

  project: [
    {
      id: "priority",
      label: "Priority",
      type: "select",
      options: priorityOptions,
      field: "priority",
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: statusOptions,
      field: "status",
    },
    {
      id: "budget",
      label: "Budget Range ($)",
      type: "range",
      field: "budget",
    },
    {
      id: "industry",
      label: "Industry",
      type: "multiSelect",
      options: industryOptions,
      field: "industryDomain",
    },
    {
      id: "duration",
      label: "Duration (Months)",
      type: "range",
      field: "duration",
    },
  ],

  company: [
    {
      id: "industries",
      label: "Industries",
      type: "multiSelect",
      options: industryOptions,
      field: "industries",
    },
    {
      id: "teamSize",
      label: "Team Size",
      type: "select",
      options: teamSizeOptions,
      field: "teamSize",
    },
    {
      id: "location",
      label: "Location",
      type: "search",
      field: "location",
    },
  ],

  feed: [
    {
      id: "authorType",
      label: "Author Type",
      type: "multiSelect",
      options: authorTypeOptions,
      field: "authorType",
    },
    {
      id: "industry",
      label: "Industry",
      type: "multiSelect",
      options: industryOptions,
      field: "author.mustHaveRequirements.industryDomain",
    },
    {
      id: "isAchievement",
      label: "Achievement Posts",
      type: "toggle",
      field: "isAchievement",
    },
    {
      id: "achievementType",
      label: "Achievement Type",
      type: "multiSelect",
      options: achievementTypeOptions,
      field: "achievementType",
    },
    {
      id: "tags",
      label: "Tags",
      type: "search",
      field: "tags",
    },
  ],
};
