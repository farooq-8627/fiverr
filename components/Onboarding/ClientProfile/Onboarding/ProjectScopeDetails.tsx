"use client";
import React, { useState, useEffect } from "react";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { motion, Variants } from "framer-motion";
import {
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  PROJECT_COMPLEXITY,
  ENGAGEMENT_TYPES,
  TEAM_SIZES,
  EXPERIENCE_LEVELS,
} from "@/sanity/schemaTypes/constants";
import { convertToSelectFormat } from "@/lib/constants-utils";
import {
  useClientProfileForm,
  useClientProfileFormFields,
} from "../context/ClientProfileFormContext";
import { toast } from "sonner";

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
const budgetRanges = convertToSelectFormat(BUDGET_RANGES);
const timelineOptions = convertToSelectFormat(TIMELINE_OPTIONS);
const complexityOptions = convertToSelectFormat(PROJECT_COMPLEXITY);
const engagementTypes = convertToSelectFormat(ENGAGEMENT_TYPES);
const teamSizes = convertToSelectFormat(TEAM_SIZES);
const experienceLevels = convertToSelectFormat(EXPERIENCE_LEVELS);

export function ProjectScopeDetails() {
  const { handleNext, handlePrev, handleSkip } = useClientProfileForm();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useClientProfileFormFields();

  // Get form data
  const formData = watch();
  const budgetRange = formData?.budgetRange || "";
  const timeline = formData?.timeline || "";
  const complexity = formData?.complexity || "";
  const engagementType = formData?.engagementType || "";
  const teamSizeRequired = formData?.teamSizeRequired || "";
  const experienceLevel = formData?.experienceLevel || "";

  // Validate and proceed to next step
  const validateAndProceed = () => {
    if (!budgetRange) {
      toast.error("Please select a budget range");
      return;
    }

    if (!timeline) {
      toast.error("Please select a timeline");
      return;
    }

    if (!complexity) {
      toast.error("Please select project complexity");
      return;
    }

    if (!engagementType) {
      toast.error("Please select an engagement type");
      return;
    }

    handleNext();
  };

  const rightContent = (
    <RightContentLayout
      title="Project Scope"
      subtitle="Help us understand the scale and requirements of your project"
      features={[
        {
          icon: "fa-coins",
          title: "Budget & Timeline",
          description:
            "Set clear expectations for project resources and scheduling",
        },
        {
          icon: "fa-chart-line",
          title: "Project Scale",
          description: "Define the complexity and type of engagement needed",
        },
        {
          icon: "fa-users",
          title: "Team Context",
          description: "Share your team's size and automation experience",
        },
      ]}
      currentStep={4}
      totalSteps={6}
    />
  );

  return (
    <FormSectionLayout
      title="Project Scope"
      description="Define the scale and requirements of your automation project"
      onNext={validateAndProceed}
      onPrev={handlePrev}
      onSkip={handleSkip}
      rightContent={rightContent}
    >
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Budget Range */}
        <motion.div variants={itemVariants}>
          <Select
            value={budgetRange}
            onValueChange={(value) =>
              setValue("budgetRange", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select your budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budgetRange && (
            <p className="text-red-500 text-sm">
              {errors.budgetRange.message as string}
            </p>
          )}
        </motion.div>

        {/* Timeline */}
        <motion.div variants={itemVariants}>
          <Select
            value={timeline}
            onValueChange={(value) =>
              setValue("timeline", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select your preferred timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelineOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeline && (
            <p className="text-red-500 text-sm">
              {errors.timeline.message as string}
            </p>
          )}
        </motion.div>

        {/* Project Complexity */}
        <motion.div variants={itemVariants}>
          <Select
            value={complexity}
            onValueChange={(value) =>
              setValue("complexity", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select the project complexity" />
            </SelectTrigger>
            <SelectContent>
              {complexityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.complexity && (
            <p className="text-red-500 text-sm">
              {errors.complexity.message as string}
            </p>
          )}
        </motion.div>

        {/* Type of Engagement */}
        <motion.div variants={itemVariants}>
          <Select
            value={engagementType}
            onValueChange={(value) =>
              setValue("engagementType", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select the type of engagement" />
            </SelectTrigger>
            <SelectContent>
              {engagementTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.engagementType && (
            <p className="text-red-500 text-sm">
              {errors.engagementType.message as string}
            </p>
          )}
        </motion.div>

        {/* Team Size */}
        <motion.div variants={itemVariants}>
          <Select
            value={teamSizeRequired}
            onValueChange={(value) =>
              setValue("teamSizeRequired", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select your team size" />
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

        {/* Automation Experience */}
        <motion.div variants={itemVariants}>
          <Select
            value={experienceLevel}
            onValueChange={(value) =>
              setValue("experienceLevel", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full bg-white/5 text-white">
              <SelectValue placeholder="Select your automation experience" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Pro Tip Section */}
        <motion.div
          variants={itemVariants}
          className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-3"
          >
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
                Pro Tip: Well-Defined Scope Leads to Success
              </motion.h4>
              <motion.p
                variants={itemVariants}
                className="text-sm text-white/70"
              >
                Projects with clear scope and requirements are{" "}
                <span className="text-purple-400 font-medium">
                  3x more likely
                </span>{" "}
                to be completed on time and within budget. Take a moment to
                accurately define your project parameters.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
