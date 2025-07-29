import React, { useState } from "react";
import { GlassCard } from "@/components/UI/GlassCard";
import { Badge } from "@/components/UI/badge";
import { AgentProject } from "@/types";
import { motion } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  Tag,
  CheckCircle2,
  Clock,
  PauseCircle,
  XCircle,
  Rocket,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AgentProjectModalCard } from "@/components/Dashboard/ProfileCards/AgentProfile/AgentProjectModalCard";
import { AgentProjectEditModal } from "@/components/Dashboard/Edit/AgentProfile/AgentProjectEditModal";

interface AgentProjectCardProps {
  project: AgentProject;
  onClick?: () => void;
  className?: string;
  isCurrentUser?: boolean;
  onUpdate?: (updatedProject: AgentProject) => Promise<void>;
  onDelete?: (projectId: string) => Promise<void>;
}

const statusConfig = {
  planning: {
    icon: Clock,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  inProgress: {
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  onHold: {
    icon: PauseCircle,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

export function AgentProjectCard({
  project,
  onClick,
  className,
  isCurrentUser,
  onUpdate,
  onDelete,
}: AgentProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const StatusIcon = statusConfig[project.status]?.icon || Clock;

  // Get the first valid image URL from the project
  const projectImage =
    !imageError &&
    project.images?.find((img) => img.image?.asset?.url)?.image?.asset?.url;

  const handleClick = (e: React.MouseEvent) => {
    // Don't open view modal if clicking edit button
    if ((e.target as HTMLElement).closest("button[data-edit-button]")) {
      return;
    }
    setIsModalOpen(true);
    if (onClick) onClick();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <motion.div
        onClick={handleClick}
        className={cn("cursor-pointer", className)}
      >
        <GlassCard
          padding="p-0"
          className="overflow-hidden transition-all duration-300 w-[270px]"
        >
          {/* Project Image */}
          <div className="relative h-36 sm:h-48 w-full overflow-hidden">
            {projectImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={projectImage}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition-transform duration-300"
                  sizes="(max-width: 768px) 280px, 320px"
                  onError={() => setImageError(true)}
                  priority={true}
                />
              </div>
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-purple-500/20" />
            )}
          </div>

          {/* Project Info */}
          <div className="p-4 sm:p-4 space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold line-clamp-1 group-hover:text-violet-400 transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  {project.projectLink && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Rocket className="h-4 w-4" />
                    </a>
                  )}
                  {isCurrentUser && (
                    <button
                      data-edit-button
                      onClick={handleEditClick}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-full hover:bg-blue-500/10"
                      title="Edit Project"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="h-[4rem] min-h-[4rem]">
                <p className="text-sm text-gray-400 line-clamp-3">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="relative overflow-x-auto">
                <div className="flex gap-2 no-wrap overflow-x-auto scrollbar-hide pb-2">
                  {project.technologies.map((tech, index) => (
                    <Badge
                      key={`${tech}-${index}`}
                      variant="outline"
                      className="bg-violet-500/10 text-violet-400 border-violet-500/20 whitespace-nowrap"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      <AgentProjectModalCard
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {isCurrentUser && onUpdate && (
        <AgentProjectEditModal
          project={project}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
