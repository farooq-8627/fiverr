"use client";
import React, { useState } from "react";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Button } from "@/components/UI/button";
import { Plus, X, Upload, Link as LinkIcon, Trash, Image } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { Project } from "@/types/profile";
import { ProjectCard } from "../../Forms/ProjectCard";

interface ProjectsSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  formData: any;
  setFormData: (data: any) => void;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function ProjectsSection({
  onNext,
  onPrev,
  onSkip,
  formData,
  setFormData,
}: ProjectsSectionProps) {
  // Initialize state from formData if available
  const [projects, setProjects] = useState<Project[]>(formData?.projects || []);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: "new",
    title: "",
    description: "",
    projectLink: "",
    technologies: [],
    images: [],
    imageUrls: [],
    activeImageIndex: -1,
  });
  const [isHovered, setIsHovered] = useState(false);
  // Add state to track the saved project images for immediate display
  const [savedProjectImages, setSavedProjectImages] = useState<{
    [key: string]: string[];
  }>({});

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files);
    const remainingSlots = 6 - currentProject.images.length;
    const imagesToAdd = newImages.slice(0, remainingSlots);
    const newImageUrls = imagesToAdd.map((file) => URL.createObjectURL(file));

    setCurrentProject((prev) => ({
      ...prev,
      images: [...prev.images, ...imagesToAdd], // Preserve order: add new images at the end
      imageUrls: [...prev.imageUrls, ...newImageUrls], // Preserve order: add new URLs at the end
      activeImageIndex: -1,
    }));
  };

  const removeImage = (imageIndex: number) => {
    setCurrentProject((prev) => {
      const newImages = [...prev.images];
      const newImageUrls = [...prev.imageUrls];
      newImages.splice(imageIndex, 1);
      newImageUrls.splice(imageIndex, 1);
      return {
        ...prev,
        images: newImages,
        imageUrls: newImageUrls,
        activeImageIndex: -1,
      };
    });
  };

  const setActiveImage = (imageIndex: number) => {
    setCurrentProject((prev) => ({
      ...prev,
      activeImageIndex: prev.activeImageIndex === imageIndex ? -1 : imageIndex,
    }));
  };

  const addProject = () => {
    if (!currentProject.title || !currentProject.description) return;

    // If we're editing an existing project, update it instead of adding a new one
    if (currentProject.id !== "new") {
      updateProject();
      return;
    }

    const newProjectId = String(Date.now());
    const newProject = { ...currentProject, id: newProjectId };
    const updatedProjects = [...projects, newProject];

    // Save the image URLs for immediate display
    if (currentProject.imageUrls.length > 0) {
      setSavedProjectImages((prev) => ({
        ...prev,
        [newProjectId]: [...currentProject.imageUrls],
      }));
    }

    // Update projects state first
    setProjects(updatedProjects);

    // Then update formData
    setFormData({
      ...formData,
      projects: updatedProjects,
    });

    // Reset current project
    setCurrentProject({
      id: "new",
      title: "",
      description: "",
      projectLink: "",
      technologies: [],
      images: [],
      imageUrls: [],
      activeImageIndex: -1,
    });
  };

  const updateProject = () => {
    const updatedProjects = projects.map((project) =>
      project.id === currentProject.id ? currentProject : project
    );

    // Update projects state
    setProjects(updatedProjects);

    // Update formData
    setFormData({
      ...formData,
      projects: updatedProjects,
    });

    // Reset current project
    setCurrentProject({
      id: "new",
      title: "",
      description: "",
      projectLink: "",
      technologies: [],
      images: [],
      imageUrls: [],
      activeImageIndex: -1,
    });
  };

  const removeProject = (projectId: string) => {
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );
    setProjects(updatedProjects);

    // Also remove from savedProjectImages
    const updatedSavedImages = { ...savedProjectImages };
    delete updatedSavedImages[projectId];
    setSavedProjectImages(updatedSavedImages);

    // Update formData
    setFormData({
      ...formData,
      projects: updatedProjects,
    });
  };

  const updateCurrentProject = (
    field: keyof Project,
    value: string | string[]
  ) => {
    setCurrentProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditProject = (projectToEdit: Project) => {
    setCurrentProject(projectToEdit);
    // setIsEditing(true); // This state is not defined in the original file
    // setOpen(true); // This state is not defined in the original file
  };

  const rightContent = (
    <RightContentLayout
      title="Showcase Your Projects"
      subtitle="Share your best work to attract potential clients."
      features={[
        {
          icon: "fa-project-diagram",
          title: "Portfolio Impact",
          description:
            "Demonstrate your expertise through real project examples",
        },
        {
          icon: "fa-star",
          title: "Success Stories",
          description: "Share the outcomes and value you've delivered",
        },
        {
          icon: "fa-bullseye",
          title: "Target Clients",
          description:
            "Help clients understand your specialization and capabilities",
        },
      ]}
      currentStep={3}
      totalSteps={6}
    />
  );

  return (
    <FormSectionLayout
      title="Project Portfolio"
      description="Showcase your best automation projects"
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
      rightContent={rightContent}
    >
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Current Project Form */}
        <motion.div
          className="bg-white/[0.03] rounded-lg p-6"
          variants={itemVariants}
        >
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div className="space-y-4" variants={itemVariants}>
                <motion.div variants={itemVariants}>
                  <Input
                    placeholder="Project Title"
                    value={currentProject.title}
                    onChange={(e) =>
                      updateCurrentProject("title", e.target.value)
                    }
                    className="bg-white/5 text-white placeholder:text-white/40"
                  />
                </motion.div>

                <motion.div
                  className="flex items-center space-x-2"
                  variants={itemVariants}
                >
                  <Input
                    placeholder="Project Link"
                    value={currentProject.projectLink}
                    onChange={(e) =>
                      updateCurrentProject("projectLink", e.target.value)
                    }
                    className="bg-white/5 text-white placeholder:text-white/40"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Input
                    placeholder="Technologies Used (comma-separated)"
                    value={currentProject.technologies.join(", ")}
                    onChange={(e) =>
                      updateCurrentProject(
                        "technologies",
                        e.target.value.split(",").map((t) => t.trim())
                      )
                    }
                    className="bg-white/5 text-white placeholder:text-white/40"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Textarea
                    placeholder="Describe the project, your role, and the impact it had..."
                    value={currentProject.description}
                    onChange={(e) =>
                      updateCurrentProject("description", e.target.value)
                    }
                    className="bg-white/5 text-white placeholder:text-white/40 min-h-[120px]"
                  />
                </motion.div>
              </motion.div>

              {/* Image Upload Section */}
              <motion.div
                className="flex flex-col justify-between items-center w-full"
                variants={itemVariants}
              >
                <div
                  className="relative h-[200px] perspective-1000 w-full flex justify-center"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="relative w-[200px] h-full">
                    {currentProject.imageUrls.length > 0 ? (
                      <AnimatePresence>
                        {currentProject.imageUrls.map((url, imgIndex) => (
                          <motion.div
                            key={url}
                            className={cn(
                              "absolute top-0 left-0 w-[200px] h-[150px] cursor-pointer",
                              "rounded-lg overflow-hidden shadow-lg",
                              "transition-all duration-300 ease-out transform-gpu",
                              currentProject.activeImageIndex === imgIndex &&
                                "z-50"
                            )}
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{
                              scale:
                                currentProject.activeImageIndex === imgIndex
                                  ? 1.1
                                  : 0.95,
                              opacity: 1,
                              y:
                                isHovered &&
                                currentProject.activeImageIndex === -1
                                  ? imgIndex * 15
                                  : currentProject.activeImageIndex === imgIndex
                                    ? 0
                                    : 0,
                              zIndex:
                                currentProject.activeImageIndex === imgIndex
                                  ? 50
                                  : currentProject.imageUrls.length - imgIndex,
                            }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                              mass: 0.5,
                              delay: imgIndex * 0.05,
                            }}
                            onClick={() =>
                              setActiveImage(
                                currentProject.activeImageIndex === imgIndex
                                  ? -1
                                  : imgIndex
                              )
                            }
                            style={{
                              transformStyle: "preserve-3d",
                            }}
                          >
                            <img
                              src={url}
                              alt={`Project image ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {currentProject.activeImageIndex === imgIndex && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(imgIndex);
                                }}
                                className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full hover:bg-black/70 transition-colors"
                              >
                                <Trash className="h-4 w-4 text-white" />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    ) : (
                      <motion.div
                        variants={itemVariants}
                        className="w-[200px] h-[150px] border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-center p-4 hover:border-purple-500/50 transition-colors"
                      >
                        <motion.div className="h-10 w-10 text-white/40 mb-2">
                          <Image className="h-10 w-10 text-white/40 mb-2" />
                        </motion.div>
                        <motion.p className="text-sm text-white/60">
                          Upload Project Images
                        </motion.p>{" "}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                {currentProject.imageUrls.length < 6 && (
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center mt-4 w-full"
                  >
                    <motion.label className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                      <Upload className="h-4 w-4 text-white/60 mr-2" />
                      <span className="text-sm text-white/60">
                        Upload Project Images ({currentProject.imageUrls.length}
                        /6)
                      </span>
                    </motion.label>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="button"
              onClick={addProject}
              disabled={!currentProject.title || !currentProject.description}
              className={cn(
                "w-full border py-2 mt-4 transition-colors",
                !currentProject.title || !currentProject.description
                  ? "bg-white/5 hover:bg-white/10 text-white border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-600 text-white border-transparent"
              )}
            >
              Save Project
            </Button>
          </motion.div>
        </motion.div>

        {/* Projects List - Now Scrollable */}
        <motion.div className="" variants={itemVariants}>
          <motion.div className="overflow-x-auto" variants={itemVariants}>
            <div className="flex gap-3 min-w-max">
              <AnimatePresence mode="popLayout">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="w-60 group/card"
                  >
                    <ProjectCard
                      project={project}
                      onDelete={removeProject}
                      onEdit={handleEditProject}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {projects.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <motion.div
                variants={itemVariants}
                className="p-2 rounded-lg bg-purple-500/20"
              >
                <i className="fas fa-lightbulb text-purple-400" />
              </motion.div>
              <div>
                <motion.h4
                  variants={itemVariants}
                  className="font-medium text-white mb-1"
                >
                  Pro Tip: Stand Out with Your Portfolio
                </motion.h4>
                <motion.p
                  variants={itemVariants}
                  className="text-sm text-white/70"
                >
                  Agents who showcase 3+ projects are{" "}
                  <span className="text-purple-400 font-medium">
                    4x more likely
                  </span>{" "}
                  to get client attention. Each project you share significantly
                  increases your chances of landing your ideal clients.
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </FormSectionLayout>
  );
}
