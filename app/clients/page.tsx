"use client";

import { useState, useCallback } from "react";
import { ClientCard } from "@/components/cards/ClientCard";
import {
  useClientProfiles,
  ClientWithProfile,
} from "@/hooks/useClientProfiles";
import { ProfilesPageLayout } from "@/components/shared/ProfilesPageLayout";
import { FilterState } from "@/types/filters";

export default function ClientsPage() {
  const [filters, setFilters] = useState<FilterState>({});
  const [search, setSearch] = useState("");

  const {
    data: clients,
    loading,
    error,
  } = useClientProfiles({
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
      title="Automation Clients"
      subtitle="Discover businesses seeking automation solutions to streamline their operations and unlock new levels of productivity."
      data={clients || []}
      loading={loading}
      error={error}
      entityType="client"
      renderCard={(client: ClientWithProfile) => (
        <ClientCard
          key={client.userProfile._id}
          userProfile={client.userProfile}
          clientProfile={client.clientProfile}
        />
      )}
      emptyStateMessage="No automation clients found"
      onFiltersChange={handleFiltersChange}
    />
  );
}
