import React, { useState } from "react";
import { GlassModal } from "../../UI/GlassModal";
import { Button } from "../../UI/button";
import { Label } from "../../UI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../UI/select";
import { DollarSign, Clock, Briefcase, Users, Scale } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { updateAgentProfileDetails } from "@/app/onboarding/agent-profile/actions";
import {
  PRICING_MODELS,
  AVAILABILITY_OPTIONS,
  WORK_TYPES,
  TEAM_SIZES,
  PROJECT_SIZE_PREFERENCES,
} from "@/sanity/schemaTypes/constants";
import { MultiSelect } from "@/components/UI/MultiSelect";
import { convertToOnboardingFormat } from "@/lib/constants-utils";

interface BusinessDetailsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  initialData: {
    profileId: string;
    pricingModel: string;
    availability: string;
    workType: string;
    teamSize: string;
    projectSizePreferences: string[];
  };
  isCurrentUser: boolean;
  onRefetch?: () => Promise<void>;
}

export function BusinessDetailsEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isCurrentUser,
  onRefetch,
}: BusinessDetailsEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pricingModel: initialData.pricingModel || "",
    availability: initialData.availability || "",
    workType: initialData.workType || "",
    teamSize: initialData.teamSize || "",
    projectSizePreferences: initialData.projectSizePreferences || [],
  });

  const handleSubmit = async () => {
    if (!isCurrentUser) {
      toast({
        title: "Permission Denied",
        description: "You can only edit your own profile.",
        variant: "destructive",
      });
      return;
    }

    console.log("[BusinessDetailsEditModal] Submitting form data:", formData);
    setIsLoading(true);
    try {
      const result = await updateAgentProfileDetails({
        profileId: initialData.profileId,
        pricingModel: formData.pricingModel,
        availability: formData.availability,
        workType: formData.workType,
        teamSize: formData.teamSize,
        projectSizePreferences: formData.projectSizePreferences,
      });

      console.log("[BusinessDetailsEditModal] Update result:", result);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onSave?.();
        await onRefetch?.();
        onClose();
      } else {
        console.error(
          "[BusinessDetailsEditModal] Update failed:",
          result.message
        );
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[BusinessDetailsEditModal] Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to update business details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert project size preferences to the format needed by MultiSelect
  const projectSizeOptions = convertToOnboardingFormat(
    PROJECT_SIZE_PREFERENCES
  );

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Edit Business Details"
      description="Edit your business details including pricing model, availability, work type, team size, and project size preferences"
      className=""
    >
      <div className="space-y-8 p-2">
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <DollarSign className="inline-block mr-2 h-5 w-5 text-violet-400" />
              Pricing Model
            </Label>
            <Select
              value={formData.pricingModel}
              onValueChange={(value) =>
                setFormData({ ...formData, pricingModel: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                {PRICING_MODELS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <Clock className="inline-block mr-2 h-5 w-5 text-violet-400" />
              Availability
            </Label>
            <Select
              value={formData.availability}
              onValueChange={(value) =>
                setFormData({ ...formData, availability: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABILITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <Briefcase className="inline-block mr-2 h-5 w-5 text-violet-400" />
              Work Type
            </Label>
            <Select
              value={formData.workType}
              onValueChange={(value) =>
                setFormData({ ...formData, workType: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                {WORK_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <Users className="inline-block mr-2 h-5 w-5 text-violet-400" />
              Team Size
            </Label>
            <Select
              value={formData.teamSize}
              onValueChange={(value) =>
                setFormData({ ...formData, teamSize: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_SIZES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-semibold mb-2 flex items-center text-violet-200">
              <Scale className="inline-block mr-2 h-5 w-5 text-violet-400" />
              Project Size Preferences
            </Label>
            <MultiSelect
              options={projectSizeOptions}
              selectedValues={formData.projectSizePreferences}
              onChange={(values) =>
                setFormData({ ...formData, projectSizePreferences: values })
              }
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-violet-800/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </GlassModal>
  );
}
