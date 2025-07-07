import React, { useState } from "react";
import { Input } from "@/components/UI/input";
import { FormSectionLayout } from "@/components/Forms/FormSectionLayout";
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
}: AutomationProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [otherServices, setOtherServices] = useState("");
  const [otherTools, setOtherTools] = useState("");

  return (
    <FormSectionLayout
      title={title}
      description={description}
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
      rightContent={rightContent}
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
          <motion.div variants={itemVariants}>
            <MultiSelect
              options={servicesOptions}
              selectedValues={selectedServices}
              onChange={setSelectedServices}
              className="pt-1"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              type="text"
              placeholder={servicesPlaceholder}
              value={otherServices}
              onChange={(e) => setOtherServices(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
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
          <motion.div variants={itemVariants}>
            <MultiSelect
              options={toolsOptions}
              selectedValues={selectedTools}
              onChange={setSelectedTools}
              className="pt-1"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              type="text"
              placeholder={toolsPlaceholder}
              value={otherTools}
              onChange={(e) => setOtherTools(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
