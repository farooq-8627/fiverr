import React, { useMemo } from "react";
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

function AgentProfileTabContent({
  profiles,
  isCurrentUser,
}: AgentProfileTabProps) {
  // Memoize the profile and derived data
  const profileData = useMemo(() => {
    if (!profiles?.length) return null;

    const profile = profiles[0];

    return {
      profile,
      availability: {
        currentStatus: profile.availability?.currentStatus || "availableNow",
        workingHours: profile.availability?.workingHours || "fullTime",
        timeZone:
          profile.availability?.timeZone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        responseTime: profile.availability?.responseTime || "sameDay",
        availabilityHours:
          profile.availability?.availabilityHours || "businessHours",
      },
      pricing: profile.pricing || {
        hourlyRateRange: "",
        minimumProjectBudget: "",
        preferredPaymentMethods: [],
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
        <p className="text-muted-foreground">No agent profiles found.</p>
      </div>
    );
  }

  const { profile, availability, pricing, mustHaveRequirements, projects } =
    profileData;

  return (
    <div className="space-y-4">
      <AgentAutomationCard
        automationExpertise={profile.automationExpertise}
        isCurrentUser={currentUserFlag}
        profileId={profile._id}
      />

      <BusinessCard
        businessDetails={profile.businessDetails}
        isCurrentUser={currentUserFlag}
        profileId={profile._id}
      />

      <AvailabilityCard
        availability={availability}
        isCurrentUser={currentUserFlag}
        profileId={profile._id}
      />

      <AgentProjectCard
        projects={projects}
        isCurrentUser={currentUserFlag}
        profileId={profile._id}
      />

      <PricingCard
        pricing={pricing}
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
export const AgentProfileTab = React.memo(AgentProfileTabContent);
