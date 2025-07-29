import React, { useState } from "react";
import { GlassModal } from "@/components/UI/GlassModal";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { useToast } from "@/hooks/useToast";
import { updateAgentProfileDetails } from "@/app/onboarding/agent-profile/actions";
import {
  AVAILABILITY_STATUSES,
  WORKING_HOURS_PREFERENCES,
  RESPONSE_TIME_COMMITMENTS,
  MEETING_AVAILABILITIES,
} from "@/sanity/schemaTypes/constants";
import { BriefcaseBusiness, Clock, Globe } from "lucide-react";

interface AvailabilityData {
  currentStatus: string;
  workingHours: string;
  timeZone: string;
  responseTime: string;
  availabilityHours: string;
}

interface AvailabilityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AvailabilityData) => void;
  initialData: AvailabilityData;
  profileId: string;
}

export function AvailabilityEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  profileId,
}: AvailabilityEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateAgentProfileDetails({
        profileId,
        availability: formData,
      });
      onSave(formData);
      toast({
        title: "Success",
        description: "Availability settings updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        title: "Error",
        description: "Failed to update availability settings",
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
      title="Edit Availability"
      className="max-w-lg"
    >
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <Label className="text-violet-200 flex items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 text-violet-400" />
            Current Status
          </Label>
          <Select
            value={formData.currentStatus}
            onValueChange={(value) =>
              setFormData({ ...formData, currentStatus: value })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {AVAILABILITY_STATUSES.find(
                  (status) => status.value === formData.currentStatus
                )?.title || "Select your current status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-violet-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-400" />
            Working Hours
          </Label>
          <Select
            value={formData.workingHours}
            onValueChange={(value) =>
              setFormData({ ...formData, workingHours: value })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {WORKING_HOURS_PREFERENCES.find(
                  (hours) => hours.value === formData.workingHours
                )?.title || "Select your working hours"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {WORKING_HOURS_PREFERENCES.map((hours) => (
                <SelectItem key={hours.value} value={hours.value}>
                  {hours.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-violet-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-400" />
            Availability Hours
          </Label>
          <Select
            value={formData.availabilityHours}
            onValueChange={(value) =>
              setFormData({ ...formData, availabilityHours: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability hours" />
            </SelectTrigger>
            <SelectContent>
              {MEETING_AVAILABILITIES.map((hours) => (
                <SelectItem key={hours.value} value={hours.value}>
                  {hours.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-violet-200 flex items-center gap-2">
            <Globe className="h-4 w-4 text-violet-400" />
            Time Zone
          </Label>
          <Select
            value={formData.timeZone}
            onValueChange={(value) =>
              setFormData({ ...formData, timeZone: value })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {formData.timeZone || "Select your time zone"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {Intl.supportedValuesOf("timeZone").map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-violet-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-400" />
            Response Time
          </Label>
          <Select
            value={formData.responseTime}
            onValueChange={(value) =>
              setFormData({ ...formData, responseTime: value })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {RESPONSE_TIME_COMMITMENTS.find(
                  (time) => time.value === formData.responseTime
                )?.title || "Select your response time"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {RESPONSE_TIME_COMMITMENTS.map((time) => (
                <SelectItem key={time.value} value={time.value}>
                  {time.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </GlassModal>
  );
}
