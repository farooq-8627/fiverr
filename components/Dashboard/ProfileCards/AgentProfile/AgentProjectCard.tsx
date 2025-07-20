"use client";
import { useState } from "react";
import { GlassCard } from "@/components/UI/GlassCard";
import { Button } from "@/components/UI/button";
import { Pencil, Plus } from "lucide-react";
import { AgentProject } from "@/types/index";
import { AgentProjectCard as AgentProjectCardComponent } from "@/components/cards/AgentProjectCardModal";
import {
  updateAgentProject,
  deleteAgentProject,
} from "@/app/onboarding/agent-profile/actions";
import { useToast } from "@/hooks/useToast";
import { CreateAgentProjectModal } from "./CreateAgentProjectModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

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
      setCurrentProjects((prev) => [newProject, ...prev]);

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="relative overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex min-w-min">
            {currentProjects.map((project) => (
              <AgentProjectCardComponent
                key={project._id}
                isCurrentUser={isCurrentUser}
                project={project}
                onUpdate={handleProjectUpdate}
                onDelete={handleProjectDelete}
                className="w-[280px] sm:w-[320px] flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      <CreateAgentProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        profileId={profileId}
      />
    </GlassCard>
  );
}
