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

interface ProjectScopeDetailsProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  formData?: any;
  setFormData?: (data: any) => void;
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
const budgetRanges = convertToSelectFormat(BUDGET_RANGES);
const timelineOptions = convertToSelectFormat(TIMELINE_OPTIONS);
const complexityOptions = convertToSelectFormat(PROJECT_COMPLEXITY);
const engagementTypes = convertToSelectFormat(ENGAGEMENT_TYPES);
const teamSizes = convertToSelectFormat(TEAM_SIZES);
const experienceLevels = convertToSelectFormat(EXPERIENCE_LEVELS);

export function ProjectScopeDetails({
  onNext,
  onPrev,
  onSkip,
  formData,
  setFormData,
}: ProjectScopeDetailsProps) {
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [complexity, setComplexity] = useState("");
  const [engagementType, setEngagementType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [experience, setExperience] = useState("");

  // Initialize from formData if available
  useEffect(() => {
    if (formData) {
      setBudgetRange(formData.budgetRange || "");
      setTimeline(formData.timeline || "");
      setComplexity(formData.complexity || ""); // Fix: Use complexity instead of priority
      setEngagementType(formData.engagementType || "");
      setTeamSize(formData.teamSizeRequired || "");
      setExperience(formData.experienceLevel || "");
    }
  }, [formData]);

  // Update parent form data when local state changes
  const updateFormData = (field: string, value: string) => {
    if (setFormData && formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  // Custom handlers for each field
  const handleBudgetChange = (value: string) => {
    setBudgetRange(value);
    updateFormData("budgetRange", value);
  };

  const handleTimelineChange = (value: string) => {
    setTimeline(value);
    updateFormData("timeline", value);
  };

  const handleComplexityChange = (value: string) => {
    setComplexity(value);
    updateFormData("complexity", value); // Fix: Update complexity instead of priority
  };

  const handleEngagementChange = (value: string) => {
    setEngagementType(value);
    updateFormData("engagementType", value);
  };

  const handleTeamSizeChange = (value: string) => {
    setTeamSize(value);
    updateFormData("teamSizeRequired", value);
  };

  const handleExperienceChange = (value: string) => {
    setExperience(value);
    updateFormData("experienceLevel", value);
  };

  // Custom next handler
  const handleNext = () => {
    // Save all data to parent form before proceeding
    if (setFormData && formData) {
      setFormData({
        ...formData,
        budgetRange,
        timeline,
        complexity, // Fix: Use complexity instead of priority
        engagementType,
        teamSizeRequired: teamSize,
        experienceLevel: experience,
      });
    }
    onNext();
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
      onNext={handleNext}
      onPrev={onPrev}
      onSkip={onSkip}
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
          <Select value={budgetRange} onValueChange={handleBudgetChange}>
            <SelectTrigger className="w-full bg-white/5  text-white">
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
        </motion.div>

        {/* Timeline */}
        <motion.div variants={itemVariants}>
          <Select value={timeline} onValueChange={handleTimelineChange}>
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
        </motion.div>

        {/* Project Complexity */}
        <motion.div variants={itemVariants}>
          <Select value={complexity} onValueChange={handleComplexityChange}>
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
        </motion.div>

        {/* Type of Engagement */}
        <motion.div variants={itemVariants}>
          <Select value={engagementType} onValueChange={handleEngagementChange}>
            <SelectTrigger className="w-full bg-white/5  text-white">
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
        </motion.div>

        {/* Team Size */}
        <motion.div variants={itemVariants}>
          <Select value={teamSize} onValueChange={handleTeamSizeChange}>
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
          <Select value={experience} onValueChange={handleExperienceChange}>
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
