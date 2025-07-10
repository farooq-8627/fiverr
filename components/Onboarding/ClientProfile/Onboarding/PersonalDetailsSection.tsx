"use client";

import React, { useState } from "react";
import {
  useClientProfileForm,
  useClientProfileFormFields,
} from "@/components/Onboarding/ClientProfile/context/ClientProfileFormContext";
import { PersonalDetailsSectionUI } from "@/components/Onboarding/SharedProfile/UI/PersonalDetailsSectionUI";

export function PersonalDetailsSection() {
  const { handleNext, goToFirstSection } = useClientProfileForm();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useClientProfileFormFields();

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
    setValue(id as any, value, { shouldValidate: true });
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
      subtitle="Let's start with the basics. Tell us about yourself and your company."
      userType="client"
    />
  );
}
