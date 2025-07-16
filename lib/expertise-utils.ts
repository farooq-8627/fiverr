import { LucideIcon } from "lucide-react";
import {
  Bot,
  LineChart,
  ShoppingCart,
  Workflow,
  Database,
  Code,
  Sparkles,
  Zap,
  Mail,
  Building2,
  FileSpreadsheet,
  BrainCircuit,
  Store,
  MessageSquareCode,
  Blocks,
} from "lucide-react";
import {
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
} from "@/sanity/schemaTypes/constants";

// Define icon mappings for automation services
const automationServiceIcons: Record<string, LucideIcon> = {
  marketing: LineChart,
  sales: ShoppingCart,
  ecommerce: Store,
  workflow: Workflow,
  data: Database,
  ai: BrainCircuit,
  custom: Code,
  others: Blocks,
};

// Define icon mappings for tools expertise
const toolsExpertiseIcons: Record<string, LucideIcon> = {
  automation: Zap,
  crm: Building2,
  email: Mail,
  project: FileSpreadsheet,
  commerce: Store,
  ai_tools: Bot,
  others: Sparkles,
};

// Define color schemes for different categories
const colorSchemes = {
  marketing: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    hover: "hover:bg-purple-500/20",
  },
  sales: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    hover: "hover:bg-blue-500/20",
  },
  ecommerce: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
    hover: "hover:bg-green-500/20",
  },
  workflow: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    hover: "hover:bg-orange-500/20",
  },
  data: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    hover: "hover:bg-cyan-500/20",
  },
  ai: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    hover: "hover:bg-purple-500/20",
  },
  custom: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    hover: "hover:bg-rose-500/20",
  },
  air: {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/20",
    hover: "hover:bg-gray-500/20",
  },
  default: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    hover: "hover:bg-purple-500/20",
  },
};

export interface ExpertiseItem {
  title: string;
  value: string;
  icon: LucideIcon;
  colors: {
    bg: string;
    text: string;
    border: string;
    hover: string;
  };
}

// Helper function to get the full title for a service/tool value
export function getAutomationServiceInfo(value: string): ExpertiseItem {
  const service = AGENT_AUTOMATION_SERVICES.find((s) => s.value === value);
  return {
    title: service?.title || value,
    value: value,
    icon: automationServiceIcons[value] || Blocks,
    colors:
      colorSchemes[value as keyof typeof colorSchemes] || colorSchemes.default,
  };
}

export function getToolsExpertiseInfo(value: string): ExpertiseItem {
  const tool = AGENT_TOOLS_EXPERTISE.find((t) => t.value === value);
  return {
    title: tool?.title || value,
    value: value,
    icon: toolsExpertiseIcons[value] || Sparkles,
    colors:
      colorSchemes[value as keyof typeof colorSchemes] || colorSchemes.default,
  };
}

// Helper function to group expertise items by category
export function groupExpertiseByCategory(
  items: string[],
  getInfo: (value: string) => ExpertiseItem
) {
  const grouped = new Map<string, ExpertiseItem[]>();

  items.forEach((item) => {
    const info = getInfo(item);
    const category = info.value.split("_")[0]; // Use the first part of the value as category
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)?.push(info);
  });

  return Array.from(grouped.entries());
}
