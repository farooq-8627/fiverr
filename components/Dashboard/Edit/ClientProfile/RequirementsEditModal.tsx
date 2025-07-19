import React, { useState } from "react";
import { GlassModal } from "@/components/UI/GlassModal";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Badge } from "@/components/UI/badge";
import {
  X,
  Plus,
  Scale,
  Briefcase,
  AlertCircle,
  Star,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { updateClientProfileDetails } from "@/app/onboarding/client-profile/actions";
import { INDUSTRY_DOMAINS } from "@/sanity/schemaTypes/constants";
import { MultiSelect } from "@/components/UI/MultiSelect";

interface RequirementsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    experience: string;
    dealBreakers: string[];
    industryDomain: string[];
    customIndustry?: string[];
    requirements: string[];
  }) => void;
  initialData: {
    experience: string;
    dealBreakers: string[];
    industryDomain: string[];
    customIndustry?: string[];
    requirements: string[];
  };
  profileId: string;
}

export function RequirementsEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  profileId,
}: RequirementsEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [newDealBreaker, setNewDealBreaker] = useState("");
  const [newCustomIndustry, setNewCustomIndustry] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const handleSave = async () => {
    try {
      setIsLoading(true);
      console.log("formData in requirements edit modal", formData);
      await updateClientProfileDetails({
        profileId,
        mustHaveRequirements: {
          experience: formData.experience,
          dealBreakers: formData.dealBreakers,
          industryDomain: formData.industryDomain,
          customIndustry: formData.customIndustry,
          requirements: formData.requirements,
        },
      });
      onSave(formData);
      toast({
        title: "Success",
        description: "Requirements updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error updating requirements:", error);
      toast({
        title: "Error",
        description: "Failed to update requirements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndustryToggle = (industry: string) => {
    setFormData((prev) => {
      const industries = prev.industryDomain;
      return {
        ...prev,
        industryDomain: industries.includes(industry)
          ? industries.filter((i) => i !== industry)
          : [...industries, industry],
      };
    });
  };

  const addDealBreaker = () => {
    if (newDealBreaker.trim()) {
      setFormData((prev) => ({
        ...prev,
        dealBreakers: [...prev.dealBreakers, newDealBreaker.trim()],
      }));
      setNewDealBreaker("");
    }
  };

  const removeDealBreaker = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dealBreakers: prev.dealBreakers.filter((_, i) => i !== index),
    }));
  };

  const addCustomIndustry = () => {
    if (newCustomIndustry.trim()) {
      setFormData((prev) => ({
        ...prev,
        customIndustry: [
          ...(prev.customIndustry || []),
          newCustomIndustry.trim(),
        ],
      }));
      setNewCustomIndustry("");
    }
  };

  const removeCustomIndustry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customIndustry: prev.customIndustry?.filter((_, i) => i !== index) || [],
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Requirements"
      className="max-w-lg"
    >
      <div className="flex flex-col h-[calc(80vh-100px)]">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center text-violet-200">
              <Star className="w-4 h-4 mr-2 text-violet-400" />
              Experience
            </Label>
            <Textarea
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              placeholder="Describe your relevant experience..."
              className="min-h-[100px] bg-white/5 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-violet-200">
              <AlertCircle className="w-4 h-4 mr-2 text-violet-400" />
              Deal Breakers
            </Label>
            <div className="flex gap-2">
              <Input
                value={newDealBreaker}
                onChange={(e) => setNewDealBreaker(e.target.value)}
                placeholder="Add deal breaker..."
                className="bg-white/5 border-white/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDealBreaker();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addDealBreaker}
                className="bg-violet-500/20 hover:bg-violet-500/30 p-2"
              >
                <Plus className="h-4 w-4 text-violet-200" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.dealBreakers.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-violet-500/10 text-violet-200 border-violet-500/20 flex items-center gap-1"
                >
                  {item}
                  <button
                    onClick={() => removeDealBreaker(index)}
                    className="ml-1 hover:text-violet-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-violet-200">
              <Briefcase className="w-4 h-4 mr-2 text-violet-400" />
              Industry Domains
            </Label>
            <MultiSelect
              options={INDUSTRY_DOMAINS.map((pref) => ({
                id: pref.value,
                label: pref.title,
              }))}
              selectedValues={formData.industryDomain}
              onChange={(values) =>
                setFormData((prev) => ({
                  ...prev,
                  industryDomain: values,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-violet-200">
              <Briefcase className="w-4 h-4 mr-2 text-violet-400" />
              Custom Industries
            </Label>
            <div className="flex gap-2">
              <Input
                value={newCustomIndustry}
                onChange={(e) => setNewCustomIndustry(e.target.value)}
                placeholder="Add custom industry..."
                className="bg-white/5 border-white/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomIndustry();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addCustomIndustry}
                className="bg-violet-500/20 hover:bg-violet-500/30 p-2"
              >
                <Plus className="h-4 w-4 text-violet-200" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.customIndustry?.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-violet-500/10 text-violet-200 border-violet-500/20 flex items-center gap-1"
                >
                  {item}
                  <button
                    onClick={() => removeCustomIndustry(index)}
                    className="ml-1 hover:text-violet-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-violet-200">
              <FileText className="w-4 h-4 mr-2 text-violet-400" />
              Requirements
            </Label>
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add requirement..."
                className="bg-white/5 border-white/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addRequirement}
                className="bg-violet-500/20 hover:bg-violet-500/30 p-2"
              >
                <Plus className="h-4 w-4 text-violet-200" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requirements.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-violet-500/10 text-violet-200 border-violet-500/20 flex items-center gap-1"
                >
                  {item}
                  <button
                    onClick={() => removeRequirement(index)}
                    className="ml-1 hover:text-violet-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 mt-4 border-t border-violet-800/30">
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
