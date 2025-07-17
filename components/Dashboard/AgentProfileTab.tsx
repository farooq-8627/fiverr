import React from "react";
import { AgentProfile } from "@/types/index";
import { AutomationCard } from "@/components/Dashboard/ProfileCards/AutomationCard";
import BusinessCard from "@/components/Dashboard/ProfileCards/BusinessCard";
import { AvailabilityCard } from "@/components/Dashboard/ProfileCards/AvailabilityCard";
import { useToast } from "@/hooks/useToast";
import { AgentProjectCard } from "./ProfileCards/AgentProjectCard";

interface AgentProfileTabProps {
  profiles: AgentProfile[];
  isCurrentUser?: boolean;
}

export function AgentProfileTab({
  profiles,
  isCurrentUser,
}: AgentProfileTabProps) {
  if (!profiles?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No agent profiles found.</p>
      </div>
    );
  }

  const profile = profiles[0];

  return (
    <div className="space-y-4">
      <AutomationCard
        automationExpertise={profile.automationExpertise}
        isCurrentUser={isCurrentUser ?? false}
        profileId={profile._id}
      />

      <BusinessCard
        businessDetails={profile.businessDetails}
        isCurrentUser={isCurrentUser ?? false}
        profileId={profile._id}
      />

      <AvailabilityCard
        availability={{
          currentStatus: profile.availability?.currentStatus || "availableNow",
          workingHours: profile.availability?.workingHours || "fullTime",
          timeZone:
            profile.availability?.timeZone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          responseTime: profile.availability?.responseTime || "sameDay",
          availabilityHours:
            profile.availability?.availabilityHours || "businessHours",
        }}
        isCurrentUser={isCurrentUser ?? false}
        profileId={profile._id}
      />

      <AgentProjectCard
        projects={profile.projects || []}
        isCurrentUser={isCurrentUser ?? false}
        profileId={profile._id}
      />
    </div>
  );
}
