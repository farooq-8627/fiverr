"use client";
import React from "react";
import { GlassModal } from "@/components/UI/GlassModal";
import { motion } from "framer-motion";
import { AgentProject } from "@/types";
import { Pencil, Rocket, Tag, Trash } from "lucide-react";
import { Badge } from "@/components/UI/badge";

interface AgentProjectModalCardProps {
  project: AgentProject;
  onDelete?: (id: string) => void;
  onEdit?: (project: AgentProject) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AgentProjectModalCardContent = ({
  project,
  onDelete,
  onEdit,
  onClose,
}: AgentProjectModalCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(project._id);
      onClose();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(project);
      onClose();
    }
  };

  return (
    <div className="space-y-8 p-4">
      {/* Header with Title and Action Buttons */}
      <div className="flex items-start justify-between">
        <h3 className="text-2xl font-bold">{project.title}</h3>
        <div className="flex items-center gap-3">
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-full bg-green-500/20 hover:bg-purple-500/30 transition-colors group text-purple-300"
              title="View Demo"
            >
              <Rocket className="h-4 w-4" />
            </a>
          )}
          {onEdit && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors group text-blue-300"
              title="Edit Project"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors group text-red-300"
              title="Delete Project"
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Project Images Gallery */}
      <div className="relative w-full overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex gap-4 min-w-min">
          {project.images &&
            project.images.map((image, idx) => (
              <motion.div
                key={"image" + idx}
                style={{
                  rotate: idx % 2 === 0 ? -3 : 3,
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  zIndex: 1,
                }}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-xl"
              >
                <img
                  src={image.image?.asset?.url || ""}
                  alt={image.alt || `${project.title} image ${idx + 1}`}
                  className="h-48 w-64 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
        </div>
      </div>

      {/* Description */}
      <div className="max-h-[200px] overflow-y-auto hide-scrollbar rounded-md bg-black/30 p-2">
        <p className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Technologies */}
      <div className="relative overflow-x-auto">
        <div className="flex gap-2 no-wrap overflow-x-auto scrollbar-hide pb-2">
          {project.technologies?.map((tech, idx) => (
            <Badge
              key={`${tech}-${idx}`}
              variant="outline"
              className="bg-violet-500/10 text-violet-400 border-violet-500/20 whitespace-nowrap"
            >
              <Tag className="mr-1 h-3 w-3" />
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export function AgentProjectModalCard({
  project,
  onDelete,
  onEdit,
  isOpen,
  onClose,
}: AgentProjectModalCardProps) {
  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <AgentProjectModalCardContent
        project={project}
        onDelete={onDelete}
        onEdit={onEdit}
        onClose={onClose}
        isOpen={isOpen}
      />
    </GlassModal>
  );
}
