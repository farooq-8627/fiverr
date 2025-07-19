import React, { useState } from "react";
import { AutomationExpertiseForm } from "@/components/Dashboard/Edit/AgentProfile/AutomationExpertiseForm";
import { useToast } from "@/hooks/useToast";
import { updateClientProfileDetails } from "@/app/onboarding/client-profile/actions";

interface ClientAutomationExpertiseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    profileId: string;
    automationRequirements: string[];
    currentTools: string[];
  };
  isCurrentUser: boolean;
  title?: string;
  updateFunction?: (data: any) => Promise<any>;
  onExpertiseUpdate: (data: {
    automationRequirements: string[];
    currentTools: string[];
  }) => void;
}

export function ClientAutomationExpertiseEditModal({
  isOpen,
  onClose,
  initialData,
  isCurrentUser,
  onExpertiseUpdate,
  title = "Edit Automation Needs",
  updateFunction,
}: ClientAutomationExpertiseEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    automationRequirements: initialData.automationRequirements || [],
    currentTools: initialData.currentTools || [],
  });

  const handleAutomationServiceChange = (service: string) => {
    const newServices = formData.automationRequirements.includes(service)
      ? formData.automationRequirements.filter((s) => s !== service)
      : [...formData.automationRequirements, service];
    setFormData({
      ...formData,
      automationRequirements: newServices,
    });
  };

  const handleToolExpertiseChange = (tool: string) => {
    const newTools = formData.currentTools.includes(tool)
      ? formData.currentTools.filter((t) => t !== tool)
      : [...formData.currentTools, tool];
    setFormData({
      ...formData,
      currentTools: newTools,
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

      const response = await updateClientProfileDetails({
        profileId: initialData.profileId,
        automationNeeds: {
          automationRequirements: formData.automationRequirements,
          currentTools: formData.currentTools,
        },
      });

      // Update UI immediately for instant feedback
      onExpertiseUpdate({
        automationRequirements: formData.automationRequirements,
        currentTools: formData.currentTools,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Automation needs updated successfully.",
        });
        onClose();
      } else {
        // Revert the UI update if the API call fails

        toast({
          title: "Error",
          description: response.message || "Failed to update automation needs.",
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
      automationServices={formData.automationRequirements}
      toolsExpertise={formData.currentTools}
      onAutomationServiceChange={handleAutomationServiceChange}
      onToolExpertiseChange={handleToolExpertiseChange}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isLoading={isLoading}
      title={title}
      automationTitle="Automation Needs"
      toolsTitle="Current Tools"
      userType="client"
    />
  );
}
