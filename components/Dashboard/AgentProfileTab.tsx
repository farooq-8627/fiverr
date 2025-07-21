import React from "react";
import { AgentProfile } from "@/types/index";
import { AgentAutomationCard } from "@/components/Dashboard/ProfileCards/AgentProfile/AgentAutomationCard";
import BusinessCard from "@/components/Dashboard/ProfileCards/AgentProfile/BusinessCard";
import { AvailabilityCard } from "@/components/Dashboard/ProfileCards/AgentProfile/AvailabilityCard";
import { AgentProjectCard } from "./ProfileCards/AgentProfile/AgentProjectCard";
import { PricingCard } from "./ProfileCards/AgentProfile/PricingCard";
import { RequirementsCard } from "./ProfileCards/AgentProfile/RequirementsCard";

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
      <AgentAutomationCard
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

      <PricingCard
        pricing={
          profile.pricing || {
            hourlyRateRange: "",
            minimumProjectBudget: "",
            preferredPaymentMethods: [],
          }
        }
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
