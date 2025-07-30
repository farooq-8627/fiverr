"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";

// Company interfaces based on Sanity schema
export interface CompanyImage {
  asset: {
    url: string;
  };
}

export interface Company {
  _id: string;
  name: string;
  teamSize: string;
  bio: string;
  website?: string;
  logo?: CompanyImage;
  banner?: CompanyImage;
  industries: string[];
  customIndustries?: string[];
  companyType: "agent" | "client";
  createdAt: string;
  updatedAt: string;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export function useCompanyDetails(companyId?: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      if (!companyId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const companyData = await client.fetch<Company | null>(
          `
          *[_type == "company" && _id == $companyId][0] {
            _id,
            name,
            teamSize,
            bio,
            website,
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
            industries,
            customIndustries,
            companyType,
            createdAt,
            updatedAt
          }
        `,
          { companyId }
        );

        if (companyData) {
          setCompany(companyData);
        } else {
          setError(new Error("Company not found"));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch company")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, [companyId]);

  // Helper function to get all companies of a specific type
  const fetchCompaniesByType = async (type: "agent" | "client") => {
    try {
      const companies = await client.fetch<Company[]>(
        `
        *[_type == "company" && companyType == $type] {
          _id,
          name,
          teamSize,
          bio,
          website,
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
          industries,
          customIndustries,
          companyType,
          createdAt,
          updatedAt
        }
      `,
        { type }
      );
      return companies;
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      return [];
    }
  };

  // Helper function to get companies by industry
  const fetchCompaniesByIndustry = async (industry: string) => {
    try {
      const companies = await client.fetch<Company[]>(
        `
        *[_type == "company" && $industry in industries] {
          _id,
          name,
          teamSize,
          bio,
          website,
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
          industries,
          customIndustries,
          companyType,
          createdAt,
          updatedAt
        }
      `,
        { industry }
      );
      return companies;
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      return [];
    }
  };

  return {
    company,
    isLoading,
    error,
    fetchCompaniesByType,
    fetchCompaniesByIndustry,
  };
}
