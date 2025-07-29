import React from "react";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import { Zap, Wrench } from "lucide-react";
import {
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
  CLIENT_AUTOMATION_NEEDS,
  CLIENT_CURRENT_TOOLS,
} from "@/sanity/schemaTypes/constants";
import {
  getAutomationServiceInfo,
  getToolsExpertiseInfo,
  getClientAutomationNeedsInfo,
  getClientToolsInfo,
} from "@/lib/expertise-utils";
import { GlassModal } from "@/components/UI/GlassModal";

interface AutomationExpertiseFormProps {
  isOpen: boolean;
  onClose: () => void;
  automationServices: string[];
  toolsExpertise: string[];
  onAutomationServiceChange: (service: string) => void;
  onToolExpertiseChange: (tool: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  title?: string;
  automationTitle?: string;
  toolsTitle?: string;
  userType: "agent" | "client";
}

export function AutomationExpertiseForm({
  isOpen,
  onClose,
  automationServices,
  toolsExpertise,
  onAutomationServiceChange,
  onToolExpertiseChange,
  onSubmit,
  onCancel,
  isLoading,
  userType,
  title = userType === "agent"
    ? "Edit Automation Expertise"
    : "Edit Automation Needs",
  automationTitle = userType === "agent"
    ? "Automation Services"
    : "Automation Requirements",
  toolsTitle = userType === "agent" ? "Tools Expertise" : "Current Tools",
}: AutomationExpertiseFormProps) {
  // Determine which options to use based on userType
  const automationOptions =
    userType === "agent" ? AGENT_AUTOMATION_SERVICES : CLIENT_AUTOMATION_NEEDS;
  const toolsOptions =
    userType === "agent" ? AGENT_TOOLS_EXPERTISE : CLIENT_CURRENT_TOOLS;

  // Get the appropriate info getter function based on userType
  const getAutomationInfo =
    userType === "agent"
      ? getAutomationServiceInfo
      : getClientAutomationNeedsInfo;
  const getToolInfo =
    userType === "agent" ? getToolsExpertiseInfo : getClientToolsInfo;

  // Determine the color scheme based on userType
  const colorScheme =
    userType === "agent"
      ? {
          primary: "violet",
          secondary: "indigo",
        }
      : {
          primary: "blue",
          secondary: "cyan",
        };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={title}
      description={
        userType === "agent"
          ? "Edit your automation services and tools expertise"
          : "Edit your automation requirements and current tools"
      }
    >
      <div className="space-y-8 p-2 h-[75vh] overflow-y-auto">
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <Zap className="inline-block mr-2 h-5 w-5 text-violet-400" />
              {automationTitle}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automationOptions.map((service) => {
                const info = getAutomationInfo(service.value);
                return (
                  <div
                    key={service.value}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      automationServices.includes(service.value)
                        ? "bg-violet-500/20 border-violet-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    onClick={() => onAutomationServiceChange(service.value)}
                  >
                    <div className="flex items-center space-x-3">
                      {info.icon && (
                        <info.icon className="h-5 w-5 text-violet-400" />
                      )}
                      <span className="text-sm font-medium text-violet-100">
                        {service.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <Wrench className="inline-block mr-2 h-5 w-5 text-violet-400" />
              {toolsTitle}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toolsOptions.map((tool) => {
                const info = getToolInfo(tool.value);
                return (
                  <div
                    key={tool.value}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      toolsExpertise.includes(tool.value)
                        ? "bg-indigo-500/20 border-indigo-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    onClick={() => onToolExpertiseChange(tool.value)}
                  >
                    <div className="flex items-center space-x-3">
                      {info.icon && (
                        <info.icon className="h-5 w-5 text-indigo-400" />
                      )}
                      <span className="text-sm font-medium text-indigo-100">
                        {tool.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4 border-t border-violet-800/30 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </GlassModal>
  );
}
