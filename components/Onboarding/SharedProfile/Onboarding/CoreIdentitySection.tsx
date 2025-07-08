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

interface CoreIdentitySectionProps {
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
  formData?: any;
  setFormData?: (data: any) => void;
}

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

export function CoreIdentitySection({
  onNext,
  onPrev,
  onSkip,
  formData,
  setFormData,
}: CoreIdentitySectionProps) {
  // Local state for when no formData is provided
  const [localState, setLocalState] = useState({
    fullName: "",
    hasCompany: false,
    companyDetails: {
      name: "",
      teamSize: "",
      bio: "",
      website: "",
      logo: null as File | null,
      banner: null as File | null,
    },
  });

  // Use formData if provided, otherwise use local state
  const fullName = formData?.fullName ?? localState.fullName;
  const hasCompany = formData?.hasCompany ?? localState.hasCompany;
  const companyDetails = formData?.companyDetails ?? localState.companyDetails;

  // Update either formData or localState based on what's available
  const updateState = (updates: any) => {
    if (setFormData && formData) {
      setFormData({
        ...formData,
        ...updates,
      });
    } else {
      setLocalState((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  };

  // Handle company details updates
  const updateCompanyDetails = (updates: any) => {
    const updatedCompanyDetails = {
      ...(formData?.companyDetails ?? localState.companyDetails),
      ...updates,
    };

    if (setFormData && formData) {
      setFormData({
        ...formData,
        companyDetails: updatedCompanyDetails,
      });
    } else {
      setLocalState((prev) => ({
        ...prev,
        companyDetails: updatedCompanyDetails,
      }));
    }
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
      currentStep={1}
      totalSteps={6}
    />
  );

  return (
    <FormSectionLayout
      title="Core Identity"
      description="Tell us about yourself and your business"
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
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
              onChange={(e) => updateState({ fullName: e.target.value })}
              className="bg-white/5 text-white placeholder:text-white/40"
            />
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
                updateState({ hasCompany: checked })
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
                    value={companyDetails.name}
                    onChange={(e) =>
                      updateCompanyDetails({
                        name: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white placeholder:text-white/40"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Select
                    value={companyDetails.teamSize}
                    onValueChange={(value) =>
                      updateCompanyDetails({ teamSize: value })
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
                    value={companyDetails.bio}
                    onChange={(e) =>
                      updateCompanyDetails({
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
                    value={companyDetails.website}
                    onChange={(e) =>
                      updateCompanyDetails({
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
                      image={companyDetails.logo}
                      onImageChange={(file) =>
                        updateCompanyDetails({
                          logo: file,
                        })
                      }
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
                      image={companyDetails.banner}
                      onImageChange={(file) =>
                        updateCompanyDetails({
                          banner: file,
                        })
                      }
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
