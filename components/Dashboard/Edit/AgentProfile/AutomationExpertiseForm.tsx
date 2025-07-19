import React from "react";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import { Zap, Wrench } from "lucide-react";
import {
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
} from "@/sanity/schemaTypes/constants";
import {
  getAutomationServiceInfo,
  getToolsExpertiseInfo,
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
  title = "Edit Automation Expertise",
  automationTitle = "Automation Services",
  toolsTitle = "Tools Expertise",
}: AutomationExpertiseFormProps) {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={title}
      description="Edit your automation services and tools expertise"
    >
      <div className="space-y-8 p-2">
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <Zap className="inline-block mr-2 h-5 w-5 text-violet-400" />
              {automationTitle}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AGENT_AUTOMATION_SERVICES.map((service) => {
                const info = getAutomationServiceInfo(service.value);
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
              {AGENT_TOOLS_EXPERTISE.map((tool) => {
                const info = getToolsExpertiseInfo(tool.value);
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

        <div className="flex justify-end space-x-4 pt-4 border-t border-violet-800/30">
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
      </div>
    </GlassModal>
  );
}
