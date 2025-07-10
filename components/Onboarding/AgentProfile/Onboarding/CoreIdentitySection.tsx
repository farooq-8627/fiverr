"use client";

import React from "react";
import {
  useAgentProfileForm,
  useAgentProfileFormFields,
} from "@/components/Onboarding/AgentProfile/context/AgentProfileFormContext";
import { CoreIdentitySectionUI } from "@/components/Onboarding/SharedProfile/UI/CoreIdentitySectionUI";
import { toast } from "sonner";
import { TEAM_SIZES } from "@/sanity/schemaTypes/constants";
import { convertToSelectFormat } from "@/lib/utils";

export function CoreIdentitySection() {
  const { handleNext, handlePrev, canProceed } = useAgentProfileForm();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useAgentProfileFormFields();

  // Get form data
  const formData = watch();
  const fullName = formData?.fullName || "";
  const hasCompany = formData?.hasCompany || false;
  const company = formData?.company || {
    name: "",
    teamSize: "",
    bio: "",
    website: "",
    logo: null as File | null,
    banner: null as File | null,
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

  const validateAndProceed = () => {
    // Validate company fields if hasCompany is true
    if (hasCompany) {
      if (!company.name?.trim()) {
        toast.error("Please enter your company name");
        return;
      }
      if (!company.bio?.trim()) {
        toast.error("Please enter your company description");
        return;
      }
    }
    handleNext();
  };

  return (
    <CoreIdentitySectionUI
      handleNext={handleNext}
      handlePrev={handlePrev}
      canProceed={canProceed}
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
      userType="agent"
    />
  );
}
