import { GlassModal } from "@/components/UI/GlassModal";
import { Badge } from "@/components/UI/badge";
import { ClientProject } from "@/types";
import { cn } from "@/lib/utils";
import {
  Building2,
  Calendar,
  Clock,
  Scale,
  Users,
  Briefcase,
  Brain,
  AlertCircle,
} from "lucide-react";

interface ClientProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ClientProject;
}

export function ClientProjectViewModal({
  isOpen,
  onClose,
  project,
}: ClientProjectViewModalProps) {
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

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={project.title}
      size="lg"
    >
      <div className="space-y-6">
        {/* Status and Priority */}
        <div className="flex items-center justify-between">
          <Badge className={cn("text-sm", getStatusColor(project.status))}>
            {project.status}
          </Badge>
          <Badge className={cn("text-sm", getPriorityColor(project.priority))}>
            {project.priority}
          </Badge>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-violet-200">Description</h3>
          <p className="text-sm text-gray-400">{project.description}</p>
        </div>

        {/* Pain Points */}
        {project.painPoints && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-violet-200">Pain Points</h3>
            <p className="text-sm text-gray-400">{project.painPoints}</p>
          </div>
        )}

        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Building2 className="w-4 h-4" />
              <span>Domain: {project.businessDomain}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>Team Size: {project.teamSize}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Timeline: {project.timeline}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Scale className="w-4 h-4" />
              <span>Budget: {project.budgetRange}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Briefcase className="w-4 h-4" />
              <span>Engagement: {project.engagementType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Brain className="w-4 h-4" />
              <span>Experience: {project.experienceLevel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <AlertCircle className="w-4 h-4" />
              <span>Complexity: {project.complexity}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="pt-4 border-t border-violet-800/30 text-xs text-gray-500">
          <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(project.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </GlassModal>
  );
}
