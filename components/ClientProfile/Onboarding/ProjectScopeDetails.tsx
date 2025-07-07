import React, { useState } from "react";
import { FormSectionLayout } from "@/components/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Forms/RightContentLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { motion, Variants } from "framer-motion";

interface ProjectScopeDetailsProps {
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

const budgetRanges = [
  { value: "micro", label: "$0-500" },
  { value: "small", label: "$500 - $2,000" },
  { value: "medium", label: "$2,000 - $5,000" },
  { value: "large", label: "$5,000 - $10,000" },
  { value: "enterprise", label: "$10,000+" },
];

const timelineOptions = [
  { value: "asap", label: "ASAP" },
  { value: "1week", label: "Within 1 Week" },
  { value: "2weeks", label: "Within 2 Weeks" },
  { value: "1month", label: "Within 1 Month" },
  { value: "3months", label: "1-3 Months" },
  { value: "flexible", label: "Flexible" },
];

const complexityOptions = [
  { value: "simple", label: "Simple" },
  { value: "moderate", label: "Moderate" },
  { value: "complex", label: "Complex" },
  { value: "veryComplex", label: "Very Complex" },
];

const engagementTypes = [
  { value: "oneTime", label: "One-time Project" },
  { value: "ongoing", label: "Ongoing Support" },
  { value: "training", label: "Training & Implementation" },
];

const teamSizes = [
  { value: "solo", label: "Solo (1 member)" },
  { value: "small", label: "Small Team (2-5)" },
  { value: "medium", label: "Medium Team (5-10)" },
  { value: "large", label: "Large Team (10-50)" },
  { value: "enterprise", label: "Enterprise (50+)" },
];

const experienceLevels = [
  { value: "none", label: "No Prior Experience" },
  { value: "basic", label: "Basic Understanding" },
  { value: "moderate", label: "Some Experience" },
  { value: "extensive", label: "Extensive Experience" },
];

export function ProjectScopeDetails({
  onNext,
  onPrev,
  onSkip,
}: ProjectScopeDetailsProps) {
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [complexity, setComplexity] = useState("");
  const [engagementType, setEngagementType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [experience, setExperience] = useState("");

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
      onNext={onNext}
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
          <Select value={budgetRange} onValueChange={setBudgetRange}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
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
          <Select value={timeline} onValueChange={setTimeline}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
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
          <Select value={complexity} onValueChange={setComplexity}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
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
          <Select value={engagementType} onValueChange={setEngagementType}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
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
          <Select value={teamSize} onValueChange={setTeamSize}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
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
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
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
