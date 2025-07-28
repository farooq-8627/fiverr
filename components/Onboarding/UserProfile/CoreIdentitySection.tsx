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
  useUserProfileForm,
  useUserProfileFormFields,
} from "@/components/Onboarding/UserProfile/context/UserProfileFormContext";

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
    useUserProfileForm();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useUserProfileFormFields();

  // Get form data
  const formData = watch();
  const fullName = formData?.coreIdentity?.fullName || "";
  const bio = formData?.coreIdentity?.bio || "";
  const tagline = formData?.coreIdentity?.tagline || "";
  const validateAndProceed = () => {
    // Validate company fields if hasCompany is true
    if (!fullName) {
      toast.error("Full name is required");
      return;
    }
    if (!bio) {
      toast.error("Bio is required");
      return;
    }
    if (!tagline) {
      toast.error("Tagline is required");
      return;
    }
    handleNext();
  };

  const rightContent = (
    <RightContentLayout
      title="Establish Your Identity"
      subtitle="Create a strong professional presence that resonates with potential clients."
      features={[
        {
          icon: "fa-users",
          title: "Full Name",
          description: "Share your full name",
        },
        {
          icon: "fa-building",
          title: "Bio",
          description: "Create a bio to showcase your organization",
        },
        {
          icon: "fa-id-badge",
          title: "Tagline",
          description:
            "Define your tagline and position within your organization",
        },
      ]}
      currentStep={2}
      totalSteps={7}
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
                setValue("coreIdentity.fullName", e.target.value, {
                  shouldValidate: true,
                })
              }
              className="bg-white/5 text-white placeholder:text-white/40"
            />
            {errors.coreIdentity?.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.coreIdentity?.fullName.message as string}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Textarea
              placeholder="What's your bio?"
              value={bio}
              onChange={(e) =>
                setValue("coreIdentity.bio", e.target.value, {
                  shouldValidate: true,
                })
              }
              className="bg-white/5 text-white placeholder:text-white/40"
            />
            {errors.coreIdentity?.bio && (
              <p className="text-red-500 text-sm mt-1">
                {errors.coreIdentity?.bio.message as string}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              placeholder="What's your tagline?"
              value={tagline}
              onChange={(e) =>
                setValue("coreIdentity.tagline", e.target.value, {
                  shouldValidate: true,
                })
              }
              className="bg-white/5 text-white placeholder:text-white/40"
            />
            {errors.coreIdentity?.tagline && (
              <p className="text-red-500 text-sm mt-1">
                {errors.coreIdentity?.tagline.message as string}
              </p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
