import {
  HOURLY_RATE_RANGES,
  AVAILABILITY_OPTIONS,
  LANGUAGE_PROFICIENCIES,
  EXPERIENCE_LEVELS,
  RESPONSE_TIME_COMMITMENTS,
  SKILL_OPTIONS,
  WORKING_DAYS_OPTIONS,
  PORTFOLIO_TYPE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/sanity/schemaTypes/constants";
import {
  convertToSelectFormat,
  convertToOnboardingFormat,
} from "@/lib/constants-utils";

// Skill categories - using centralized constants
export const skillOptions = convertToSelectFormat(SKILL_OPTIONS);

// Working days options - using centralized constants
export const workingDaysOptions = convertToSelectFormat(WORKING_DAYS_OPTIONS);

// Response time options - using centralized constants
export const responseTimeOptions = convertToOnboardingFormat(
  RESPONSE_TIME_COMMITMENTS
);

// Portfolio project types - using centralized constants
export const portfolioTypeOptions = convertToSelectFormat(
  PORTFOLIO_TYPE_OPTIONS
);

// Hourly rate ranges - using centralized constants
export const hourlyRateOptions = convertToOnboardingFormat(HOURLY_RATE_RANGES);

// Availability options - using centralized constants
export const availabilityOptions =
  convertToOnboardingFormat(AVAILABILITY_OPTIONS);

// Language options - using centralized constants
export const languageOptions = convertToSelectFormat(LANGUAGE_OPTIONS);

// Experience level options - using centralized constants
export const experienceLevelOptions =
  convertToOnboardingFormat(EXPERIENCE_LEVELS);
