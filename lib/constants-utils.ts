import {
  INDUSTRY_DOMAINS,
  COMPANY_SIZES,
  TEAM_SIZES,
  PROJECT_STATUSES,
  AGENT_PROJECT_STATUSES,
  BUDGET_RANGES,
  PROJECT_SIZE_PREFERENCES,
  HOURLY_RATE_RANGES,
  MINIMUM_PROJECT_BUDGETS,
  TIMELINE_OPTIONS,
  PROJECT_COMPLEXITY,
  ENGAGEMENT_TYPES,
  EXPERIENCE_LEVELS,
  PRIORITY_LEVELS,
  PRICING_MODELS,
  AVAILABILITY_STATUSES,
  WORKING_HOURS_PREFERENCES,
  RESPONSE_TIME_COMMITMENTS,
  PAYMENT_METHODS,
  CONTACT_METHODS,
  LANGUAGE_PROFICIENCIES,
  UPDATE_FREQUENCIES,
  MEETING_AVAILABILITIES,
  AVAILABILITY_OPTIONS,
} from "@/sanity/schemaTypes/constants";

/**
 * Utility functions for working with centralized constants
 */

/**
 * Convert from centralized format to onboarding format
 * Centralized: { title: string, value: string }
 * Onboarding: { id: string, label: string }
 */
export const convertToOnboardingFormat = (
  options: Array<{ title: string; value: string }>
) => {
  return options.map((option) => ({
    id: option.value,
    label: option.title,
  }));
};

/**
 * Convert from centralized format to select component format
 * Centralized: { title: string, value: string }
 * Select: { value: string, label: string }
 */
export const convertToSelectFormat = (
  options: Array<{ title: string; value: string }>
) => {
  return options.map((option) => ({
    value: option.value,
    label: option.title,
  }));
};

/**
 * Get the title for a given value from a constant array
 */
export const getTitleByValue = (
  options: Array<{ title: string; value: string }>,
  value: string
): string => {
  const option = options.find((option) => option.value === value);
  return option ? option.title : value;
};

/**
 * Check if a value exists in a constant array
 */
export const isValidValue = (
  options: Array<{ title: string; value: string }>,
  value: string
): boolean => {
  return options.some((option) => option.value === value);
};

/**
 * Filter constants by a search term
 */
export const filterConstantsBySearch = (
  options: Array<{ title: string; value: string }>,
  searchTerm: string
): Array<{ title: string; value: string }> => {
  if (!searchTerm) return options;
  const lowerSearchTerm = searchTerm.toLowerCase();

  return options.filter(
    (option) =>
      option.title.toLowerCase().includes(lowerSearchTerm) ||
      option.value.toLowerCase().includes(lowerSearchTerm)
  );
};

/**
 * Group constants by a property
 */
export const groupConstantsByProperty = <T extends Record<string, any>>(
  items: T[],
  property: keyof T
): Record<string, T[]> => {
  return items.reduce(
    (acc, item) => {
      const key = String(item[property]);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
};

/**
 * Generic function to format an array of values for display using their titles
 */
export function formatValues(
  list: Array<{ title: string; value: string }>,
  values: string[]
): string {
  if (!values || values.length === 0) return "Not specified";

  return values.map((value) => getTitleByValue(list, value)).join(", ");
}

/**
 * Generic function to get all values from a constant list
 */
export function getAllValues(
  list: Array<{ title: string; value: string }>
): string[] {
  return list.map((item) => item.value);
}

/**
 * Generic function to prepare constants for UI components (like select dropdowns)
 */
export function getOptionsForUI(list: Array<{ title: string; value: string }>) {
  return list.map((item) => ({
    label: item.title,
    value: item.value,
  }));
}

// Industry specific functions
export const getIndustryTitle = (value: string) =>
  getTitleByValue(INDUSTRY_DOMAINS, value);
export const formatIndustries = (values: string[]) =>
  formatValues(INDUSTRY_DOMAINS, values);
export const getAllIndustryValues = () => getAllValues(INDUSTRY_DOMAINS);
export const getIndustryOptionsForUI = () => getOptionsForUI(INDUSTRY_DOMAINS);

// Company size specific functions
export const getCompanySizeTitle = (value: string) =>
  getTitleByValue(COMPANY_SIZES, value);
export const getCompanySizeOptionsForUI = () => getOptionsForUI(COMPANY_SIZES);

// Team size specific functions
export const getTeamSizeTitle = (value: string) =>
  getTitleByValue(TEAM_SIZES, value);
export const getTeamSizeOptionsForUI = () => getOptionsForUI(TEAM_SIZES);

// Project status specific functions
export const getProjectStatusTitle = (value: string) =>
  getTitleByValue(PROJECT_STATUSES, value);
export const getProjectStatusOptionsForUI = () =>
  getOptionsForUI(PROJECT_STATUSES);

// Agent project status specific functions
export const getAgentProjectStatusTitle = (value: string) =>
  getTitleByValue(AGENT_PROJECT_STATUSES, value);
export const getAgentProjectStatusOptionsForUI = () =>
  getOptionsForUI(AGENT_PROJECT_STATUSES);

// Budget range specific functions
export const getBudgetRangeTitle = (value: string) =>
  getTitleByValue(BUDGET_RANGES, value);
export const getBudgetRangeOptionsForUI = () => getOptionsForUI(BUDGET_RANGES);

// Project size preferences specific functions
export const getProjectSizePreferenceTitle = (value: string) =>
  getTitleByValue(PROJECT_SIZE_PREFERENCES, value);
export const formatProjectSizePreferences = (values: string[]) =>
  formatValues(PROJECT_SIZE_PREFERENCES, values);
export const getProjectSizePreferenceOptionsForUI = () =>
  getOptionsForUI(PROJECT_SIZE_PREFERENCES);

// Timeline specific functions
export const getTimelineTitle = (value: string) =>
  getTitleByValue(TIMELINE_OPTIONS, value);
export const getTimelineOptionsForUI = () => getOptionsForUI(TIMELINE_OPTIONS);

// Project complexity specific functions
export const getProjectComplexityTitle = (value: string) =>
  getTitleByValue(PROJECT_COMPLEXITY, value);
export const getProjectComplexityOptionsForUI = () =>
  getOptionsForUI(PROJECT_COMPLEXITY);

// Engagement type specific functions
export const getEngagementTypeTitle = (value: string) =>
  getTitleByValue(ENGAGEMENT_TYPES, value);
export const getEngagementTypeOptionsForUI = () =>
  getOptionsForUI(ENGAGEMENT_TYPES);

// Experience level specific functions
export const getExperienceLevelTitle = (value: string) =>
  getTitleByValue(EXPERIENCE_LEVELS, value);
export const getExperienceLevelOptionsForUI = () =>
  getOptionsForUI(EXPERIENCE_LEVELS);

// Priority level specific functions
export const getPriorityLevelTitle = (value: string) =>
  getTitleByValue(PRIORITY_LEVELS, value);
export const getPriorityLevelOptionsForUI = () =>
  getOptionsForUI(PRIORITY_LEVELS);

// Pricing model specific functions
export const getPricingModelTitle = (value: string) =>
  getTitleByValue(PRICING_MODELS, value);
export const getPricingModelOptionsForUI = () =>
  getOptionsForUI(PRICING_MODELS);

// Availability status specific functions
export const getAvailabilityStatusTitle = (value: string) =>
  getTitleByValue(AVAILABILITY_STATUSES, value);
export const getAvailabilityStatusOptionsForUI = () =>
  getOptionsForUI(AVAILABILITY_STATUSES);

// Working hours preference specific functions
export const getWorkingHoursPreferenceTitle = (value: string) =>
  getTitleByValue(WORKING_HOURS_PREFERENCES, value);
export const getWorkingHoursPreferenceOptionsForUI = () =>
  getOptionsForUI(WORKING_HOURS_PREFERENCES);

// Response time commitment specific functions
export const getResponseTimeCommitmentTitle = (value: string) =>
  getTitleByValue(RESPONSE_TIME_COMMITMENTS, value);
export const getResponseTimeCommitmentOptionsForUI = () =>
  getOptionsForUI(RESPONSE_TIME_COMMITMENTS);

// Payment method specific functions
export const getPaymentMethodTitle = (value: string) =>
  getTitleByValue(PAYMENT_METHODS, value);
export const formatPaymentMethods = (values: string[]) =>
  formatValues(PAYMENT_METHODS, values);
export const getPaymentMethodOptionsForUI = () =>
  getOptionsForUI(PAYMENT_METHODS);

// Contact method specific functions
export const getContactMethodTitle = (value: string) =>
  getTitleByValue(CONTACT_METHODS, value);
export const getContactMethodOptionsForUI = () =>
  getOptionsForUI(CONTACT_METHODS);

// Language proficiency specific functions
export const getLanguageProficiencyTitle = (value: string) =>
  getTitleByValue(LANGUAGE_PROFICIENCIES, value);
export const getLanguageProficiencyOptionsForUI = () =>
  getOptionsForUI(LANGUAGE_PROFICIENCIES);

// Update frequency specific functions
export const getUpdateFrequencyTitle = (value: string) =>
  getTitleByValue(UPDATE_FREQUENCIES, value);
export const getUpdateFrequencyOptionsForUI = () =>
  getOptionsForUI(UPDATE_FREQUENCIES);

// Meeting availability specific functions
export const getMeetingAvailabilityTitle = (value: string) =>
  getTitleByValue(MEETING_AVAILABILITIES, value);
export const getMeetingAvailabilityOptionsForUI = () =>
  getOptionsForUI(MEETING_AVAILABILITIES);

// General availability specific functions
export const getAvailabilityOptionTitle = (value: string) =>
  getTitleByValue(AVAILABILITY_OPTIONS, value);
export const getAvailabilityOptionOptionsForUI = () =>
  getOptionsForUI(AVAILABILITY_OPTIONS);
