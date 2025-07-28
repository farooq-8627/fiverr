"use client";

import { useState, useCallback } from "react";
import { AgentCard } from "@/components/cards/AgentCard";
import { useAgentProfiles, AgentWithProfile } from "@/hooks/useAgentProfiles";
import { ProfilesPageLayout } from "@/components/shared/ProfilesPageLayout";
import { FilterState } from "@/types/filters";

export default function AgentsPage() {
  const [filters, setFilters] = useState<FilterState>({});
  const [search, setSearch] = useState("");

  const {
    data: agents,
    loading,
    error,
  } = useAgentProfiles({
    filters,
    search,
  });

  const handleFiltersChange = useCallback(
    (newFilters: FilterState, searchQuery: string) => {
      setFilters(newFilters);
      setSearch(searchQuery);
    },
    []
  );

  return (
    <ProfilesPageLayout
      title="Automation Agents"
      subtitle="Connect with skilled automation experts who can transform your business processes and boost efficiency through cutting-edge solutions."
      data={agents || []}
      loading={loading}
      error={error}
      entityType="agent"
      renderCard={(agent: AgentWithProfile) => (
        <AgentCard
          key={agent.userProfile._id}
          userProfile={agent.userProfile}
          agentProfile={agent.agentProfile}
        />
      )}
      emptyStateMessage="No automation agents found"
      onFiltersChange={handleFiltersChange}
    />
  );
}
