import { useState, useEffect, useCallback } from "react";
import { client } from "@/sanity/lib/client";
import { FilterState } from "@/types/filters";

export interface CompanyProfile {
  _id: string;
  name: string;
  tagline?: string;
  bio?: string;
  website?: string;
  teamSize?: string;
  industries?: string[];
  customIndustries?: string[];
  companyType: "agent" | "client";
  logo?: {
    asset: {
      url: string;
    };
  };
  banner?: {
    asset: {
      url: string;
    };
  };
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UseCompanyProfilesOptions {
  filters?: FilterState;
  search?: string;
  companyType?: "agent" | "client" | "all";
}

export interface UseCompanyProfilesResponse {
  data: CompanyProfile[] | null;
  loading: boolean;
  error: string | null;
}

export function useCompanyProfiles({
  filters = {},
  search = "",
  companyType = "all",
}: UseCompanyProfilesOptions = {}): UseCompanyProfilesResponse {
  const [data, setData] = useState<CompanyProfile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildQuery = useCallback(() => {
    let baseQuery = `*[_type == "company"`;
    const conditions = [];

    // Company type filter
    if (companyType !== "all") {
      conditions.push(`companyType == "${companyType}"`);
    }

    // Search filter
    if (search.trim()) {
      const searchTerm = search.trim();
      conditions.push(`(
        name match "*${searchTerm}*" ||
        bio match "*${searchTerm}*" ||
        website match "*${searchTerm}*"
      )`);
    }

    // Industry filters
    if (filters.industries && filters.industries.length > 0) {
      const industryConditions = filters.industries.map(
        (industry: string) => `"${industry}" in industries[]`
      );
      conditions.push(`(${industryConditions.join(" || ")})`);
    }

    // Team size filters
    if (filters.teamSizes && filters.teamSizes.length > 0) {
      const teamSizeConditions = filters.teamSizes.map(
        (size: string) => `teamSize == "${size}"`
      );
      conditions.push(`(${teamSizeConditions.join(" || ")})`);
    }

    // Location filters
    if (filters.locations && filters.locations.length > 0) {
      // This would need to be implemented if location is added to company schema
      console.log("Location filters not yet implemented for companies");
    }

    // Add all conditions to query
    if (conditions.length > 0) {
      baseQuery += ` && ${conditions.join(" && ")}`;
    }

    baseQuery += `] | order(createdAt desc) {
      _id,
      name,
      tagline,
      bio,
      website,
      teamSize,
      industries,
      customIndustries,
      companyType,
      logo {
        asset-> {
          url
        }
      },
      banner {
        asset-> {
          url
        }
      },
      "createdBy": createdBy->clerkId,
      createdAt,
      updatedAt
    }`;

    return baseQuery;
  }, [filters, search, companyType]);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query = buildQuery();
      console.log("Executing company query:", query);

      const result = await client.fetch<CompanyProfile[]>(query);
      console.log("Company query result:", result);

      setData(result || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch companies"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    data,
    loading,
    error,
  };
}
