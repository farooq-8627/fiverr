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
  onSave: (data: {
    pricingModel?: string;
    availability?: string;
    workType?: string;
    teamSize?: string;
    projectSizePreferences?: string[];
  }) => void;
  initialData: {
    profileId: string;
    pricingModel: string;
    availability: string;
    workType: string;
    teamSize: string;
    projectSizePreferences: string[];
  };
  isCurrentUser: boolean;
}

export function BusinessDetailsEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isCurrentUser,
}: BusinessDetailsEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pricingModel: initialData.pricingModel || "",
    availability: initialData.availability || "",
    workType: initialData.workType || "",
    projectSizePreferences: initialData.projectSizePreferences || [],
    teamSize: initialData.teamSize || "",
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

    try {
      setIsLoading(true);
      const response = await updateAgentProfileDetails({
        profileId: initialData.profileId,
        ...formData,
      });

      if (response.success) {
        // Update parent component state immediately
        onSave(formData);

        toast({
          title: "Success",
          description: "Business details updated successfully.",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update business details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
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
      size="xl"
      title="Edit Business Details"
      description="Update your business preferences and availability"
    >
      <div className="space-y-6 p-2">
        {/* Pricing Model */}
        <div className="space-y-2">
          <Label className="flex items-center text-violet-200">
            <DollarSign className="w-4 h-4 mr-2 text-violet-400" />
            Pricing Model
          </Label>
          <Select
            value={formData.pricingModel}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, pricingModel: value }))
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select your pricing model" />
            </SelectTrigger>
            <SelectContent>
              {PRICING_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label className="flex items-center text-violet-200">
            <Clock className="w-4 h-4 mr-2 text-violet-400" />
            Availability
          </Label>
          <Select
            value={formData.availability}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, availability: value }))
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select your availability" />
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

        {/* Work Type */}
        <div className="space-y-2">
          <Label className="flex items-center text-violet-200">
            <Briefcase className="w-4 h-4 mr-2 text-violet-400" />
            Work Type
          </Label>
          <Select
            value={formData.workType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, workType: value }))
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select your work type" />
            </SelectTrigger>
            <SelectContent>
              {WORK_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Team Size */}
        <div className="space-y-2">
          <Label className="flex items-center text-violet-200">
            <Users className="w-4 h-4 mr-2 text-violet-400" />
            Team Size
          </Label>
          <Select
            value={formData.teamSize}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, teamSize: value }))
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select your team size" />
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

        {/* Project Size Preferences */}
        <div className="space-y-2">
          <Label className="flex items-center text-violet-200">
            <Scale className="w-4 h-4 mr-2 text-violet-400" />
            Project Size Preferences
          </Label>
          <MultiSelect
            options={convertToOnboardingFormat(PROJECT_SIZE_PREFERENCES)}
            selectedValues={formData.projectSizePreferences}
            onChange={(values) =>
              setFormData((prev) => ({
                ...prev,
                projectSizePreferences: values,
              }))
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="border-white/20 text-white hover:bg-white/10 p-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 p-2"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </GlassModal>
  );
}
