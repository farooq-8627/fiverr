"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
  useModal,
} from "@/components/UI/AnimatedModal";
import { motion } from "framer-motion";
import { Project } from "@/types/profile";
import { Pencil, Rocket, Trash } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  onEdit?: (project: Project) => void;
}

const ProjectCardContent = ({
  project,
  onDelete,
  onEdit,
}: ProjectCardProps) => {
  const { setOpen } = useModal();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(project.id);
      setOpen(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(project);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Title and Action Buttons */}
      <div className="flex items-start justify-between">
        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
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
          {project.imageUrls &&
            project.imageUrls.map((image, idx) => (
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
                  src={image}
                  alt={`${project.title} image ${idx + 1}`}
                  className="h-48 w-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export function ProjectCard(props: ProjectCardProps) {
  return (
    <Modal>
      <ModalTrigger>
        <div className="w-full h-full cursor-pointer">
          {props.project.imageUrls && props.project.imageUrls.length > 0 ? (
            <div className="aspect-[3/2] rounded-md overflow-hidden relative border border-white/20">
              <img
                src={props.project.imageUrls[0]}
                alt={props.project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-medium text-sm text-center px-2">
                  {props.project.title}
                </span>
              </div>
            </div>
          ) : (
            <div className="aspect-[3/2] rounded-md relative flex items-center justify-center bg-white/5">
              <span className="text-white font-medium text-sm text-center px-2">
                {props.project.title}
              </span>
            </div>
          )}
        </div>
      </ModalTrigger>
      <ModalBody>
        <ModalContent className="bg-black/40 backdrop-blur-xl border-white/10">
          <ProjectCardContent {...props} />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
