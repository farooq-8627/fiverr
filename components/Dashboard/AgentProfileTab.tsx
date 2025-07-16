import React from "react";
import { AgentProfile } from "@/types/index";
import { GlassCard } from "@/components/UI/GlassCard";
import { GroupedExpertise } from "@/components/Dashboard/ExpertiseCard";
import { BusinessDetailsGroup } from "@/components/Dashboard/BusinessDetailsCard";
import {
  getAutomationServiceInfo,
  getToolsExpertiseInfo,
  groupExpertiseByCategory,
} from "@/lib/expertise-utils";
import { Button } from "@/components/UI/button";
import { Pencil } from "lucide-react";
import { AutomationExpertiseEditModal } from "./Edit/AutomationExpertiseEditModal";
import { BusinessDetailsEditModal } from "./Edit/BusinessDetailsEditModal";
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
  const [isAutomationModalOpen, setIsAutomationModalOpen] =
    React.useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = React.useState(false);
  const { toast } = useToast();

  if (!profiles?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No agent profiles found.</p>
      </div>
    );
  }

  const currentProfile = profiles[0]; // Assuming we're working with the first profile
  console.log("Current profile:", currentProfile);

  const handleProfileUpdate = async () => {
    try {
      await onProfileUpdate?.();
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Automation Expertise */}
      <GlassCard>
        <div className="md:px-6 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Automation Expertise</h2>
            {isCurrentUser && (
              <Button
                onClick={() => setIsAutomationModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <Pencil className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>

          {/* Services Section */}
          <GroupedExpertise
            title="Automation Services"
            groups={groupExpertiseByCategory(
              [
                ...currentProfile.automationExpertise.automationServices,
                ...(currentProfile.automationExpertise
                  .customAutomationServices || []),
              ],
              getAutomationServiceInfo
            )}
            className="mb-8"
            type="services"
          />

          {/* Tools Section */}
          <GroupedExpertise
            title="Tools & Platforms"
            groups={groupExpertiseByCategory(
              [
                ...currentProfile.automationExpertise.toolsExpertise,
                ...(currentProfile.automationExpertise.customToolsExpertise ||
                  []),
              ],
              getToolsExpertiseInfo
            )}
            type="tools"
          />
        </div>
      </GlassCard>

      {/* Business Details */}
      <GlassCard>
        <div className="md:px-6 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Business Details</h2>
            {isCurrentUser && (
              <Button
                onClick={() => setIsBusinessModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <Pencil className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
          <BusinessDetailsGroup details={currentProfile.businessDetails} />
        </div>
      </GlassCard>

      {/* Modals */}
      <AutomationExpertiseEditModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
        initialData={{
          profileId: currentProfile._id,
          automationServices:
            currentProfile.automationExpertise.automationServices,
          toolsExpertise: currentProfile.automationExpertise.toolsExpertise,
        }}
        isCurrentUser={isCurrentUser ?? false}
        onSave={handleProfileUpdate}
      />

      <BusinessDetailsEditModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        initialData={{
          profileId: currentProfile._id,
          pricingModel: currentProfile.businessDetails.pricingModel,
          availability: currentProfile.businessDetails.availability,
          workType: currentProfile.businessDetails.workType,
          teamSize: currentProfile.businessDetails.teamSize || "",
          projectSizePreferences:
            currentProfile.businessDetails.projectSizePreferences || [],
        }}
        isCurrentUser={isCurrentUser ?? false}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}
