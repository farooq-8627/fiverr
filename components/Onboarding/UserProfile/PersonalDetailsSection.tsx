import React, { useState, useEffect } from "react";
import { Input } from "@/components/UI/input";
import { SocialMediaIcons } from "@/components/Onboarding/Forms/SocialMediaIcons";
import { ImageUpload } from "@/components/Onboarding/Forms/ImageUpload";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  useUserProfileForm,
  useUserProfileFormFields,
} from "@/components/Onboarding/UserProfile/context/UserProfileFormContext";
import { Loader2 } from "lucide-react";

export function PersonalDetailsSection() {
  const { handleNext, goToFirstSection, canProceed } = useUserProfileForm();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useUserProfileFormFields();
  const { user, isLoaded } = useUser();

  // Get form data
  const formData = watch();

  // Initialize state with form data or Clerk data
  const [profilePicture, setProfilePicture] = useState(
    formData?.personalDetails?.profilePicture || null
  );
  const [bannerImage, setBannerImage] = useState(
    formData?.personalDetails?.bannerImage || null
  );
  const [socialLinks, setSocialLinks] = useState(
    formData?.personalDetails?.socialLinks || []
  );
  // Use Clerk data when available
  useEffect(() => {
    if (isLoaded && user) {
      // Get user data from Clerk
      const email = user.emailAddresses[0]?.emailAddress || "";
      const phone = user.phoneNumbers[0]?.phoneNumber || "";
      const username = user.username || "";

      // Set form values from Clerk data
      setValue("personalDetails.email", email);
      setValue("personalDetails.phone", phone);
      setValue("personalDetails.username", username);
    }
  }, [isLoaded, user, setValue]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setValue(`personalDetails.${id}` as any, value, { shouldValidate: true });
  };

  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file);
    setValue("personalDetails.profilePicture", file, { shouldValidate: true });
  };

  const handleBannerImageChange = (file: File | null) => {
    setBannerImage(file);
    setValue("personalDetails.bannerImage", file, { shouldValidate: true });
  };

  // Animation variants
  const handleSocialLinksChange = (
    links: { platform: string; url: string }[]
  ) => {
    setSocialLinks(links);
    setValue("personalDetails.socialLinks", links, {
      shouldValidate: true,
    });
  };

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
      onNext={handleNext}
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
              value={
                formData?.personalDetails?.email ||
                user?.emailAddresses[0]?.emailAddress ||
                ""
              }
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
              value={
                formData?.personalDetails?.phone ||
                user?.phoneNumbers[0]?.phoneNumber ||
                ""
              }
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
              value={
                formData?.personalDetails?.username || user?.username || ""
              }
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
              value={formData?.personalDetails?.website || ""}
              onChange={handleInputChange}
              placeholder="Website URL"
              className="bg-white/5 text-white pl-10"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-4">
          <SocialMediaIcons
            onSocialLinksChange={handleSocialLinksChange}
            initialLinks={socialLinks}
          />
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
                  : "Add a professional photo to help others recognize you"}
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
