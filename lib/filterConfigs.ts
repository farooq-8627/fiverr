import { FilterConfig, EntityType } from "@/types/filters";
import { INDUSTRY_DOMAINS } from "@/sanity/schemaTypes/constants";

const industryOptions = INDUSTRY_DOMAINS.map((domain) => ({
  label: domain.title,
  value: domain.value,
}));

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const statusOptions = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on-hold" },
];

const companySizeOptions = [
  { label: "Startup (1-10)", value: "startup" },
  { label: "Small (11-50)", value: "small" },
  { label: "Medium (51-200)", value: "medium" },
  { label: "Large (201-1000)", value: "large" },
  { label: "Enterprise (1000+)", value: "enterprise" },
];

export const filterConfigs: Record<EntityType, FilterConfig[]> = {
  agent: [
    {
      id: "availability",
      label: "Availability",
      type: "toggle",
      field: "availability",
    },
    {
      id: "industry",
      label: "Industry",
      type: "multiSelect",
      options: industryOptions,
      field: "industryDomain",
    },
    {
      id: "experience",
      label: "Experience (Years)",
      type: "range",
      field: "yearsOfExperience",
    },
    {
      id: "rating",
      label: "Rating",
      type: "range",
      field: "rating",
    },
    {
      id: "pricing",
      label: "Hourly Rate ($)",
      type: "range",
      field: "hourlyRate",
    },
  ],

  client: [
    {
      id: "industry",
      label: "Industry",
      type: "multiSelect",
      options: industryOptions,
      field: "industryDomain",
    },
    {
      id: "projectCount",
      label: "Project Count",
      type: "range",
      field: "projectCount",
    },
    {
      id: "rating",
      label: "Rating",
      type: "range",
      field: "rating",
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
      id: "industry",
      label: "Industry",
      type: "multiSelect",
      options: industryOptions,
      field: "industryDomain",
    },
    {
      id: "size",
      label: "Company Size",
      type: "select",
      options: companySizeOptions,
      field: "size",
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
      id: "type",
      label: "Content Type",
      type: "multiSelect",
      options: [
        { label: "Projects", value: "project" },
        { label: "Updates", value: "update" },
        { label: "Announcements", value: "announcement" },
      ],
      field: "type",
    },
    {
      id: "date",
      label: "Date Range",
      type: "range",
      field: "date",
    },
  ],
};
