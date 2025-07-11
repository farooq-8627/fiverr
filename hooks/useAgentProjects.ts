"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";

export interface AgentProject {
  _id: string;
  title: string;
  description: string;
  projectLink: string;
  technologies: string[];
  images: {
    image: {
      asset: {
        url: string;
      };
    };
    alt: string;
  }[];
  clientReference?: {
    _id: string;
    personalDetails: {
      username: string;
      profilePicture?: {
        asset: {
          url: string;
        };
      };
    };
  };
  testimonial?: string;
  completionDate: string;
  status: string;
  isPortfolioProject: boolean;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

export function useAgentProjects() {
  const [projects, setProjects] = useState<AgentProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all agent projects
  const fetchAllProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const projectsData = await client.fetch<AgentProject[]>(
        `*[_type == "agentProject"] {
          _id,
          title,
          description,
          projectLink,
          technologies,
          images[] {
            image {
              asset-> {
                url
              }
            },
            alt
          },
          clientReference-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          },
          testimonial,
          completionDate,
          status,
          isPortfolioProject
        } | order(completionDate desc)`
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

  // Fetch portfolio projects only
  const fetchPortfolioProjects = async () => {
    try {
      const projectsData = await client.fetch<AgentProject[]>(
        `*[_type == "agentProject" && isPortfolioProject == true] {
          _id,
          title,
          description,
          projectLink,
          technologies,
          images[] {
            image {
              asset-> {
                url
              }
            },
            alt
          },
          clientReference-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          },
          testimonial,
          completionDate,
          status,
          isPortfolioProject
        } | order(completionDate desc)`
      );
      return projectsData;
    } catch (err) {
      console.error("Failed to fetch portfolio projects:", err);
      return [];
    }
  };

  // Fetch projects by status
  const fetchProjectsByStatus = async (status: string) => {
    try {
      const projectsData = await client.fetch<AgentProject[]>(
        `*[_type == "agentProject" && status == $status] {
          _id,
          title,
          description,
          projectLink,
          technologies,
          images[] {
            image {
              asset-> {
                url
              }
            },
            alt
          },
          clientReference-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          },
          testimonial,
          completionDate,
          status,
          isPortfolioProject
        } | order(completionDate desc)`,
        { status }
      );
      return projectsData;
    } catch (err) {
      console.error("Failed to fetch projects by status:", err);
      return [];
    }
  };

  // Fetch projects by technology
  const fetchProjectsByTechnology = async (technology: string) => {
    try {
      const projectsData = await client.fetch<AgentProject[]>(
        `*[_type == "agentProject" && $technology in technologies] {
          _id,
          title,
          description,
          projectLink,
          technologies,
          images[] {
            image {
              asset-> {
                url
              }
            },
            alt
          },
          clientReference-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          },
          testimonial,
          completionDate,
          status,
          isPortfolioProject
        } | order(completionDate desc)`,
        { technology }
      );
      return projectsData;
    } catch (err) {
      console.error("Failed to fetch projects by technology:", err);
      return [];
    }
  };

  // Fetch a single project by ID
  const fetchProjectById = async (projectId: string) => {
    try {
      const project = await client.fetch<AgentProject>(
        `*[_type == "agentProject" && _id == $projectId][0] {
          _id,
          title,
          description,
          projectLink,
          technologies,
          images[] {
            image {
              asset-> {
                url
              }
            },
            alt
          },
          clientReference-> {
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            }
          },
          testimonial,
          completionDate,
          status,
          isPortfolioProject
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
    fetchPortfolioProjects,
    fetchProjectsByStatus,
    fetchProjectsByTechnology,
    fetchProjectById,
  };
}
