import {
  INDUSTRY_DOMAINS,
  BUDGET_RANGES,
  CONTACT_METHODS,
  MEETING_AVAILABILITIES,
  SKILL_OPTIONS,
} from "@/sanity/schemaTypes/constants";
import {
  convertToSelectFormat,
  convertToOnboardingFormat,
} from "@/lib/constants-utils";

// Industry options - using centralized constants
export const industryOptions = convertToOnboardingFormat(INDUSTRY_DOMAINS);

// Budget options - using centralized constants
export const budgetOptions = convertToOnboardingFormat(BUDGET_RANGES);

// Project types - using the same skill options as agents for consistency
export const projectTypeOptions = convertToSelectFormat(SKILL_OPTIONS);

// Communication methods - using centralized constants
export const communicationMethods = convertToOnboardingFormat(CONTACT_METHODS);

// Availability options - using centralized constants
export const availabilityOptions = convertToOnboardingFormat(
  MEETING_AVAILABILITIES
);
