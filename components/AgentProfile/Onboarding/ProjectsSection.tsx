import React, { useState } from "react";
import { FormSectionLayout } from "@/components/Forms/FormSectionLayout";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Button } from "@/components/UI/button";
import { Plus, X, Upload, Link as LinkIcon, Trash, Image } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { RightContentLayout } from "@/components/Forms/RightContentLayout";

interface Project {
  id: string;
  title: string;
  description: string;
  projectLink: string;
  technologies: string[];
  images: File[];
  imageUrls: string[];
  activeImageIndex: number;
}

interface ProjectsSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
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
}: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
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

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files);
    const remainingSlots = 6 - currentProject.images.length;
    const imagesToAdd = newImages.slice(0, remainingSlots);
    const newImageUrls = imagesToAdd.map((file) => URL.createObjectURL(file));

    setCurrentProject((prev) => ({
      ...prev,
      images: [...imagesToAdd, ...prev.images],
      imageUrls: [...newImageUrls, ...prev.imageUrls],
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

    setProjects((prev) => [
      ...prev,
      { ...currentProject, id: String(Date.now()) },
    ]);
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
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  const updateCurrentProject = (
    field: keyof Project,
    value: string | string[]
  ) => {
    setCurrentProject((prev) => ({ ...prev, [field]: value }));
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
        className="space-y-2"
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
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Textarea
                    placeholder="Describe the project, your role, and the impact it had..."
                    value={currentProject.description}
                    onChange={(e) =>
                      updateCurrentProject("description", e.target.value)
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[120px]"
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
                      <motion.div className="w-[200px] h-[150px] border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-center p-4 hover:border-purple-500/50 transition-colors">
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
                  <motion.div className="flex items-center justify-center mt-4 w-full">
                    <motion.label className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
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
                  ? "bg-white/5 hover:bg-white/10 text-white border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-600 text-white border-transparent"
              )}
            >
              Save Project
            </Button>
          </motion.div>
        </motion.div>

        {/* Projects List - Now Scrollable */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.div className="overflow-x-auto pb-2" variants={itemVariants}>
            <div className="flex gap-3 min-w-max">
              <AnimatePresence>
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: index * 0.1,
                    }}
                    className="bg-white/[0.02] rounded-lg relative group/card border border-white/5 hover:border-purple-500/30 transition-all duration-300 w-[200px] flex-shrink-0"
                  >
                    {project.imageUrls.length > 0 ? (
                      <motion.div className="aspect-[3/2] rounded-md overflow-hidden relative">
                        <img
                          src={project.imageUrls[0]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <motion.div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white font-medium text-sm text-center px-2">
                            {project.title}
                          </span>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div className="aspect-[3/2] rounded-md relative flex items-center justify-center bg-white/5">
                        <span className="text-white font-medium text-sm text-center px-2">
                          {project.title}
                        </span>
                      </motion.div>
                    )}
                    <button
                      onClick={() => removeProject(project.id)}
                      className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <Trash className="h-4 w-4 text-white" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      {projects.length === 0 && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <i className="fas fa-lightbulb text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">
                Pro Tip: Stand Out with Your Portfolio
              </h4>
              <p className="text-sm text-white/70">
                Agents who showcase 3+ projects are{" "}
                <span className="text-purple-400 font-medium">
                  4x more likely
                </span>{" "}
                to get client attention. Each project you share significantly
                increases your chances of landing your ideal clients.
              </p>
            </div>
          </div>
        </div>
      )}
    </FormSectionLayout>
  );
}
