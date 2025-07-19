import React from "react";
import { ClientProfile } from "@/types/index";
import { ClientAutomationCard } from "./ProfileCards/ClientProfile/ClientAutomatinCard";
import { ClientProjectCard } from "@/components/Dashboard/ProfileCards/ClientProfile/ClientProjectCard";
import { RequirementsCard } from "@/components/Dashboard/ProfileCards/ClientProfile/RequirementsCard";

interface ClientProfileTabProps {
  profiles: ClientProfile[];
  isCurrentUser?: boolean;
}

export function ClientProfileTab({
  profiles,
  isCurrentUser,
}: ClientProfileTabProps) {
  if (!profiles?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No client profiles found.</p>
      </div>
    );
  }

  const profile = profiles[0];

  return (
    <div className="space-y-4">
      <ClientAutomationCard
        automationNeeds={{
          automationRequirements:
            profile.automationNeeds.automationRequirements || [],
          currentTools: profile.automationNeeds.currentTools || [],
        }}
        isCurrentUser={isCurrentUser ?? false}
        profileId={profile._id}
      />

      <ClientProjectCard
        projects={profile.projects || []}
        isCurrentUser={isCurrentUser ?? false}
        profileId={profile._id}
      />

      <RequirementsCard
        mustHaveRequirements={
          profile.mustHaveRequirements || {
            experience: "",
            dealBreakers: [],
            industryDomain: [],
            requirements: [],
            customIndustry: [],
          }
        }
        isCurrentUser={isCurrentUser ?? false}
        profileId={profile._id}
      />
    </div>
  );
}
