import React, { useState } from "react";
import { GlassModal } from "../../UI/GlassModal";
import { Button } from "../../UI/button";
import { Label } from "../../UI/label";
import { Zap, Wrench } from "lucide-react";
import { updateAgentProfileDetails } from "@/app/onboarding/agent-profile/actions";
import { useToast } from "@/hooks/useToast";
import {
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
} from "@/sanity/schemaTypes/constants";
import {
  getAutomationServiceInfo,
  getToolsExpertiseInfo,
} from "@/lib/expertise-utils";

interface AutomationExpertiseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  initialData: {
    profileId: string;
    automationServices: string[];
    toolsExpertise: string[];
  };
  isCurrentUser: boolean;
}

export function AutomationExpertiseEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isCurrentUser,
}: AutomationExpertiseEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    automationServices: initialData.automationServices || [],
    toolsExpertise: initialData.toolsExpertise || [],
  });

  const handleSubmit = async () => {
    if (!isCurrentUser) {
      toast({
        title: "Permission Denied",
        description: "You can only edit your own profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateAgentProfileDetails({
        profileId: initialData.profileId,
        automationExpertise: {
          automationServices: formData.automationServices,
          toolsExpertise: formData.toolsExpertise,
        },
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onSave?.();
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating automation expertise:", error);
      toast({
        title: "Error",
        description: "Failed to update automation expertise",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Edit Automation Expertise"
      description="Edit your automation services and tools expertise"
    >
      <div className="space-y-8 p-2">
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <Zap className="inline-block mr-2 h-5 w-5 text-violet-400" />
              Automation Services
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AGENT_AUTOMATION_SERVICES.map((service) => {
                const info = getAutomationServiceInfo(service.value);
                return (
                  <div
                    key={service.value}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      formData.automationServices.includes(service.value)
                        ? "bg-violet-500/20 border-violet-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    onClick={() => {
                      const newServices = formData.automationServices.includes(
                        service.value
                      )
                        ? formData.automationServices.filter(
                            (s) => s !== service.value
                          )
                        : [...formData.automationServices, service.value];
                      setFormData({
                        ...formData,
                        automationServices: newServices,
                      });
                    }}
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
              Tools Expertise
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AGENT_TOOLS_EXPERTISE.map((tool) => {
                const info = getToolsExpertiseInfo(tool.value);
                return (
                  <div
                    key={tool.value}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      formData.toolsExpertise.includes(tool.value)
                        ? "bg-indigo-500/20 border-indigo-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    onClick={() => {
                      const newTools = formData.toolsExpertise.includes(
                        tool.value
                      )
                        ? formData.toolsExpertise.filter(
                            (t) => t !== tool.value
                          )
                        : [...formData.toolsExpertise, tool.value];
                      setFormData({
                        ...formData,
                        toolsExpertise: newTools,
                      });
                    }}
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
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
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
