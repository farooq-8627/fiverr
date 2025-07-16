import React, { useState } from "react";
import { GlassModal } from "../../UI/GlassModal";
import { Button } from "../../UI/button";
import { Label } from "../../UI/label";
import { Zap, Wrench } from "lucide-react";
import { updateAgentProfileAutomation } from "@/app/onboarding/agent-profile/actions";
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
    skills: string[];
    automationTools: string[];
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
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialData.skills || []
  );
  const [selectedTools, setSelectedTools] = useState<string[]>(
    initialData.automationTools || []
  );

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleToolToggle = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

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
      const result = await updateAgentProfileAutomation({
        profileId: initialData.profileId,
        skills: selectedSkills,
        automationTools: selectedTools,
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
      className=""
    >
      <div className="space-y-8 p-2">
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-4 flex items-center text-violet-200">
              <Zap className="inline-block mr-2 h-5 w-5 text-violet-400" />
              Automation Services
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {AGENT_AUTOMATION_SERVICES.map((service) => {
                const info = getAutomationServiceInfo(service.value);
                const isSelected = selectedSkills.includes(service.value);
                return (
                  <Button
                    key={service.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={`justify-start px-3 py-2 w-full ${
                      isSelected
                        ? "bg-violet-600 hover:bg-violet-700 text-white"
                        : "bg-violet-950/50 hover:bg-violet-900/50 border-violet-700/50 text-violet-200"
                    } transition-all duration-200`}
                    onClick={() => handleSkillToggle(service.value)}
                  >
                    <info.icon
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? "text-violet-200" : "text-violet-400"
                      }`}
                    />
                    {service.title}
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 flex items-center text-violet-200">
              <Wrench className="inline-block mr-2 h-5 w-5 text-violet-400" />
              Tools Expertise
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {AGENT_TOOLS_EXPERTISE.map((tool) => {
                const info = getToolsExpertiseInfo(tool.value);
                const isSelected = selectedTools.includes(tool.value);
                return (
                  <Button
                    key={tool.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={`justify-start px-3 py-2 w-full ${
                      isSelected
                        ? "bg-violet-600 hover:bg-violet-700 text-white"
                        : "bg-violet-950/50 hover:bg-violet-900/50 border-violet-700/50 text-violet-200"
                    } transition-all duration-200`}
                    onClick={() => handleToolToggle(tool.value)}
                  >
                    <info.icon
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? "text-violet-200" : "text-violet-400"
                      }`}
                    />
                    {tool.title}
                  </Button>
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
