"use client";

import React, { useState } from "react";
import { GlassModal } from "@/components/UI/GlassModal";
import { AgentProject, ProjectStatus } from "@/types";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Label } from "@/components/UI/label";
import { Badge } from "@/components/UI/badge";
import { X, Loader2, Pencil, Trash, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { AGENT_PROJECT_STATUSES } from "@/sanity/schemaTypes/constants";

interface AgentProjectEditModalProps {
  project: AgentProject;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProject: AgentProject) => Promise<void>;
  onDelete?: (projectId: string) => Promise<void>;
}

const inputStyles = "bg-white/5 text-white placeholder:text-white/40";

export function AgentProjectEditModal({
  project,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: AgentProjectEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    ...project,
  });
  const [newTech, setNewTech] = useState("");
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null
  );
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: ProjectStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleAddTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTech.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((tech) => tech !== techToRemove),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if adding new images would exceed the limit
    const currentImages = formData.images || [];
    if (currentImages.length + files.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    const filesArray = Array.from(files);
    setNewImages((prev) => [...prev, ...filesArray]);

    // Create temporary URLs for preview
    const newImageObjects = filesArray.map((file) => ({
      _key: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      image: {
        asset: {
          url: URL.createObjectURL(file),
        },
      },
      alt: formData.title,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImageObjects],
    }));
  };

  const handleRemoveImage = (index: number) => {
    // If it's a new image, remove it from newImages array
    if (formData.images?.[index]._key?.startsWith("temp_")) {
      const imageUrl = formData.images[index].image.asset.url;
      URL.revokeObjectURL(imageUrl);
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleEditImageAlt = (index: number, newAlt: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.map((img, i) =>
        i === index ? { ...img, alt: newAlt } : img
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData for image upload
      const formDataToSend = new FormData();

      // Add project data
      const projectData = {
        ...formData,
        images: formData.images?.map((img) => ({
          _key:
            img._key ||
            `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          image: img.image,
          alt: img.alt,
        })),
      };

      formDataToSend.append("projects", JSON.stringify([projectData]));

      // Append new images
      newImages.forEach((file, index) => {
        formDataToSend.append(`projectImages[0][${index}]`, file);
      });

      await onUpdate(projectData as AgentProject);
      onClose();
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !project._id) return;

    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        await onDelete(project._id);
        onClose();
      } catch (error) {
        console.error("Failed to delete project:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      size="lg"
    >
      <div className="flex flex-col h-[75vh]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-6">
              {/* Images Section */}
              <div>
                <Label className="text-violet-200">
                  Project Images (Max 6)
                </Label>
                <div className="mt-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.images?.map((image, index) => (
                    <div
                      key={image._key || index}
                      className="relative"
                      onMouseEnter={() => setHoveredImageIndex(index)}
                      onMouseLeave={() => setHoveredImageIndex(null)}
                    >
                      <div className="aspect-[16/10] relative rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={image.image?.asset?.url}
                          alt={image.alt}
                          className="w-full h-full object-cover object-top"
                        />
                        {hoveredImageIndex === index && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                const newAlt = prompt(
                                  "Enter new alt text:",
                                  image.alt
                                );
                                if (newAlt) handleEditImageAlt(index, newAlt);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!formData.images || formData.images.length < 6) && (
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="aspect-[16/10] relative rounded-lg border border-dashed border-white/20 hover:border-white/40 transition-colors group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 group-hover:text-white/80">
                        <Upload className="h-6 w-6 mb-2" />
                        <span className="text-sm">Add Image</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label className="text-violet-200" htmlFor="title">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={cn("mt-1", inputStyles)}
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <Label className="text-violet-200" htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={cn("mt-1 h-32", inputStyles)}
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <Label className="text-violet-200" htmlFor="projectLink">
                    Project Link
                  </Label>
                  <Input
                    id="projectLink"
                    name="projectLink"
                    value={formData.projectLink || ""}
                    onChange={handleInputChange}
                    placeholder="https://"
                    className={cn("mt-1", inputStyles)}
                  />
                </div>

                <div>
                  <Label className="text-violet-200">Technologies</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies?.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="bg-purple-500/10 flex items-center gap-1"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(tech)}
                          className="ml-1 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Input
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={handleAddTechnology}
                      placeholder="Add technology (press Enter)"
                      className={cn("mt-1", inputStyles)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-violet-200" htmlFor="status">
                    Project Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className={cn("mt-1", inputStyles)}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENT_PROJECT_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-violet-800/30">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || !onDelete}
              className="px-4"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Project
                </>
              )}
            </Button>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading || isDeleting}
                className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isDeleting}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </GlassModal>
  );
}
