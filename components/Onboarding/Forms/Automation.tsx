import React from "react";
import { Input } from "@/components/UI/input";
import { FormSectionLayout } from "./FormSectionLayout";
import { MultiSelect } from "@/components/UI/MultiSelect";
import { motion, Variants } from "framer-motion";

interface Option {
  id: string;
  label: string;
}

interface AutomationProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  rightContent: React.ReactNode;
  title?: string;
  description?: string;
  servicesTitle?: string;
  toolsTitle?: string;
  servicesOptions: Option[];
  toolsOptions: Option[];
  servicesPlaceholder?: string;
  toolsPlaceholder?: string;
  initialServices?: string[];
  initialTools?: string[];
  customServices?: string[];
  customTools?: string[];
  onServicesChange: (services: string[]) => void;
  onToolsChange: (tools: string[]) => void;
  errors?: {
    services?: string;
    tools?: string;
  };
  canProceed?: boolean;
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

export function Automation({
  onNext,
  onPrev,
  onSkip,
  rightContent,
  title = "Automation Expertise",
  description = "Select your primary automation services and tools expertise",
  servicesTitle = "Primary Automation Services",
  toolsTitle = "Tools/Platforms Expertise",
  servicesOptions,
  toolsOptions,
  servicesPlaceholder = "Other automation services...",
  toolsPlaceholder = "Other tools or platforms...",
  initialServices = [],
  initialTools = [],
  onServicesChange,
  onToolsChange,
  errors = {},
  canProceed = false,
}: AutomationProps) {
  // Handle next button click
  const handleNext = () => {
    if (canProceed) {
      onNext();
    }
  };

  return (
    <FormSectionLayout
      title={title}
      description={description}
      onNext={handleNext}
      onPrev={onPrev}
      onSkip={onSkip}
      rightContent={rightContent}
      canProceed={canProceed}
    >
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Primary Automation Services */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.div
            className="border-b border-white/[0.08] pb-3"
            variants={itemVariants}
          >
            <h3 className="text-xl font-medium text-white/90">
              {servicesTitle}
            </h3>
          </motion.div>
          <motion.div variants={itemVariants} className="automation-services">
            <MultiSelect
              options={servicesOptions}
              selectedValues={initialServices}
              onChange={onServicesChange}
              className="pt-1"
            />
            {errors.services && (
              <p className="text-red-500 text-sm mt-2">{errors.services}</p>
            )}
          </motion.div>
        </motion.div>

        {/* Tools/Platforms Expertise */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.div
            className="border-b border-white/[0.08] pb-3"
            variants={itemVariants}
          >
            <h3 className="text-xl font-medium text-white/90">{toolsTitle}</h3>
          </motion.div>
          <motion.div variants={itemVariants} className="tools-expertise">
            <MultiSelect
              options={toolsOptions}
              selectedValues={initialTools}
              onChange={onToolsChange}
              className="pt-1"
            />
            {errors.tools && (
              <p className="text-red-500 text-sm mt-2">{errors.tools}</p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
