import React, { useState, useEffect } from "react";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { motion, Variants } from "framer-motion";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { INDUSTRY_DOMAINS } from "@/sanity/schemaTypes/constants";
import { convertToSelectFormat } from "@/lib/constants-utils";
import { ProjectRequirements } from "@/types/profile";

interface ProjectDetailsProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  formData?: any;
  setFormData?: (data: any) => void;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    y: 0,
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
    y: 10,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Use centralized constants converted to the format needed by the component
const businessDomains = convertToSelectFormat(INDUSTRY_DOMAINS);

export function ProjectDetails({
  onNext,
  onPrev,
  onSkip,
  formData,
  setFormData,
}: ProjectDetailsProps) {
  const [projectRequirements, setProjectRequirements] =
    useState<ProjectRequirements>({
      title: "",
      description: "",
      businessDomain: "",
      painPoints: "",
    });

  // Initialize from formData if available
  useEffect(() => {
    if (formData) {
      setProjectRequirements({
        title: formData.projectTitle || "",
        description: formData.projectDescription || "",
        businessDomain: formData.businessDomain || "",
        painPoints: formData.painPoints || "",
      });
    }
  }, [formData]);

  const updateField = (field: keyof ProjectRequirements, value: string) => {
    setProjectRequirements((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update parent form data if available
    if (setFormData) {
      const updatedData: any = {};
      switch (field) {
        case "title":
          updatedData.projectTitle = value;
          break;
        case "description":
          updatedData.projectDescription = value;
          break;
        case "businessDomain":
          updatedData.businessDomain = value;
          break;
        case "painPoints":
          updatedData.painPoints = value;
          break;
      }
      setFormData({ ...formData, ...updatedData });
    }
  };

  // Custom next handler
  const handleNext = () => {
    // Save all data to parent form before proceeding
    if (setFormData && formData) {
      setFormData({
        ...formData,
        projectTitle: projectRequirements.title,
        businessDomain: projectRequirements.businessDomain,
        projectDescription: projectRequirements.description,
        painPoints: projectRequirements.painPoints,
      });
    }
    onNext();
  };

  const rightContent = (
    <RightContentLayout
      title="Project Requirements"
      subtitle="Help us understand your project better to match you with the right automation expert."
      features={[
        {
          icon: "fa-lightbulb",
          title: "Clear Vision",
          description: "Define your project goals and requirements clearly",
        },
        {
          icon: "fa-bullseye",
          title: "Perfect Match",
          description: "Get matched with experts who specialize in your domain",
        },
        {
          icon: "fa-chart-line",
          title: "Better Results",
          description: "Detailed requirements lead to more accurate solutions",
        },
      ]}
      currentStep={3}
      totalSteps={6}
    />
  );

  return (
    <FormSectionLayout
      title="Project Details"
      description="Tell us about your automation project"
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
        <motion.div variants={itemVariants} className="space-y-2">
          {/* <label className="text-sm font-medium text-white/60">
            Project Title
          </label> */}
          <Input
            placeholder="Enter your project title"
            value={projectRequirements.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="bg-white/5 text-white placeholder:text-white/40"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          {/* <label className="text-sm font-medium text-white/60">
            Business Domain
          </label> */}
          <Select
            value={projectRequirements.businessDomain}
            onValueChange={(value) => updateField("businessDomain", value)}
          >
            <SelectTrigger className="bg-white/5  text-white">
              <SelectValue placeholder="Select your business domain" />
            </SelectTrigger>
            <SelectContent>
              {businessDomains.map((domain) => (
                <SelectItem key={domain.value} value={domain.value}>
                  {domain.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium text-white/60">
            Project Description
          </label>
          <Textarea
            placeholder="Describe your project in detail. What are you trying to achieve?"
            value={projectRequirements.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="bg-white/5  text-white placeholder:text-white/40 min-h-[100px]"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium text-white/60">
            Current Challenges
          </label>
          <Textarea
            placeholder="What challenges or pain points are you currently facing that you want to solve with automation?"
            value={projectRequirements.painPoints}
            onChange={(e) => updateField("painPoints", e.target.value)}
            className="bg-white/5 text-white placeholder:text-white/40 min-h-[100px]"
          />
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
                Pro Tip: Detailed Requirements Get Better Results
              </motion.h4>
              <motion.p
                variants={itemVariants}
                className="text-sm text-white/70"
              >
                Projects with detailed descriptions are{" "}
                <span className="text-purple-400 font-medium">
                  5x more likely
                </span>{" "}
                to find the perfect automation expert. Be specific about your
                goals, challenges, and desired outcomes.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
