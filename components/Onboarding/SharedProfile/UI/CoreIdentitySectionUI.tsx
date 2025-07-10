"use client";

import React from "react";
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

export interface CoreIdentitySectionUIProps {
  // Form control props
  handleNext: () => void;
  handlePrev: () => void;
  canProceed?: boolean;
  validateAndProceed: () => void;

  // Form data props
  fullName: string;
  hasCompany: boolean;
  companyName?: string;
  companySize?: string;
  companyBio?: string;
  companyWebsite?: string;
  companyLogo: File | null;
  companyBanner?: File | null;

  // Form handlers
  setFullName: (value: string) => void;
  setHasCompany?: (value: boolean) => void;
  setCompanyName?: (value: string) => void;
  setCompanySize?: (value: string) => void;
  setCompanyBio?: (value: string) => void;
  setCompanyWebsite?: (value: string) => void;
  handleLogoUpload: (file: File | null) => void;
  handleBannerUpload?: (file: File | null) => void;

  // Form validation errors
  errors: any;
  teamSizeOptions: { value: string; label: string }[];
  userType: "agent" | "client";
}

export function CoreIdentitySectionUI({
  handleNext,
  handlePrev,
  canProceed,
  validateAndProceed,
  fullName,
  hasCompany,
  companyName,
  companySize,
  companyBio,
  companyWebsite,
  companyLogo,
  companyBanner,
  setFullName,
  setHasCompany,
  setCompanyName,
  setCompanySize,
  setCompanyBio,
  setCompanyWebsite,
  handleLogoUpload,
  handleBannerUpload,
  errors,
  teamSizeOptions,
  userType,
}: CoreIdentitySectionUIProps) {
  // Create safe handler functions with null checks
  const handleCompanyNameChange = (value: string) => {
    if (setCompanyName) setCompanyName(value);
  };

  const handleCompanySizeChange = (value: string) => {
    if (setCompanySize) setCompanySize(value);
  };

  const handleCompanyBioChange = (value: string) => {
    if (setCompanyBio) setCompanyBio(value);
  };

  const handleCompanyWebsiteChange = (value: string) => {
    if (setCompanyWebsite) setCompanyWebsite(value);
  };

  const handleBannerChange = (file: File | null) => {
    if (handleBannerUpload) handleBannerUpload(file);
  };

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
      onNext={validateAndProceed}
      onPrev={handlePrev}
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
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white/5 text-white placeholder:text-white/40"
            />
            {errors?.fullName && (
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
                setHasCompany && setHasCompany(checked)
              }
            />
          </motion.div>

          <AnimatePresence>
            {/* Show company details if hasCompany is true */}
            {hasCompany && (
              <motion.div
                variants={companyDetailsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-2 pt-2"
              >
                <motion.div variants={itemVariants}>
                  <Input
                    placeholder="Company Name"
                    value={companyName || ""}
                    onChange={(e) => handleCompanyNameChange(e.target.value)}
                    className="bg-white/5 text-white placeholder:text-white/40"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Select
                    value={companySize || ""}
                    onValueChange={handleCompanySizeChange}
                  >
                    <SelectTrigger className="w-full bg-white/5 text-white">
                      <SelectValue placeholder="Team Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamSizeOptions.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {setCompanyBio && companyBio !== undefined && (
                  <motion.div variants={itemVariants}>
                    <Textarea
                      placeholder="Company Description"
                      value={companyBio}
                      onChange={(e) => handleCompanyBioChange(e.target.value)}
                      className="bg-white/5 text-white placeholder:text-white/40"
                    />
                  </motion.div>
                )}

                {setCompanyWebsite && companyWebsite !== undefined && (
                  <motion.div variants={itemVariants}>
                    <Input
                      placeholder="Company Website"
                      value={companyWebsite}
                      onChange={(e) =>
                        handleCompanyWebsiteChange(e.target.value)
                      }
                      className="bg-white/5 text-white placeholder:text-white/40"
                    />
                  </motion.div>
                )}

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
                        {companyLogo
                          ? "Edit or replace your company logo"
                          : "Add your company logo for better brand recognition"}
                      </p>
                    </div>
                  </motion.div>

                  {handleBannerUpload && companyBanner !== undefined && (
                    <motion.div variants={itemVariants}>
                      <ImageUpload
                        type="banner"
                        image={companyBanner}
                        onImageChange={handleBannerChange}
                        className="w-full"
                      />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
