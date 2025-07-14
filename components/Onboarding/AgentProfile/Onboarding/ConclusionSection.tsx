"use client";

import React from "react";
import {
  useAgentProfileForm,
  useAgentProfileFormFields,
} from "@/components/Onboarding/AgentProfile/context/AgentProfileFormContext";
import { ConclusionSectionUI } from "@/components/Onboarding/SharedProfile/Onboarding/ConclusionSectionUI";

export function ConclusionSection() {
  const { handlePrev, handleSubmit } = useAgentProfileForm();
  const { getValues } = useAgentProfileFormFields();

  const onSubmit = () => {
    handleSubmit(getValues());
  };

  return (
    <ConclusionSectionUI
      handlePrev={handlePrev}
      handleSubmit={onSubmit}
      userType="agent"
    />
  );
}
