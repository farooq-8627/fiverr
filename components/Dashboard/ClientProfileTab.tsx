import React, { useMemo } from "react";
import { ClientProfile } from "@/types/index";
import { ClientAutomationCard } from "./ProfileCards/ClientProfile/ClientAutomatinCard";
import { ClientProjectCard } from "@/components/Dashboard/ProfileCards/ClientProfile/ClientProjectCard";
import { RequirementsCard } from "@/components/Dashboard/ProfileCards/ClientProfile/RequirementsCard";

interface ClientProfileTabProps {
  profiles: ClientProfile[];
  isCurrentUser?: boolean;
}

function ClientProfileTabContent({
  profiles,
  isCurrentUser,
}: ClientProfileTabProps) {
  // Memoize the profile and derived data
  const profileData = useMemo(() => {
    if (!profiles?.length) return null;

    const profile = profiles[0];

    return {
      profile,
      automationNeeds: {
        automationRequirements:
          profile.automationNeeds.automationRequirements || [],
        currentTools: profile.automationNeeds.currentTools || [],
      },
      mustHaveRequirements: profile.mustHaveRequirements || {
        experience: "",
        dealBreakers: [],
        industryDomain: [],
        requirements: [],
        customIndustry: [],
      },
      projects: profile.projects || [],
    };
  }, [profiles]);

  // Memoize the current user flag
  const currentUserFlag = useMemo(
    () => isCurrentUser ?? false,
    [isCurrentUser]
  );

  if (!profileData) {
    return (
      <div className="text-center py-8 min-h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">No client profiles found.</p>
      </div>
    );
  }

  const { profile, automationNeeds, mustHaveRequirements, projects } =
    profileData;

  return (
    <div className="space-y-4">
      <ClientAutomationCard
        automationNeeds={automationNeeds}
        isCurrentUser={currentUserFlag}
        profileId={profile._id}
      />

      <ClientProjectCard
        projects={projects}
        isCurrentUser={currentUserFlag}
        profileId={profile._id}
      />

      <RequirementsCard
        mustHaveRequirements={mustHaveRequirements}
        isCurrentUser={currentUserFlag}
        profileId={profile._id}
      />
    </div>
  );
}

// Memoize the entire component to prevent unnecessary re-renders
export const ClientProfileTab = React.memo(ClientProfileTabContent);
