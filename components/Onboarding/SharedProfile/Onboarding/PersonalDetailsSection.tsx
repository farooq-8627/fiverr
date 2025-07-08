import React, { useState, useEffect } from "react";
import { Input } from "@/components/UI/input";
import { SocialMediaIcons } from "@/components/Onboarding/Forms/SocialMediaIcons";
import { ImageUpload } from "@/components/Onboarding/Forms/ImageUpload";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

interface PersonalDetailsSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  onFirstSection?: () => void;
  formData?: any;
  setFormData?: (data: any) => void;
}

export function PersonalDetailsSection({
  onNext,
  onPrev,
  onSkip,
  onFirstSection,
  formData,
  setFormData,
}: PersonalDetailsSectionProps) {
  const { user, isLoaded } = useUser();

  // Initialize local state from formData or empty values
  const [socialLinks, setSocialLinks] = useState<
    { platform: string; url: string }[]
  >(formData?.socialLinks || []);

  const [profilePicture, setProfilePicture] = useState<File | null>(
    formData?.profilePicture || null
  );

  const [bannerImage, setBannerImage] = useState<File | null>(
    formData?.bannerImage || null
  );

  const [userData, setUserData] = useState({
    email: formData?.email || "",
    phone: formData?.phone || "",
    username: formData?.username || "",
    website: formData?.website || "",
  });

  // Update local state when formData changes (e.g., from parent component)
  useEffect(() => {
    if (formData) {
      setUserData({
        email: formData.email || "",
        phone: formData.phone || "",
        username: formData.username || "",
        website: formData.website || "",
      });
      setSocialLinks(formData.socialLinks || []);
      setProfilePicture(formData.profilePicture || null);
      setBannerImage(formData.bannerImage || null);
    }
  }, [formData]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData({
      ...userData,
      [id]: value,
    });

    if (setFormData && formData) {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

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

  const handleSocialLinksChange = (
    links: { platform: string; url: string }[]
  ) => {
    setSocialLinks(links);
    if (setFormData && formData) {
      setFormData({
        ...formData,
        socialLinks: links,
      });
    }
  };

  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file);
    if (setFormData && formData) {
      setFormData({
        ...formData,
        profilePicture: file,
      });
    }
  };

  const handleBannerImageChange = (file: File | null) => {
    setBannerImage(file);
    if (setFormData && formData) {
      setFormData({
        ...formData,
        bannerImage: file,
      });
    }
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
              value={userData.email}
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
              value={userData.phone}
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
              value={userData.username}
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
              value={userData.website}
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
                Add a professional photo to help others recognize you
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
