"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";

export interface ClientProject {
  _id: string;
  title: string;
  description: string;
  automationTool: string;
  businessDomain: string;
  technology: string[];
  painPoints: string;
  budgetRange: string;
  timeline: string;
  projectComplexity: string;
  engagementType: string;
  teamSize: string;
  experienceLevel: string;
  priority: string;
  startDate: string;
  status: string;
  assignedAgents?: {
    _id: string;
    personalDetails: {
      username: string;
      profilePicture?: {
        asset: {
          url: string;
        };
      };
    };
  }[];
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export function useClientProjects() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all client projects
  const fetchAllProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const projectsData = await client.fetch<ClientProject[]>(
        `*[_type == "clientProject"] {
          _id,
          title,
          description,
          automationTool,
          businessDomain,
          technology,
          painPoints,
          budgetRange,
          timeline,
          complexity as projectComplexity,
          engagementType,
          teamSize,
          experienceLevel,
          priority,
          startDate,
          status,
          assignedAgents[]-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          }
        } | order(priority desc, startDate desc)`
      );

      setProjects(projectsData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch projects")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects by status
  const fetchProjectsByStatus = async (status: string) => {
    try {
      const projectsData = await client.fetch<ClientProject[]>(
        `*[_type == "clientProject" && status == $status] {
          _id,
          title,
          description,
          automationTool,
          businessDomain,
          technology,
          painPoints,
          budgetRange,
          timeline,
          complexity as projectComplexity,
          engagementType,
          teamSize,
          experienceLevel,
          priority,
          startDate,
          status,
          assignedAgents[]-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          }
        } | order(priority desc, startDate desc)`,
        { status }
      );
      return projectsData;
    } catch (err) {
      console.error("Failed to fetch projects by status:", err);
      return [];
    }
  };

  // Fetch projects by priority
  const fetchProjectsByPriority = async (priority: string) => {
    try {
      const projectsData = await client.fetch<ClientProject[]>(
        `*[_type == "clientProject" && priority == $priority] {
          _id,
          title,
          description,
          automationTool,
          businessDomain,
          technology,
          painPoints,
          budgetRange,
          timeline,
          complexity as projectComplexity,
          engagementType,
          teamSize,
          experienceLevel,
          priority,
          startDate,
          status,
          assignedAgents[]-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          }
        } | order(startDate desc)`,
        { priority }
      );
      return projectsData;
    } catch (err) {
      console.error("Failed to fetch projects by priority:", err);
      return [];
    }
  };

  // Fetch a single project by ID
  const fetchProjectById = async (projectId: string) => {
    try {
      const project = await client.fetch<ClientProject>(
        `*[_type == "clientProject" && _id == $projectId][0] {
          _id,
          title,
          description,
          automationTool,
          businessDomain,
          technology,
          painPoints,
          budgetRange,
          timeline,
          complexity as projectComplexity,
          engagementType,
          teamSize,
          experienceLevel,
          priority,
          startDate,
          status,
          assignedAgents[]-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          }
        }`,
        { projectId }
      );
      return project;
    } catch (err) {
      console.error("Failed to fetch project:", err);
      return null;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAllProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchAllProjects,
    fetchProjectsByStatus,
    fetchProjectsByPriority,
    fetchProjectById,
  };
}
