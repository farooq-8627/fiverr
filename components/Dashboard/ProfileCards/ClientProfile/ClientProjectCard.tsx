"use client";
import { useState } from "react";
import { GlassCard } from "@/components/UI/GlassCard";
import { Button } from "@/components/UI/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { ClientProject } from "@/types/index";
import {
  updateClientProfileDetails,
  deleteClientProject,
  createClientProject,
} from "@/app/onboarding/client-profile/actions";
import { useToast } from "@/hooks/useToast";
import { CreateClientProjectModal } from "./CreateClientProjectModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Badge } from "@/components/UI/badge";
import { GlassModal } from "@/components/UI/GlassModal";
import { ClientProjectCardModal } from "@/components/cards/ClientProjectCardModal";
import { ClientProjectEditModal } from "../../Edit/ClientProfile/ClientProjectEditModal";
import { PROJECT_STATUSES } from "@/sanity/schemaTypes/constants";

interface ClientProjectCardProps {
  projects: ClientProject[];
  isCurrentUser: boolean;
  profileId: string;
}

interface ProjectItemProps {
  project: ClientProject;
  isCurrentUser: boolean;
  onDelete: (projectId: string) => Promise<void>;
  className?: string;
  onUpdate: (project: ClientProject) => Promise<void>;
}

const ProjectCard = ({
  title,
  description,
  businessDomain,
  status,
  priority,
  experienceLevel,
}: ClientProject) => {
  const getTitleFromValue = (value: string | undefined): string => {
    if (!value) return "Not specified";
    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Determine which badges to show based on priority rules
  const badges = [];

  // Priority 1: Status (only if Open for Proposals)
  if (status === "openProposals") {
    badges.push({
      label: "Status",
      value: "Open for Proposals",
      className: "bg-green-500/10 text-green-200",
    });
  }

  // Priority 2: Domain (always show)
  if (businessDomain) {
    badges.push({
      label: "Domain",
      value: getTitleFromValue(businessDomain),
      className: "bg-violet-500/10 text-violet-200",
    });
  }

  if (priority) {
    badges.push({
      label: "Priority",
      value: getTitleFromValue(priority),
      className: "bg-violet-500/10 text-violet-200",
    });
  }
  // Priority 3 & 4: Priority or Experience Level (if status not showing)
  if (status !== "openProposals") {
    if (experienceLevel) {
      badges.push({
        label: "Required Experience",
        value: getTitleFromValue(experienceLevel),
        className: "bg-violet-500/10 text-violet-200",
      });
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-violet-50 mb-2">{title}</h3>
        <div className="h-[60px] mb-2">
          <p className="text-sm text-violet-200/90 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Badges Stack */}
      <div className="space-y-2">
        {badges.slice(0, 3).map((badge, index) => (
          <div
            key={index}
            className={`flex items-center px-3 py-1.5 rounded-lg ${badge.className} w-full overflow-hidden`}
          >
            <span className="text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="opacity-75 mr-2">{badge.label}:</span>
              {badge.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function ProjectItem({
  project,
  isCurrentUser,
  onDelete,
  className = "",
  profileId,
  onUpdate,
}: ProjectItemProps & { profileId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div
        className={`bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="space-y-2">
          <ProjectCard {...project} />

          {/* Actions */}
          {isCurrentUser && (
            <div
              className="flex justify-end gap-2 mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-full hover:bg-purple-500/20"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(project._id)}
                className="p-2 rounded-full hover:bg-red-500/20"
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
      >
        <ClientProjectCardModal
          project={project}
          className="bg-transparent shadow-none"
        />
      </GlassModal>

      <ClientProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        profileId={profileId}
        onUpdate={onUpdate}
      />
    </>
  );
}

export function ClientProjectCard({
  projects,
  isCurrentUser,
  profileId,
}: ClientProjectCardProps) {
  const { toast } = useToast();
  const [currentProjects, setCurrentProjects] = useState(
    projects?.filter(
      (project): project is ClientProject =>
        project !== null && typeof project === "object" && "_id" in project
    ) || []
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleProjectDelete = async (projectId: string) => {
    try {
      const response = await deleteClientProject(profileId, projectId);

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

  const handleProjectCreated = async (newProject: ClientProject) => {
    try {
      if (!newProject?._id) {
        throw new Error("Invalid project data");
      }
      // Add new project at the beginning of the list
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

  const handleProjectUpdate = async (updatedProject: ClientProject) => {
    try {
      if (!updatedProject?._id) {
        throw new Error("Invalid project data");
      }
      setCurrentProjects((prev) =>
        prev.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
      toast({
        title: "Success",
        description: "Project updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project.",
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
          <div className="flex gap-4 min-w-min">
            {currentProjects.map((project) =>
              project && project._id ? (
                <ProjectItem
                  key={project._id}
                  project={project}
                  isCurrentUser={isCurrentUser}
                  onDelete={handleProjectDelete}
                  className="w-[280px] sm:w-[320px] flex-shrink-0"
                  profileId={profileId}
                  onUpdate={handleProjectUpdate}
                />
              ) : null
            )}
          </div>
        </div>
      </div>

      <CreateClientProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        profileId={profileId}
      />
    </GlassCard>
  );
}
