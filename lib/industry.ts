import { INDUSTRY_DOMAINS } from "@/sanity/schemaTypes/constants";

/**
 * Get the display title for an industry by its value
 */
export function getIndustryTitle(value: string): string {
  const industry = INDUSTRY_DOMAINS.find(
    (industry) => industry.value === value
  );
  return industry?.title || value;
}

/**
 * Get all industry values
 */
export function getAllIndustryValues(): string[] {
  return INDUSTRY_DOMAINS.map((industry) => industry.value);
}

/**
 * Check if a value is a valid industry
 */
export function isValidIndustry(value: string): boolean {
  return INDUSTRY_DOMAINS.some((industry) => industry.value === value);
}

/**
 * Get industries for display in the UI
 * Useful for select dropdowns, filter components, etc.
 */
export function getIndustriesForUI() {
  return INDUSTRY_DOMAINS.map((industry) => ({
    label: industry.title,
    value: industry.value,
  }));
}

/**
 * Format an array of industry values for display
 * @example formatIndustries(['ecommerce', 'finance']) => "E-commerce, Finance"
 */
export function formatIndustries(industries: string[]): string {
  if (!industries || industries.length === 0) return "Not specified";

  return industries.map((value) => getIndustryTitle(value)).join(", ");
}
