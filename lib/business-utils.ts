import {
  LucideIcon,
  DollarSign,
  Clock,
  Briefcase,
  Users,
  Scale,
  Building2,
  Settings,
} from "lucide-react";
import {
  PRICING_MODELS,
  AVAILABILITY_OPTIONS,
  WORK_TYPES,
  TEAM_SIZES,
  PROJECT_SIZE_PREFERENCES,
} from "@/sanity/schemaTypes/constants";
import {
  getPricingModelTitle,
  getAvailabilityOptionTitle,
  getTeamSizeTitle,
  getProjectSizePreferenceTitle,
  formatProjectSizePreferences,
} from "@/lib/constants-utils";

export interface BusinessDetailInfo {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  category: "availability" | "preferences" | "team";
  sectionIcon?: LucideIcon;
}

// Define descriptions for each business detail
const businessDescriptions: Record<string, string> = {
  pricingModel: "Preferred pricing structure for client engagements",
  availability: "Current availability status for new projects",
  workType: "Preferred work arrangement and collaboration style",
  teamSize: "Size of the team that can be allocated to projects",
  projectSizePreferences: "Optimal project scope and size preferences",
};

// Helper function to format array values with proper titles
function formatArrayValue(type: string, values: string[]): string {
  if (!values || values.length === 0) return "";

  switch (type) {
    case "projectSizePreferences": {
      // Define the order based on PROJECT_SIZE_PREFERENCES
      const order = [
        "0-500",
        "500-1000",
        "1000-5000",
        "5000-10000",
        "10000plus",
      ];

      // Sort values based on the predefined order
      const sortedValues = values.sort(
        (a, b) => order.indexOf(a) - order.indexOf(b)
      );

      // Map to titles and ensure numbers don't have commas
      return sortedValues
        .map((value) => {
          const title =
            PROJECT_SIZE_PREFERENCES.find((pref) => pref.value === value)
              ?.title || value;
          return title.replace(/,/g, "");
        })
        .join(", ");
    }
    default:
      return values.map((v) => v.replace(/_/g, " ")).join(", ");
  }
}

// Helper function to format single value with proper title
function formatValue(type: string, value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);

  switch (type) {
    case "pricingModel":
      return getPricingModelTitle(stringValue);
    case "availability":
      return getAvailabilityOptionTitle(stringValue);
    case "workType":
      return (
        WORK_TYPES.find((t) => t.value === stringValue)?.title || stringValue
      );
    case "teamSize":
      return getTeamSizeTitle(stringValue);
    default:
      return stringValue.replace(/_/g, " ");
  }
}

// Helper function to get business detail info
export function getBusinessDetailInfo(
  type: string,
  value: string | string[]
): BusinessDetailInfo {
  const icons: Record<string, LucideIcon> = {
    pricingModel: DollarSign,
    availability: Clock,
    workType: Briefcase,
    teamSize: Users,
    projectSizePreferences: Scale,
  };

  const sectionIcons: Record<string, LucideIcon> = {
    availability: Clock,
    preferences: Settings,
    team: Users,
  };

  const categories: Record<string, "availability" | "preferences" | "team"> = {
    pricingModel: "preferences",
    availability: "availability",
    workType: "preferences",
    teamSize: "team",
    projectSizePreferences: "preferences",
  };

  const category = categories[type];

  return {
    title: type
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    value: Array.isArray(value)
      ? formatArrayValue(type, value)
      : formatValue(type, value),
    description: businessDescriptions[type] || "",
    icon: icons[type] || Building2,
    category,
    sectionIcon: sectionIcons[category],
  };
}

// Helper function to group business details
export function groupBusinessDetails(details: {
  pricingModel: string;
  availability: string;
  workType: string;
  teamSize?: string;
  projectSizePreferences?: string[];
}) {
  const grouped: Record<string, BusinessDetailInfo[]> = {
    "Current Availability": [],
    "Work Preferences": [],
    "Team Information": [],
  };

  // Process each detail
  Object.entries(details).forEach(([key, value]) => {
    if (value) {
      const info = getBusinessDetailInfo(key, value);
      switch (info.category) {
        case "availability":
          grouped["Current Availability"].push(info);
          break;
        case "preferences":
          grouped["Work Preferences"].push(info);
          break;
        case "team":
          grouped["Team Information"].push(info);
          break;
      }
    }
  });

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(grouped).filter(([_, items]) => items.length > 0)
  );
}
