"use client";
import { useState } from "react";
import { GlassCard } from "@/components/UI/GlassCard";
import { Button } from "@/components/UI/button";
import { Pencil, Plus } from "lucide-react";
import { AgentProject } from "@/types/index";
import { AgentProjectCard as AgentProjectCardComponent } from "@/components/cards/AgentProjectCard";
import {
  updateAgentProject,
  deleteAgentProject,
} from "@/app/onboarding/agent-profile/actions";
import { useToast } from "@/hooks/useToast";
import { CreateProjectModal } from "./CreateProjectModal";

interface AgentProjectCardProps {
  projects: AgentProject[];
  isCurrentUser: boolean;
  profileId: string;
}

export function AgentProjectCard({
  projects,
  isCurrentUser,
  profileId,
}: AgentProjectCardProps) {
  const { toast } = useToast();
  const [currentProjects, setCurrentProjects] = useState(projects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleProjectUpdate = async (updatedProject: AgentProject) => {
    try {
      const response = await updateAgentProject({
        profileId,
        project: updatedProject,
      });

      if (response.success) {
        setCurrentProjects((prev) =>
          prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
        );
        toast({
          title: "Success",
          description: "Project updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
      const response = await deleteAgentProject(projectId);

      if (response.success) {
        setCurrentProjects((prev) => prev.filter((p) => p._id !== projectId));
        toast({
          title: "Success",
          description: "Project deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the project.",
        variant: "destructive",
      });
    }
  };

  const handleProjectCreated = async (newProject: AgentProject) => {
    try {
      // Add the new project to the current projects list
      setCurrentProjects((prev) => [...prev, newProject]);

      toast({
        title: "Success",
        description: "Project created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive",
      });
    }
  };

  return (
    <GlassCard>
      <div className="md:px-6 py-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Projects</h2>
          {isCurrentUser && (
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <AgentProjectCardComponent
              key={project._id}
              isCurrentUser={isCurrentUser}
              project={project}
              onUpdate={handleProjectUpdate}
              onDelete={handleProjectDelete}
            />
          ))}
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        profileId={profileId}
      />
    </GlassCard>
  );
}
