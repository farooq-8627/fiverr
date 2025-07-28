"use client";
import React from "react";
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
import {
  useClientProfileForm,
  useClientProfileFormFields,
} from "../context/ClientProfileFormContext";
import { toast } from "sonner";

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

export function ProjectDetails() {
  const { handleNext, handlePrev, handleSkip } = useClientProfileForm();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useClientProfileFormFields();

  // Get form data
  const formData = watch();

  // Project requirements fields
  const projectTitle = formData?.projectTitle || "";
  const businessDomain = formData?.businessDomain || "";
  const projectDescription = formData?.projectDescription || "";
  const painPoints = formData?.painPoints || "";

  // Validate and proceed to next step
  const validateAndProceed = () => {
    const values = watch();
    const errors = [];

    if (!values.projectTitle?.trim()) {
      errors.push("Please enter a project title");
    }

    if (!values.businessDomain?.trim()) {
      errors.push("Please select a business domain");
    }

    if (!values.projectDescription?.trim()) {
      errors.push("Please provide a project description");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    handleNext();
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
      currentStep={5}
      totalSteps={7}
    />
  );

  return (
    <FormSectionLayout
      title="Project Details"
      description="Tell us about your automation project"
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
        <motion.div variants={itemVariants} className="space-y-2">
          <Input
            placeholder="Enter your project title"
            value={projectTitle}
            onChange={(e) =>
              setValue("projectTitle", e.target.value, { shouldValidate: true })
            }
            className="bg-white/5 text-white placeholder:text-white/40"
          />
          {errors.projectTitle && (
            <p className="text-red-500 text-sm">
              {errors.projectTitle.message as string}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Select
            value={businessDomain}
            onValueChange={(value) =>
              setValue("businessDomain", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="bg-white/5 text-white">
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
          {errors.businessDomain && (
            <p className="text-red-500 text-sm">
              {errors.businessDomain.message as string}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium text-white/60">
            Project Description
          </label>
          <Textarea
            placeholder="Describe your project in detail. What are you trying to achieve?"
            value={projectDescription}
            onChange={(e) =>
              setValue("projectDescription", e.target.value, {
                shouldValidate: true,
              })
            }
            className="bg-white/5 text-white placeholder:text-white/40 min-h-[100px]"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium text-white/60">
            Current Challenges
          </label>
          <Textarea
            placeholder="What challenges or pain points are you currently facing that you want to solve with automation?"
            value={painPoints}
            onChange={(e) =>
              setValue("painPoints", e.target.value, { shouldValidate: true })
            }
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
