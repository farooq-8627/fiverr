"use client";

import { useState, useCallback } from "react";
import { CompanyCard, CompanyProfile } from "@/components/cards/CompanyCard";
import { useCompanyProfiles } from "@/hooks/useCompanyProfiles";
import { ProfilesPageLayout } from "@/components/shared/ProfilesPageLayout";
import { FilterState } from "@/types/filters";

export default function CompaniesPage() {
  const [filters, setFilters] = useState<FilterState>({});
  const [search, setSearch] = useState("");

  const {
    data: companies,
    loading,
    error,
  } = useCompanyProfiles({
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
      title="Companies"
      subtitle="Discover innovative companies in the automation space. Connect with service providers and businesses seeking automation solutions."
      data={companies || []}
      loading={loading}
      error={error ? new Error(error) : null}
      entityType="company"
      renderCard={(company: CompanyProfile) => (
        <CompanyCard key={company._id} company={company} />
      )}
      emptyStateMessage="No companies found"
      onFiltersChange={handleFiltersChange}
    />
  );
}
