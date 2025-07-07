import React, { useState } from "react";
import { Input } from "@/components/UI/input";
import { SocialMediaIcons } from "@/components/Forms/SocialMediaIcons";
import { ImageUpload } from "@/components/Forms/ImageUpload";
import { FormSectionLayout } from "@/components/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Forms/RightContentLayout";
import { motion } from "framer-motion";

interface PersonalDetailsSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  onFirstSection?: () => void;
}

export function PersonalDetailsSection({
  onNext,
  onPrev,
  onSkip,
  onFirstSection,
}: PersonalDetailsSectionProps) {
  const [socialLinks, setSocialLinks] = useState<
    { platform: string; url: string }[]
  >([]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  // Animation variants
  const containerVariants = {
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

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const rightContent = (
    <RightContentLayout
      title="Personal Details"
      subtitle="Let's start with the basics. Tell us about yourself."
      features={[
        {
          icon: "fa-user",
          title: "Identity",
          description:
            "Your name and basic information help us personalize your experience",
        },
        {
          icon: "fa-envelope",
          title: "Contact",
          description: "We'll use this to keep you updated about your account",
        },
        {
          icon: "fa-shield",
          title: "Security",
          description:
            "Your information is secure and will only be used as specified",
        },
      ]}
    />
  );

  return (
    <FormSectionLayout
      title="Contact Details"
      description="Let's get your essential information"
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
      onFirstSection={onFirstSection}
      rightContent={rightContent}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Required Fields */}
        <motion.div variants={containerVariants} className="space-y-4">
          {/* Email Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-envelope text-white/40 text-lg" />
            </div>
            <Input
              id="email"
              type="email"
              required
              placeholder="Email Address"
              className="bg-white/5 border-white/10 text-white pl-10"
            />
          </motion.div>

          {/* Phone Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-phone text-white/40 text-lg" />
            </div>
            <Input
              id="phone"
              type="tel"
              required
              placeholder="Phone Number"
              className="bg-white/5 border-white/10 text-white pl-10"
            />
          </motion.div>

          {/* Website Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-globe text-white/40 text-lg" />
            </div>
            <Input
              id="website"
              type="url"
              placeholder="Website URL"
              className="bg-white/5 border-white/10 text-white pl-10"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SocialMediaIcons onSocialLinksChange={setSocialLinks} />
          </motion.div>
        </motion.div>

        {/* Profile Images */}
        <motion.div variants={containerVariants} className="space-y-4">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <ImageUpload
              type="profile"
              image={profilePicture}
              onImageChange={setProfilePicture}
              className="flex-shrink-0"
            />
            <div className="flex-grow pl-6">
              <h3 className="text-white font-medium mb-1">Profile Picture</h3>
              <p className="text-white/60 text-sm">
                Add a professional photo to help others recognize you
              </p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <ImageUpload
              type="banner"
              image={bannerImage}
              onImageChange={setBannerImage}
              className="w-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
