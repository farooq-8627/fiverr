import React, { useState } from "react";
import { AgentProfile } from "@/types/index";
import { GlassCard } from "@/components/UI/GlassCard";
import { GroupedExpertise } from "@/components/UI/ExpertiseCard";
import {
  getAutomationServiceInfo,
  getToolsExpertiseInfo,
  groupExpertiseByCategory,
} from "@/lib/expertise-utils";
import { Button } from "@/components/UI/button";
import { Pencil } from "lucide-react";
import { AutomationExpertiseEditModal } from "./Edit/AutomationExpertiseEditModal";
import { updateAgentProfileAutomation } from "@/app/onboarding/agent-profile/actions";
import { toast } from "sonner";

interface AgentProfileTabProps {
  profiles: AgentProfile[];
  isCurrentUser?: boolean;
}

export function AgentProfileTab({
  profiles: initialProfiles,
  isCurrentUser,
}: AgentProfileTabProps) {
  const [profiles, setProfiles] = useState<AgentProfile[]>(initialProfiles);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AgentProfile | null>(
    null
  );

  if (!profiles?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No agent profiles found.</p>
      </div>
    );
  }

  const handleOpenEditModal = (profile: AgentProfile) => {
    setSelectedProfile(profile);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProfile(null);
  };

  const handleSaveExpertise = async (data: any, profileId: string) => {
    try {
      // Show loading toast
      toast.loading("Updating automation expertise...");

      // Call the server action to update the profile
      const result = await updateAgentProfileAutomation({
        profileId,
        skills: data.skills,
        automationTools: data.automationTools,
      });

      if (result.success) {
        // Update local state immediately
        setProfiles((currentProfiles) =>
          currentProfiles.map((profile) =>
            profile._id === profileId
              ? {
                  ...profile,
                  automationExpertise: {
                    ...profile.automationExpertise,
                    automationServices: data.skills,
                    toolsExpertise: data.automationTools,
                    customAutomationServices: data.customSkills,
                    customToolsExpertise: data.customTools,
                  },
                }
              : profile
          )
        );

        toast.success(result.message);
        handleCloseEditModal();
      } else {
        toast.error(result.message || "Failed to update automation expertise");
      }
    } catch (error) {
      console.error("Error updating automation expertise:", error);
      toast.error("An error occurred while updating automation expertise");
    }
  };

  return (
    <div className="space-y-6">
      {profiles.map((profile) => (
        <div key={profile._id} className="space-y-6">
          {/* Automation Expertise */}
          <GlassCard>
            <div className="px-6 py-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Automation Expertise</h2>
                {isCurrentUser && (
                  <Button
                    onClick={() => handleOpenEditModal(profile)}
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
                    ...profile.automationExpertise.automationServices,
                    ...(profile.automationExpertise.customAutomationServices ||
                      []),
                  ],
                  getAutomationServiceInfo
                )}
              />

              {/* Tools Section */}
              <GroupedExpertise
                title="Tools & Platforms"
                groups={groupExpertiseByCategory(
                  [
                    ...profile.automationExpertise.toolsExpertise,
                    ...(profile.automationExpertise.customToolsExpertise || []),
                  ],
                  getToolsExpertiseInfo
                )}
                className="mt-8"
              />
            </div>
          </GlassCard>

          {/* Business Details */}
          <GlassCard>
            <div className="px-6 py-2">
              <h2 className="text-xl font-semibold mb-6">Business Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Pricing Model
                  </h3>
                  <p className="text-lg font-medium">
                    {profile.businessDetails.pricingModel}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Availability
                  </h3>
                  <p className="text-lg font-medium">
                    {profile.businessDetails.availability}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Work Type
                  </h3>
                  <p className="text-lg font-medium">
                    {profile.businessDetails.workType}
                  </p>
                </div>
                {profile.businessDetails.teamSize && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Team Size
                    </h3>
                    <p className="text-lg font-medium">
                      {profile.businessDetails.teamSize}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <GlassCard>
              <div className="px-6 py-2">
                <h2 className="text-xl font-semibold mb-6">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project) => (
                    <div
                      key={project._id}
                      className="group relative overflow-hidden rounded-lg bg-card/50 p-6 transition-all duration-300 hover:bg-card"
                    >
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.images && project.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            {project.images.map((img, index) => (
                              <img
                                key={index}
                                src={img.image.asset.url}
                                alt={img.alt}
                                className="rounded-md w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      ))}

      {/* Edit Modal */}
      {selectedProfile && (
        <AutomationExpertiseEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={() => {
            handleSaveExpertise(
              {
                skills: selectedProfile.automationExpertise.automationServices,
                automationTools:
                  selectedProfile.automationExpertise.toolsExpertise,
                customSkills:
                  selectedProfile.automationExpertise.customAutomationServices,
                customTools:
                  selectedProfile.automationExpertise.customToolsExpertise,
              },
              selectedProfile._id
            );
          }}
          initialData={{
            profileId: selectedProfile._id,
            skills: selectedProfile.automationExpertise.automationServices,
            automationTools: selectedProfile.automationExpertise.toolsExpertise,
          }}
          isCurrentUser={isCurrentUser ?? false}
        />
      )}
    </div>
  );
}
