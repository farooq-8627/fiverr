"use client";

import React, { useState, useEffect } from "react";
import {
  useAgentProfileForm,
  useAgentProfileFormFields,
} from "@/components/Onboarding/AgentProfile/context/AgentProfileFormContext";
import { PersonalDetailsSectionUI } from "@/components/Onboarding/SharedProfile/UI/PersonalDetailsSectionUI";

export function PersonalDetailsSection() {
  const { handleNext, goToFirstSection, canProceed } = useAgentProfileForm();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useAgentProfileFormFields();

  // Get form data
  const formData = watch();

  // Initialize state with form data
  const [socialLinks, setSocialLinks] = useState(formData?.socialLinks || []);
  const [profilePicture, setProfilePicture] = useState(
    formData?.profilePicture || null
  );
  const [bannerImage, setBannerImage] = useState(formData?.bannerImage || null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setValue(id as keyof typeof formData, value, { shouldValidate: true });
  };

  const handleSocialLinksChange = (
    links: { platform: string; url: string }[]
  ) => {
    setSocialLinks(links);
    setValue("socialLinks", links, { shouldValidate: true });
  };

  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file);
    setValue("profilePicture", file, { shouldValidate: true });
  };

  const handleBannerImageChange = (file: File | null) => {
    setBannerImage(file);
    setValue("bannerImage", file, { shouldValidate: true });
  };

  return (
    <PersonalDetailsSectionUI
      handleNext={handleNext}
      goToFirstSection={goToFirstSection}
      canProceed={canProceed}
      email={formData?.email || ""}
      phone={formData?.phone || ""}
      username={formData?.username || ""}
      website={formData?.website || ""}
      socialLinks={socialLinks}
      profilePicture={profilePicture}
      bannerImage={bannerImage}
      handleInputChange={handleInputChange}
      handleSocialLinksChange={handleSocialLinksChange}
      handleProfilePictureChange={handleProfilePictureChange}
      handleBannerImageChange={handleBannerImageChange}
      subtitle="Let's start with the basics. Tell us about yourself."
      userType="agent"
    />
  );
}
