"use client";

import React from "react";
import {
  useClientProfileForm,
  useClientProfileFormFields,
} from "@/components/Onboarding/ClientProfile/context/ClientProfileFormContext";
import { CoreIdentitySectionUI } from "@/components/Onboarding/SharedProfile/UI/CoreIdentitySectionUI";
import { toast } from "sonner";
import { TEAM_SIZES } from "@/sanity/schemaTypes/constants";
import { convertToSelectFormat } from "@/lib/constants-utils";

export function CoreIdentitySection() {
  const { handleNext, handlePrev, handleSkip } = useClientProfileForm();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useClientProfileFormFields();

  // Get form data
  const formData = watch();
  const fullName = formData?.fullName || "";
  const hasCompany = formData?.hasCompany || false;
  const company = formData?.company || {
    name: formData?.company?.name || "",
    teamSize: formData?.company?.teamSize || "",
    bio: formData?.company?.bio || "",
    website: formData?.company?.website || "",
    logo: formData?.company?.logo || null,
    banner: null,
  };

  // Team sizes for select component
  const teamSizeOptions = convertToSelectFormat(TEAM_SIZES);

  // Handle company updates
  const updateCompany = (updates: any) => {
    const updatedCompany = {
      ...company,
      ...updates,
    };
    setValue("company", updatedCompany, { shouldValidate: true });
  };

  // Handlers for form inputs
  const setFullName = (value: string) => {
    setValue("fullName", value, { shouldValidate: true });
  };

  const setHasCompany = (value: boolean) => {
    setValue("hasCompany", value, { shouldValidate: true });
  };

  const setCompanyName = (value: string) => {
    updateCompany({ name: value });
  };

  const setCompanySize = (value: string) => {
    updateCompany({ teamSize: value });
  };

  const setCompanyBio = (value: string) => {
    updateCompany({ bio: value });
  };

  const setCompanyWebsite = (value: string) => {
    updateCompany({ website: value });
  };

  // Handle file uploads
  const handleLogoUpload = (file: File | null) => {
    updateCompany({ logo: file });
  };

  const handleBannerUpload = (file: File | null) => {
    updateCompany({ banner: file });
  };

  // Helper function to validate URL
  const isValidUrl = (url: string) => {
    try {
      if (!url) return true; // Empty URL is valid (optional field)
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateAndProceed = () => {
    // Debug logging
    console.log("Validating Company Details:", {
      fullName,
      hasCompany,
      companyName: company.name,
      companySize: company.teamSize,
      companyBio: company.bio,
      companyWebsite: company.website,
      companyLogo: company.logo,
      companyBanner: company.banner,
    });

    // Validate full name
    if (!fullName?.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    // Validate company fields if hasCompany is true
    if (hasCompany) {
      if (!company.name?.trim()) {
        toast.error("Please enter your company name");
        return;
      }

      if (!company.teamSize) {
        toast.error("Please select your team size");
        return;
      }

      if (!company.bio?.trim()) {
        toast.error("Please provide a brief company bio");
        return;
      }

      // Validate company website if provided
      if (company.website && !isValidUrl(company.website)) {
        toast.error("Please enter a valid company website URL");
        return;
      }
    }
    handleNext();
  };

  return (
    <CoreIdentitySectionUI
      handleNext={handleNext}
      handlePrev={handlePrev}
      validateAndProceed={validateAndProceed}
      fullName={fullName}
      hasCompany={hasCompany}
      companyName={company.name}
      companySize={company.teamSize}
      companyBio={company.bio}
      companyWebsite={company.website}
      companyLogo={company.logo || null}
      companyBanner={company.banner}
      setFullName={setFullName}
      setHasCompany={setHasCompany}
      setCompanyName={setCompanyName}
      setCompanySize={setCompanySize}
      setCompanyBio={setCompanyBio}
      setCompanyWebsite={setCompanyWebsite}
      handleLogoUpload={handleLogoUpload}
      handleBannerUpload={handleBannerUpload}
      errors={errors}
      teamSizeOptions={teamSizeOptions}
      userType="client"
    />
  );
}
