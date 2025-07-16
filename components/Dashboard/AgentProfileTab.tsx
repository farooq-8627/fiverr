import React, { useState } from "react";
import { AgentProfile } from "@/types/index";
import { AutomationExpertiseCard } from "@/components/Dashboard/AutomationExpertiseCard";
import BussinessCard from "@/components/Dashboard/BusinessDetailsCard";
import { useToast } from "@/hooks/useToast";

interface AgentProfileTabProps {
  profiles: AgentProfile[];
  isCurrentUser?: boolean;
  onProfileUpdate?: () => Promise<void>;
}

export function AgentProfileTab({
  profiles,
  isCurrentUser,
  onProfileUpdate,
}: AgentProfileTabProps) {
  const { toast } = useToast();
  const [localProfile, setLocalProfile] = useState(profiles[0]);

  if (!profiles?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No agent profiles found.</p>
      </div>
    );
  }

  const handleAutomationExpertiseUpdate = (data: {
    automationServices: string[];
    toolsExpertise: string[];
  }) => {
    // Update local state immediately
    setLocalProfile((prev) => ({
      ...prev,
      automationExpertise: {
        ...prev.automationExpertise,
        automationServices: data.automationServices,
        toolsExpertise: data.toolsExpertise,
      },
    }));

    // Update backend in parallel
    onProfileUpdate?.().catch((error) => {
      console.error("Failed to update profile in backend:", error);
      toast({
        title: "Warning",
        description: "Changes saved locally but failed to sync with server",
        variant: "destructive",
      });
    });
  };

  const handleBusinessDetailsUpdate = (data: {
    pricingModel?: string;
    availability?: string;
    workType?: string;
    teamSize?: string;
    projectSizePreferences?: string[];
  }) => {
    // Update local state immediately
    setLocalProfile((prev) => ({
      ...prev,
      businessDetails: {
        ...prev.businessDetails,
        ...data,
      },
    }));

    // Update backend in parallel
    onProfileUpdate?.().catch((error) => {
      console.error("Failed to update profile in backend:", error);
      toast({
        title: "Warning",
        description: "Changes saved locally but failed to sync with server",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-6">
      <AutomationExpertiseCard
        automationExpertise={localProfile.automationExpertise}
        isCurrentUser={isCurrentUser ?? false}
        profileId={localProfile._id}
        onExpertiseUpdate={handleAutomationExpertiseUpdate}
      />

      <BussinessCard
        businessDetails={localProfile.businessDetails}
        isCurrentUser={isCurrentUser ?? false}
        profileId={localProfile._id}
        onBusinessUpdate={handleBusinessDetailsUpdate}
      />
    </div>
  );
}
