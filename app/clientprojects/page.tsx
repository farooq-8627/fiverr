"use client";

import { useEffect, useState } from "react";
import { useClientProjects } from "@/hooks/useClientProjects";
import { GlassCard } from "@/components/UI/GlassCard";
import { Badge } from "@/components/UI/badge";
import { Building2, Calendar, Clock, Scale, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientProject } from "@/types";
import { ClientProjectViewModal } from "@/components/Dashboard/ProjectViewModal";

export default function ClientProjectsPage() {
  const { projects, isLoading, error } = useClientProjects();
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load projects</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inprogress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "openproposals":
        return "bg-violet-500/20 text-violet-400 border-violet-500/30";
      case "onhold":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleProjectClick = (project: ClientProject) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-violet-200 mb-6">
        Client Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <GlassCard
            key={project._id}
            className="cursor-pointer hover:bg-white/5 transition-all duration-300"
            onClick={() => handleProjectClick(project)}
          >
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-violet-200 line-clamp-1">
                  {project.title}
                </h3>
                <Badge className={cn("ml-2", getStatusColor(project.status))}>
                  {project.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span className="truncate">{project.businessDomain}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="truncate">{project.teamSize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="truncate">{project.timeline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Scale className="w-4 h-4" />
                  <span className="truncate">{project.complexity}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge className={cn(getPriorityColor(project.priority))}>
                  {project.priority}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {selectedProject && (
        <ClientProjectViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}
    </div>
  );
}
