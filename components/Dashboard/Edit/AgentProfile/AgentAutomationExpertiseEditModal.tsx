import React, { useState } from "react";
import { AutomationExpertiseForm } from "@/components/Dashboard/Edit/AgentProfile/AutomationExpertiseForm";
import { useToast } from "@/hooks/useToast";
import { updateAgentProfileDetails } from "@/app/onboarding/agent-profile/actions";

interface AgentAutomationExpertiseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    profileId: string;
    automationServices: string[];
    toolsExpertise: string[];
  };
  isCurrentUser: boolean;
  title?: string;
  updateFunction?: (data: any) => Promise<any>;
  onExpertiseUpdate: (data: {
    automationServices: string[];
    toolsExpertise: string[];
  }) => void;
}

export function AgentAutomationExpertiseEditModal({
  isOpen,
  onClose,
  initialData,
  isCurrentUser,
  onExpertiseUpdate,
  title = "Edit Automation Expertise",
  updateFunction,
}: AgentAutomationExpertiseEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    automationServices: initialData.automationServices || [],
    toolsExpertise: initialData.toolsExpertise || [],
  });

  const handleAutomationServiceChange = (service: string) => {
    const newServices = formData.automationServices.includes(service)
      ? formData.automationServices.filter((s) => s !== service)
      : [...formData.automationServices, service];
    setFormData({
      ...formData,
      automationServices: newServices,
    });
  };

  const handleToolExpertiseChange = (tool: string) => {
    const newTools = formData.toolsExpertise.includes(tool)
      ? formData.toolsExpertise.filter((t) => t !== tool)
      : [...formData.toolsExpertise, tool];
    setFormData({
      ...formData,
      toolsExpertise: newTools,
    });
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

    try {
      setIsLoading(true);

      const updateFn = updateFunction || updateAgentProfileDetails;
      const response = await updateFn({
        profileId: initialData.profileId,
        automationExpertise: {
          automationServices: formData.automationServices,
          toolsExpertise: formData.toolsExpertise,
        },
      });

      // Update UI immediately for instant feedback
      onExpertiseUpdate({
        automationServices: formData.automationServices,
        toolsExpertise: formData.toolsExpertise,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Automation expertise updated successfully.",
        });
        onClose();
      } else {
        // Revert the UI update if the API call fails

        toast({
          title: "Error",
          description:
            response.message || "Failed to update automation expertise.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AutomationExpertiseForm
      isOpen={isOpen}
      onClose={onClose}
      automationServices={formData.automationServices}
      toolsExpertise={formData.toolsExpertise}
      onAutomationServiceChange={handleAutomationServiceChange}
      onToolExpertiseChange={handleToolExpertiseChange}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isLoading={isLoading}
      title={title}
      userType="agent"
    />
  );
}
