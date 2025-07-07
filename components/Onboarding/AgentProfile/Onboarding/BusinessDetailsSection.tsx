import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { MultiSelect } from "@/components/UI/MultiSelect";
import {
  PRICING_MODELS,
  PROJECT_SIZE_PREFERENCES,
  TEAM_SIZES,
  AVAILABILITY_OPTIONS,
} from "@/sanity/schemaTypes/constants";
import {
  convertToOnboardingFormat,
  convertToSelectFormat,
} from "@/lib/constants-utils";

interface BusinessDetailsSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
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
    y: -20,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1.0],
    },
  },
};

// Use centralized constants converted to the format needed by the component
const pricingModels = convertToSelectFormat(PRICING_MODELS);
const projectSizes = convertToOnboardingFormat(PROJECT_SIZE_PREFERENCES);
const teamSizes = convertToSelectFormat(TEAM_SIZES);
const availabilityOptions = convertToSelectFormat(AVAILABILITY_OPTIONS);

export function BusinessDetailsSection({
  onNext,
  onPrev,
  onSkip,
}: BusinessDetailsSectionProps) {
  const [pricingModel, setPricingModel] = useState("");
  const [selectedProjectSizes, setSelectedProjectSizes] = useState<string[]>(
    []
  );
  const [teamSize, setTeamSize] = useState("");
  const [availability, setAvailability] = useState("");

  const rightContent = (
    <RightContentLayout
      title="Structure Your Business"
      subtitle="Define your business model and preferences to attract the right opportunities."
      features={[
        {
          icon: "fa-briefcase",
          title: "Project Alignment",
          description:
            "Match projects that fit your pricing model and preferred project size",
        },
        {
          icon: "fa-users",
          title: "Team Compatibility",
          description:
            "Connect with clients whose team size matches your capacity",
        },
        {
          icon: "fa-clock",
          title: "Availability Management",
          description:
            "Set clear expectations about your working hours and commitment",
        },
      ]}
      currentStep={4}
      totalSteps={6}
    />
  );

  return (
    <FormSectionLayout
      title="Business Details"
      description="Set your business structure and project preferences"
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
      rightContent={rightContent}
    >
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Pricing Model */}
        <motion.div variants={itemVariants}>
          <Select value={pricingModel} onValueChange={setPricingModel}>
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="What's your pricing model?" />
            </SelectTrigger>
            <SelectContent>
              {pricingModels.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Project Size Preferences - Keeping original layout */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <motion.div
            className="border-b border-white/[0.08] pb-2"
            variants={itemVariants}
          >
            <h3 className="text-lg font-medium text-white/90">
              Project Size Preferences
            </h3>
          </motion.div>
          <motion.div variants={itemVariants}>
            <MultiSelect
              options={projectSizes}
              selectedValues={selectedProjectSizes}
              onChange={setSelectedProjectSizes}
            />
          </motion.div>
          <motion.p className="text-xs text-white/60" variants={itemVariants}>
            Select the project budget ranges you're comfortable with
          </motion.p>
        </motion.div>

        {/* Team Size */}
        <motion.div variants={itemVariants}>
          <Select value={teamSize} onValueChange={setTeamSize}>
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="How big is your team?" />
            </SelectTrigger>
            <SelectContent>
              {teamSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Availability */}
        <motion.div variants={itemVariants}>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="What's your availability?" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Pro Tip Section */}
        <motion.div
          variants={itemVariants}
          className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-6"
        >
          <div className="flex items-start gap-3">
            <motion.div
              variants={itemVariants}
              className="p-2 rounded-lg bg-purple-500/20"
            >
              <i className="fas fa-lightbulb text-purple-400" />
            </motion.div>
            <div>
              <motion.h4
                variants={itemVariants}
                className="font-medium text-white mb-1"
              >
                Pro Tip: Complete Business Profile
              </motion.h4>
              <motion.p
                variants={itemVariants}
                className="text-sm text-white/70"
              >
                Agents with complete business profiles are{" "}
                <span className="text-purple-400 font-medium">
                  3x more likely
                </span>{" "}
                to match with their ideal clients. A detailed profile helps
                clients understand your business model and capacity.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
