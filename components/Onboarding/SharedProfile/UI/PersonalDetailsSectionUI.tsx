import React from "react";
import { Input } from "@/components/UI/input";
import { SocialMediaIcons } from "@/components/Onboarding/Forms/SocialMediaIcons";
import { ImageUpload } from "@/components/Onboarding/Forms/ImageUpload";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export interface PersonalDetailsSectionUIProps {
  // Form control props
  handleNext: () => void;
  goToFirstSection: () => void;
  canProceed?: boolean;

  // Form data props
  email: string;
  phone: string;
  username: string;
  website: string;
  socialLinks: { platform: string; url: string }[];
  profilePicture: File | null;
  bannerImage: File | null;

  // Form handlers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSocialLinksChange: (links: { platform: string; url: string }[]) => void;
  handleProfilePictureChange: (file: File | null) => void;
  handleBannerImageChange: (file: File | null) => void;

  // Right content customization
  subtitle?: string;
  userType: "agent" | "client";
}

export function PersonalDetailsSectionUI({
  handleNext,
  goToFirstSection,
  canProceed,
  email,
  phone,
  username,
  website,
  socialLinks,
  profilePicture,
  bannerImage,
  handleInputChange,
  handleSocialLinksChange,
  handleProfilePictureChange,
  handleBannerImageChange,
  subtitle = "Let's start with the basics. Tell us about yourself.",
  userType,
}: PersonalDetailsSectionUIProps) {
  const { user, isLoaded } = useUser();

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

  // If Clerk data is still loading, show a loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  const rightContent = (
    <RightContentLayout
      title="Personal Details"
      subtitle={subtitle}
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
      onNext={handleNext}
      onFirstSection={goToFirstSection}
      rightContent={rightContent}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Required Fields */}
        <motion.div variants={containerVariants} className="space-y-3">
          {/* Email Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-envelope text-white/40 text-lg" />
            </div>
            <Input
              id="email"
              type="email"
              required
              disabled={true}
              value={email || user?.emailAddresses[0]?.emailAddress || ""}
              placeholder="Email Address"
              className="bg-white/5 text-white pl-10 opacity-70"
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
              disabled={true}
              value={phone || user?.phoneNumbers[0]?.phoneNumber || ""}
              placeholder="Phone Number"
              className="bg-white/5 text-white pl-10 opacity-70"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-user text-white/40 text-lg" />
            </div>
            <Input
              id="username"
              type="text"
              required
              disabled={true}
              value={username || user?.username || ""}
              placeholder="Username"
              className="bg-white/5 text-white pl-10 opacity-70"
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
              value={website || ""}
              onChange={handleInputChange}
              placeholder="Website URL"
              className="bg-white/5 text-white pl-10"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SocialMediaIcons
              onSocialLinksChange={handleSocialLinksChange}
              initialLinks={socialLinks}
            />
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
              onImageChange={handleProfilePictureChange}
              className="flex-shrink-0"
            />
            <div className="flex-grow pl-6">
              <h3 className="text-white font-medium mb-1">Profile Picture</h3>
              <p className="text-white/60 text-sm">
                {profilePicture
                  ? "Edit or replace your profile photo"
                  : `Add a professional photo to help ${
                      userType === "agent" ? "clients" : "agents"
                    } recognize you`}
              </p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <ImageUpload
              type="banner"
              image={bannerImage}
              onImageChange={handleBannerImageChange}
              className="w-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
