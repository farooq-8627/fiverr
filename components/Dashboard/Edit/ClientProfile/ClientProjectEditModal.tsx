import React, { useState } from "react";
import { GlassModal } from "@/components/UI/GlassModal";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { useToast } from "@/hooks/useToast";
import { updateClientProject } from "@/app/onboarding/client-profile/actions";
import { ClientProject } from "@/types";
import {
  INDUSTRY_DOMAINS,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  PROJECT_COMPLEXITY,
  ENGAGEMENT_TYPES,
  TEAM_SIZES,
  EXPERIENCE_LEVELS,
  PRIORITY_LEVELS,
  PROJECT_STATUSES,
} from "@/sanity/schemaTypes/constants";

interface ClientProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ClientProject;
  profileId: string;
  onUpdate: (updatedProject: ClientProject) => void;
}

export function ClientProjectEditModal({
  isOpen,
  onClose,
  project,
  onUpdate,
  profileId,
}: ClientProjectEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with only the fields we need
  const [formData, setFormData] = useState({
    _id: project._id,
    title: project.title,
    description: project.description,
    businessDomain: project.businessDomain,
    painPoints: project.painPoints,
    budgetRange: project.budgetRange,
    timeline: project.timeline,
    complexity: project.complexity,
    engagementType: project.engagementType,
    teamSize: project.teamSize,
    experienceLevel: project.experienceLevel,
    startDate: project.startDate,
    priority: project.priority,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Form data:", formData);

      const response = await updateClientProject({
        profileId: profileId,
        project: formData as ClientProject,
      });

      console.log("Response:", response);

      if (response.success) {
        onUpdate(formData);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
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
                <Label htmlFor="description">Description</Label>
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
                  placeholder="Describe the challenges or problems to solve"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
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
                <Label htmlFor="experienceLevel">Required Experience</Label>
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
                <Label htmlFor="priority">Priority Level</Label>
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
            disabled={isLoading}
            className="bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </GlassModal>
  );
}
