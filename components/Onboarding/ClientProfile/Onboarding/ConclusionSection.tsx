"use client";

import React from "react";
import {
  useClientProfileForm,
  useClientProfileFormFields,
} from "@/components/Onboarding/ClientProfile/context/ClientProfileFormContext";
import { ConclusionSectionUI } from "@/components/Onboarding/SharedProfile/UI/ConclusionSectionUI";
import { ClientProfile } from "@/types/profile";

export function ConclusionSection() {
  const { handlePrev, handleSubmit } = useClientProfileForm();
  const { getValues } = useClientProfileFormFields();

  const onSubmit = () => {
    handleSubmit(getValues());
  };

  return (
    <ConclusionSectionUI
      handlePrev={handlePrev}
      handleSubmit={onSubmit}
      userType="client"
    />
  );
}
