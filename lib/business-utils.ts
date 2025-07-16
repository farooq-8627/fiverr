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

// Helper function to format array values
function formatArrayValue(values: string[]): string {
  return values.map((v) => v.replace(/_/g, " ")).join(", ");
}

// Helper function to format single value
function formatValue(value: string): string {
  return value.replace(/_/g, " ");
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
    value: Array.isArray(value) ? formatArrayValue(value) : formatValue(value),
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
