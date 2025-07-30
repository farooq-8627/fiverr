import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Label } from "@/components/UI/label";
import { useToast } from "@/hooks/useToast";
import { ClientProject, ProjectStatus } from "@/types";
import { createClientProject } from "@/app/onboarding/client-profile/actions";
import { GlassModal } from "@/components/UI/GlassModal";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/UI/select";
import {
  INDUSTRY_DOMAINS,
  PROJECT_STATUSES,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  PROJECT_COMPLEXITY,
  ENGAGEMENT_TYPES,
  TEAM_SIZES,
  EXPERIENCE_LEVELS,
  PRIORITY_LEVELS,
} from "@/sanity/schemaTypes/constants";

interface CreateClientProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: ClientProject) => void;
  profileId: string;
}

export function CreateClientProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
  profileId,
}: CreateClientProjectModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    businessDomain: "",
    painPoints: "",
    budgetRange: "",
    timeline: "",
    complexity: "",
    engagementType: "",
    teamSize: "",
    experienceLevel: "",
    startDate: "",
    priority: "",
    status: "draft",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createClientProject(
        profileId,
        formData as ClientProject
      );

      if (response.success && response.project) {
        // Update UI with the new project
        onProjectCreated(response.project);

        // Reset form
        setFormData({
          title: "",
          description: "",
          businessDomain: "",
          painPoints: "",
          budgetRange: "",
          timeline: "",
          complexity: "",
          engagementType: "",
          teamSize: "",
          experienceLevel: "",
          startDate: "",
          priority: "",
          status: "draft",
        });

        onClose();

        toast({
          title: "Success",
          description: "Project created successfully",
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
      size="xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-[75vh]">
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Basic Information */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg mb-4">
            <h3 className="text-lg font-medium text-violet-200">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="painPoints">Pain Points</Label>
                <Textarea
                  id="painPoints"
                  value={formData.painPoints}
                  onChange={(e) => handleChange("painPoints", e.target.value)}
                  placeholder="Describe the challenges you're facing..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg mb-4">
            <h3 className="text-lg font-medium text-violet-200">
              Project Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessDomain">Business Domain</Label>
                <Select
                  value={formData.businessDomain}
                  onValueChange={(value) =>
                    handleChange("businessDomain", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_DOMAINS.map((domain) => (
                      <SelectItem key={domain.value} value={domain.value}>
                        {domain.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Project Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budgetRange">Budget Range</Label>
                <Select
                  value={formData.budgetRange}
                  onValueChange={(value) => handleChange("budgetRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_RANGES.map((budget) => (
                      <SelectItem key={budget.value} value={budget.value}>
                        {budget.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) => handleChange("timeline", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((timeline) => (
                      <SelectItem key={timeline.value} value={timeline.value}>
                        {timeline.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="complexity">Project Complexity</Label>
                <Select
                  value={formData.complexity}
                  onValueChange={(value) => handleChange("complexity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_COMPLEXITY.map((complexity) => (
                      <SelectItem
                        key={complexity.value}
                        value={complexity.value}
                      >
                        {complexity.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="engagementType">Type of Engagement</Label>
                <Select
                  value={formData.engagementType}
                  onValueChange={(value) =>
                    handleChange("engagementType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select engagement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGAGEMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select
                  value={formData.teamSize}
                  onValueChange={(value) => handleChange("teamSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experienceLevel">
                  Required Experience Level
                </Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) =>
                    handleChange("experienceLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Project Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_LEVELS.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 pt-4 mt-4 border-t border-violet-800/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </GlassModal>
  );
}
