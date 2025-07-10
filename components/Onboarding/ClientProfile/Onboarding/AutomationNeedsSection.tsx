"use client";
import React, { useState, useEffect } from "react";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { Automation } from "@/components/Onboarding/SharedProfile/UI/Automation";
import {
  CLIENT_AUTOMATION_NEEDS,
  CLIENT_CURRENT_TOOLS,
} from "@/sanity/schemaTypes/constants";
import { convertToOnboardingFormat } from "@/lib/constants-utils";
import { toast } from "sonner";
import {
  useClientProfileForm,
  useClientProfileFormFields,
} from "../context/ClientProfileFormContext";

// Use centralized constants converted to the format needed by the component
const clientAutomationNeeds = convertToOnboardingFormat(
  CLIENT_AUTOMATION_NEEDS
);
const clientCurrentTools = convertToOnboardingFormat(CLIENT_CURRENT_TOOLS);

export function AutomationNeedsSection() {
  const { handleNext, handlePrev, handleSkip } = useClientProfileForm();
  const { watch, setValue } = useClientProfileFormFields();

  // Get form data
  const formData = watch();
  const [selectedNeeds, setSelectedNeeds] = useState(
    formData?.automationNeeds || []
  );
  const [selectedTools, setSelectedTools] = useState(
    formData?.currentTools || []
  );

  // Handlers for services and tools changes
  const handleServicesChange = (services: string[]) => {
    console.log("Setting automation needs:", services);
    setSelectedNeeds(services);
    // Format the needs as individual strings
    const formattedNeeds = services.map((need) => need.trim());
    setValue("automationNeeds", formattedNeeds, { shouldValidate: true });
  };

  const handleToolsChange = (tools: string[]) => {
    console.log("Setting current tools:", tools);
    setSelectedTools(tools);
    // Format the tools as individual strings
    const formattedTools = tools.map((tool) => tool.trim());
    setValue("currentTools", formattedTools, { shouldValidate: true });
  };

  // Custom next handler
  const handleCustomNext = () => {
    console.log("Current selected needs:", selectedNeeds);
    if (selectedNeeds.length === 0) {
      toast.error("Please select at least one automation need");
      return;
    }

    // Format the data before proceeding
    const formattedNeeds = selectedNeeds.map((need) => need.trim());
    const formattedTools = selectedTools.map((tool) => tool.trim());

    console.log("Setting final form values:", {
      automationNeeds: formattedNeeds,
      currentTools: formattedTools,
    });

    setValue("automationNeeds", formattedNeeds, { shouldValidate: true });
    setValue("currentTools", formattedTools, { shouldValidate: true });

    // Call the parent's onNext
    handleNext();
  };

  const rightContent = (
    <RightContentLayout
      title="Tell Us Your Automation Needs"
      subtitle="Help us understand your automation requirements to match you with the right experts."
      features={[
        {
          icon: "fa-bullseye",
          title: "Precise Matching",
          description:
            "Get matched with automation experts who specialize in your specific needs",
        },
        {
          icon: "fa-clock",
          title: "Save Time",
          description: "Find experts who already know your tools and processes",
        },
        {
          icon: "fa-chart-bar",
          title: "Better Results",
          description:
            "Get tailored automation solutions that fit your business goals",
        },
      ]}
      currentStep={3}
      totalSteps={6}
    />
  );

  return (
    <Automation
      onNext={handleCustomNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
      rightContent={rightContent}
      title="Automation Needs"
      description="Tell us what you need automated and what tools you currently use"
      servicesTitle="What Do You Need Automated?"
      toolsTitle="What Tools Do You Currently Use?"
      servicesOptions={clientAutomationNeeds}
      toolsOptions={clientCurrentTools}
      servicesPlaceholder="Other automation needs..."
      toolsPlaceholder="Other tools you use..."
      initialServices={selectedNeeds}
      initialTools={selectedTools}
      onServicesChange={handleServicesChange}
      onToolsChange={handleToolsChange}
      canProceed={selectedNeeds.length > 0}
      errors={{
        services:
          selectedNeeds.length === 0
            ? "Please select at least one automation need"
            : undefined,
      }}
    />
  );
}
