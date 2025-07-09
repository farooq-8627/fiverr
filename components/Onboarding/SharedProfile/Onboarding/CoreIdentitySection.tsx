import React, { useState } from "react";
import { Input } from "@/components/UI/input";
import { Switch } from "@/components/UI/switch";
import { Textarea } from "@/components/UI/textarea";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { ImageUpload } from "@/components/Onboarding/Forms/ImageUpload";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { TEAM_SIZES } from "@/sanity/schemaTypes/constants";
import { convertToSelectFormat } from "@/lib/utils";
import { toast } from "sonner";
import {
  useAgentProfileForm,
  useAgentProfileFormFields,
} from "@/components/Onboarding/AgentProfile/context/AgentProfileFormContext";

// Animation variants
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

const companyDetailsVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1.0],
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Use the correct utility function for Select components
const teamSizes = convertToSelectFormat(TEAM_SIZES);

export function CoreIdentitySection() {
  const { handleNext, handlePrev, handleSkip, canProceed } =
    useAgentProfileForm();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useAgentProfileFormFields();

  // Get form data
  const formData = watch();
  const fullName = formData?.fullName || "";
  const hasCompany = formData?.hasCompany || false;
  const company = formData?.company || {
    name: "",
    teamSize: "",
    bio: "",
    website: "",
    logo: null as File | null,
    banner: null as File | null,
  };

  // Ensure logo and banner are properly typed
  const companyLogo = company.logo || null;
  const companyBanner = company.banner || null;

  // Handle company updates
  const updateCompany = (updates: any) => {
    const updatedCompany = {
      ...company,
      ...updates,
    };
    setValue("company", updatedCompany, { shouldValidate: true });
  };

  // Handle file uploads
  const handleLogoUpload = (file: File | null) => {
    updateCompany({ logo: file });
  };

  const handleBannerUpload = (file: File | null) => {
    updateCompany({ banner: file });
  };

  const validateAndProceed = () => {
    // Validate company fields if hasCompany is true
    if (hasCompany) {
      if (!company.name?.trim()) {
        toast.error("Please enter your company name");
        return;
      }
      if (!company.bio?.trim()) {
        toast.error("Please enter your company description");
        return;
      }
    }
    handleNext();
  };

  const rightContent = (
    <RightContentLayout
      title="Establish Your Identity"
      subtitle="Create a strong professional presence that resonates with potential clients."
      features={[
        {
          icon: "fa-building",
          title: "Company Profile",
          description: "Create a company profile to showcase your organization",
        },
        {
          icon: "fa-id-badge",
          title: "Professional Role",
          description: "Define your role and position within your organization",
        },
        {
          icon: "fa-users",
          title: "Team Structure",
          description: "Share your team size and organizational capabilities",
        },
      ]}
      currentStep={2}
      totalSteps={6}
    />
  );

  return (
    <FormSectionLayout
      title="Core Identity"
      description="Tell us about yourself and your business"
      onNext={validateAndProceed}
      onPrev={handlePrev}
      onSkip={handleSkip}
      rightContent={rightContent}
    >
      <motion.div
        className="space-y-4 max-h-[calc(85vh-12rem)] overflow-y-auto px-0.5 py-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-4">
          <motion.div variants={itemVariants}>
            <Input
              placeholder="What's your full name?"
              value={fullName}
              onChange={(e) =>
                setValue("fullName", e.target.value, { shouldValidate: true })
              }
              className="bg-white/5 text-white placeholder:text-white/40"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message as string}
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex items-center justify-between py-1"
            variants={itemVariants}
          >
            <motion.div>
              <motion.p className="text-sm font-medium text-white">
                Do you have a company?
              </motion.p>
              <motion.p className="text-xs text-white/60">
                Create a company profile to showcase your business
              </motion.p>
            </motion.div>
            <Switch
              checked={hasCompany}
              onCheckedChange={(checked) =>
                setValue("hasCompany", checked, { shouldValidate: true })
              }
            />
          </motion.div>

          <AnimatePresence>
            {hasCompany && (
              <motion.div
                className="space-y-4"
                variants={companyDetailsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div variants={itemVariants}>
                  <Input
                    placeholder="Your company name"
                    value={company.name || ""}
                    onChange={(e) =>
                      updateCompany({
                        name: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white placeholder:text-white/40"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Select
                    value={company.teamSize || ""}
                    onValueChange={(value) =>
                      updateCompany({ teamSize: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 text-white">
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

                <motion.div variants={itemVariants}>
                  <Textarea
                    placeholder="Tell us about your company's mission and expertise..."
                    value={company.bio || ""}
                    onChange={(e) =>
                      updateCompany({
                        bio: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white placeholder:text-white/40 min-h-[60px] max-h-[120px] resize-none"
                  />
                </motion.div>

                <motion.div className="relative" variants={itemVariants}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="fas fa-globe text-white/40 text-sm" />
                  </div>
                  <Input
                    type="url"
                    placeholder="Company website URL"
                    value={company.website || ""}
                    onChange={(e) =>
                      updateCompany({
                        website: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white placeholder:text-white/40 pl-10"
                  />
                </motion.div>

                <motion.div className="space-y-4" variants={itemVariants}>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between"
                  >
                    <ImageUpload
                      type="logo"
                      image={companyLogo}
                      onImageChange={handleLogoUpload}
                      className="flex-shrink-0"
                    />
                    <div className="flex-grow pl-6">
                      <h3 className="text-white font-medium mb-1">
                        Company Logo
                      </h3>
                      <p className="text-white/60 text-sm">
                        Add your company logo for better brand recognition
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <ImageUpload
                      type="banner"
                      image={companyBanner}
                      onImageChange={handleBannerUpload}
                      className="w-full"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
