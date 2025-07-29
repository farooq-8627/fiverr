/**
 * Project-related constants for use in both frontend and Sanity schemas
 */
import {
  INDUSTRY_DOMAINS,
  PROJECT_COMPLEXITY,
  TIMELINE_OPTIONS,
  PORTFOLIO_TYPE_OPTIONS,
} from "./constants";

// Export project-related constants
export const PROJECT_TYPES = PORTFOLIO_TYPE_OPTIONS;
export const PROJECT_INDUSTRIES = INDUSTRY_DOMAINS;
export const PROJECT_COMPLEXITY_OPTIONS = PROJECT_COMPLEXITY;
export const PROJECT_DURATION_OPTIONS = TIMELINE_OPTIONS;

// Project outcome options
export const PROJECT_OUTCOME_OPTIONS = [
  { title: "Increased Efficiency", value: "efficiency" },
  { title: "Cost Reduction", value: "costReduction" },
  { title: "Revenue Growth", value: "revenueGrowth" },
  { title: "Improved Customer Experience", value: "customerExperience" },
  { title: "Process Automation", value: "processAutomation" },
  { title: "Data Integration", value: "dataIntegration" },
  { title: "Workflow Optimization", value: "workflowOptimization" },
  { title: "Other", value: "other" },
];

// Project technology categories
export const PROJECT_TECHNOLOGY_CATEGORIES = [
  { title: "Automation Tools", value: "automationTools" },
  { title: "CRM Systems", value: "crmSystems" },
  { title: "Marketing Platforms", value: "marketingPlatforms" },
  { title: "E-commerce Solutions", value: "ecommerceSolutions" },
  { title: "Data Analysis Tools", value: "dataAnalysisTools" },
  { title: "Custom Development", value: "customDevelopment" },
  { title: "AI/ML Technologies", value: "aiMlTechnologies" },
  { title: "Integration Platforms", value: "integrationPlatforms" },
  { title: "Other", value: "other" },
];
