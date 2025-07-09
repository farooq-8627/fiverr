import React from "react";
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
  WORKING_HOURS_PREFERENCES,
} from "@/sanity/schemaTypes/constants";
import {
  convertToOnboardingFormat,
  convertToSelectFormat,
} from "@/lib/constants-utils";
import {
  useAgentProfileForm,
  useAgentProfileFormFields,
} from "../context/AgentProfileFormContext";

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
const workTypeOptions = convertToSelectFormat(WORKING_HOURS_PREFERENCES);

export function BusinessDetailsSection() {
  const { handleNext, handlePrev, handleSkip } = useAgentProfileForm();
  const { watch, setValue } = useAgentProfileFormFields();

  // Get form data
  const formData = watch();

  // Get values from form data
  const pricingModel = formData?.pricingModel || "";
  const selectedProjectSizes = formData?.projectSizePreference || [];
  const teamSize = formData?.teamSize || "";
  const availability = formData?.availability || "";
  const workType = formData?.workType || "";

  // Custom handlers to update form data
  const handlePricingChange = (value: string) => {
    setValue("pricingModel", value, { shouldValidate: true });
  };

  const handleProjectSizesChange = (sizes: string[]) => {
    setValue("projectSizePreference", sizes, { shouldValidate: true });
  };

  const handleTeamSizeChange = (value: string) => {
    setValue("teamSize", value, { shouldValidate: true });
  };

  const handleAvailabilityChange = (value: string) => {
    setValue("availability", value, { shouldValidate: true });
  };

  const handleWorkTypeChange = (value: string) => {
    setValue("workType", value, { shouldValidate: true });
  };

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
      currentStep={5}
      totalSteps={6}
    />
  );

  return (
    <FormSectionLayout
      title="Business Details"
      description="Set your business structure and project preferences"
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
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
          <Select value={pricingModel} onValueChange={handlePricingChange}>
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
              onChange={handleProjectSizesChange}
            />
          </motion.div>
          <motion.p className="text-xs text-white/60" variants={itemVariants}>
            Select the project budget ranges you're comfortable with
          </motion.p>
        </motion.div>

        {/* Work Type */}
        <motion.div variants={itemVariants}>
          <Select value={workType} onValueChange={handleWorkTypeChange}>
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="What's your preferred work type?" />
            </SelectTrigger>
            <SelectContent>
              {workTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Team Size */}
        <motion.div variants={itemVariants}>
          <Select value={teamSize} onValueChange={handleTeamSizeChange}>
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
          <Select value={availability} onValueChange={handleAvailabilityChange}>
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
