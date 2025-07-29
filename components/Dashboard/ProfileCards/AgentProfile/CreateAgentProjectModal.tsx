import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Label } from "@/components/UI/label";
import { useToast } from "@/hooks/useToast";
import { AgentProject, ProjectStatus } from "@/types";
import { createAgentProject } from "@/app/onboarding/agent-profile/actions";
import { GlassModal } from "@/components/UI/GlassModal";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/UI/select";
import { AGENT_PROJECT_STATUSES } from "@/sanity/schemaTypes/constants";
import {
  ImagePlus,
  BriefcaseBusiness,
  FileText,
  Link,
  Code,
  CheckCircle,
} from "lucide-react";

interface CreateAgentProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: AgentProject) => void;
  profileId: string;
}

export function CreateAgentProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
  profileId,
}: CreateAgentProjectModalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("completed");

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const techArray = e.target.value.split(",").map((tech) => tech.trim());
    setTechnologies(techArray);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProjectImages(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for image upload
      const formData = new FormData();

      // Create project object
      const newProject = {
        title,
        description,
        projectLink,
        technologies,
        status,
        isPortfolioProject: true,
      };

      formData.append("projects", JSON.stringify([newProject]));

      // Append images
      projectImages.forEach((file, index) => {
        formData.append(`projectImages[0][${index}]`, file);
      });

      // Create the project
      const response = await createAgentProject(profileId, formData);

      if (response.success && response.project) {
        // Update UI with the new project
        onProjectCreated(response.project);

        // Reset form
        setTitle("");
        setDescription("");
        setProjectLink("");
        setTechnologies([]);
        setProjectImages([]);
        setStatus("completed");

        // Close modal
        onClose();

        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        throw new Error(response.message || "Failed to create project");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label
              className="text-violet-200 mb-2 flex items-center gap-2"
              htmlFor="title"
            >
              <BriefcaseBusiness className="h-4 w-4 text-violet-400 " />
              Project Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label
              className="text-violet-200 mb-2 flex items-center gap-2"
              htmlFor="description"
            >
              <FileText className="h-4 w-4 text-violet-400" />
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label
              className="text-violet-200 mb-2 flex items-center gap-2"
              htmlFor="projectLink"
            >
              <Link className="h-4 w-4 text-violet-400" />
              Project Link (Optional)
            </Label>
            <Input
              id="projectLink"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              type="url"
            />
          </div>
          <div>
            <Label
              className="text-violet-200 mb-2 flex items-center gap-2"
              htmlFor="technologies"
            >
              <Code className="h-4 w-4 text-violet-400" />
              Technologies (comma-separated)
            </Label>
            <Input
              id="technologies"
              value={technologies.join(", ")}
              onChange={handleTechnologiesChange}
              placeholder="React, TypeScript, Node.js"
            />
          </div>
          <div>
            <Label
              className="text-violet-200 mb-2 flex items-center gap-2"
              htmlFor="status"
            >
              <CheckCircle className="h-4 w-4 text-violet-400" />
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
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
          <div>
            <Label
              className="text-violet-200 flex items-center gap-2 mb-2"
              htmlFor="projectImages"
            >
              <ImagePlus className="h-4 w-4 text-violet-400" />
              Project Images
            </Label>
            <Input
              id="projectImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {projectImages.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {projectImages.length} image(s) selected
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4 border-t border-violet-800/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </GlassModal>
  );
}
