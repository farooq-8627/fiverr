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
  CLIENT_AUTOMATION_NEEDS,
  CLIENT_CURRENT_TOOLS,
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

// Simplified color schemes for services and tools
const colorSchemes = {
  // For automation services (expertise)
  service: {
    bg: "bg-violet-500/20",
    text: "text-violet-400",
    border: "border-violet-500/30",
    hover: "hover:bg-violet-500/30",
  },
  // For tools
  tool: {
    bg: "bg-indigo-500/20",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    hover: "hover:bg-indigo-500/30",
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
    colors: colorSchemes.service, // Always use service colors
  };
}

export function getToolsExpertiseInfo(value: string): ExpertiseItem {
  const tool = AGENT_TOOLS_EXPERTISE.find((t) => t.value === value);
  return {
    title: tool?.title || value,
    value: value,
    icon: toolsExpertiseIcons[value] || Sparkles,
    colors: colorSchemes.tool, // Always use tool colors
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

export function getClientAutomationNeedsInfo(value: string): ExpertiseItem {
  const need = CLIENT_AUTOMATION_NEEDS.find((n) => n.value === value);
  return {
    title: need?.title || value,
    value: value,
    icon: automationServiceIcons[value] || Blocks,
    colors: colorSchemes.service, // Always use service colors
  };
}

export function getClientToolsInfo(value: string): ExpertiseItem {
  const tool = CLIENT_CURRENT_TOOLS.find((t) => t.value === value);
  return {
    title: tool?.title || value,
    value: value,
    icon: toolsExpertiseIcons[value] || Sparkles,
    colors: colorSchemes.tool, // Always use tool colors
  };
}

// Helper function specifically for grouping client expertise items by category
export function groupClientExpertiseByCategory(
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
