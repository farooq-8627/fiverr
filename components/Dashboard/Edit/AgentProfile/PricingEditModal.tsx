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
import { Input } from "@/components/UI/input";
import { useToast } from "@/hooks/useToast";
import { updateAgentProfileDetails } from "@/app/onboarding/agent-profile/actions";
import {
  PAYMENT_METHODS,
  MINIMUM_PROJECT_BUDGETS,
  PROJECT_SIZE_PREFERENCES,
  HOURLY_RATE_RANGES,
} from "@/sanity/schemaTypes/constants";
import { Scale } from "lucide-react";
import { MultiSelect } from "@/components/UI/MultiSelect";

interface PricingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    hourlyRateRange: string;
    minimumProjectBudget: string;
    preferredPaymentMethods: string[];
  }) => void;
  initialData: {
    hourlyRateRange: string;
    minimumProjectBudget: string;
    preferredPaymentMethods: string[];
  };
  profileId: string;
}

export function PricingEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  profileId,
}: PricingEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateAgentProfileDetails({
        profileId,
        pricing: formData,
      });
      onSave(formData);
      toast({
        title: "Success",
        description: "Pricing settings updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error updating pricing:", error);
      toast({
        title: "Error",
        description: "Failed to update pricing settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodsChange = (value: string) => {
    const selected = formData.preferredPaymentMethods;
    const isSelected = selected.includes(value);

    if (isSelected) {
      setFormData({
        ...formData,
        preferredPaymentMethods: selected.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        preferredPaymentMethods: [...selected, value],
      });
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Pricing"
      className="max-w-lg"
    >
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <Label className="flex items-center text-violet-200">
            <Scale className="w-4 h-4 mr-2 text-violet-400" />
            Hourly Rate (USD)
          </Label>
          <Select
            value={formData.hourlyRateRange}
            onValueChange={(value) =>
              setFormData({ ...formData, hourlyRateRange: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select hourly rate" />
            </SelectTrigger>
            <SelectContent>
              {HOURLY_RATE_RANGES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center text-violet-200">
            <Scale className="w-4 h-4 mr-2 text-violet-400" />
            Minimum Project Budget
          </Label>
          <Select
            value={formData.minimumProjectBudget}
            onValueChange={(value) =>
              setFormData({ ...formData, minimumProjectBudget: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select minimum budget" />
            </SelectTrigger>
            <SelectContent>
              {MINIMUM_PROJECT_BUDGETS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* <div className="space-y-2">
          <Label>Preferred Payment Methods</Label>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = formData.preferredPaymentMethods.includes(
                method.value
              );
              return (
                <Badge
                  key={method.value}
                  variant={isSelected ? "default" : "outline"}
                  className={
                    isSelected
                      ? "bg-violet-500/20 hover:bg-violet-500/30 text-violet-200"
                      : "hover:bg-white/10"
                  }
                  onClick={() => handlePaymentMethodsChange(method.value)}
                  role="button"
                >
                  {method.title}
                </Badge>
              );
            })}
          </div>
        </div> */}
        <div className="space-y-2">
          <Label className="flex items-center text-violet-200">
            <Scale className="w-4 h-4 mr-2 text-violet-400" />
            Preferred Payment Methods
          </Label>
          <MultiSelect
            options={PAYMENT_METHODS.map((pref) => ({
              id: pref.value,
              label: pref.title,
              value: pref.value,
            }))}
            selectedValues={formData.preferredPaymentMethods}
            onChange={(values) =>
              setFormData((prev) => ({
                ...prev,
                preferredPaymentMethods: values,
              }))
            }
          />
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
      </div>
    </GlassModal>
  );
}
