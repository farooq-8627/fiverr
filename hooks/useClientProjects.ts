"use client";
import { useState, useEffect } from "react";
import { ClientProject } from "@/types";
import { client } from "@/sanity/lib/client";

export function useClientProjects() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const projectsData = await client.fetch<ClientProject[]>(
        `*[_type == "clientProject"] {
          _id,
          title,
          description,
          businessDomain,
          painPoints,
          budgetRange,
          timeline,
          complexity,
          engagementType,
          teamSize,
          experienceLevel,
          startDate,
          priority,
          status,
          createdAt,
          updatedAt
        } | order(createdAt desc)`
      );

      console.log("Fetched projects:", projectsData); // Debug log
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, isLoading, error, refetch: fetchProjects };
}
