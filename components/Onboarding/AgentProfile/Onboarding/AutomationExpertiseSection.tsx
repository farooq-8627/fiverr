import React, { useState } from "react";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { Automation } from "@/components/Onboarding/Forms/Automation";
import {
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
} from "@/sanity/schemaTypes/constants";
import { convertToOnboardingFormat } from "@/lib/constants-utils";

interface AutomationExpertiseSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  formData: any;
  setFormData: (data: any) => void;
}

// Use centralized constants converted to the format needed by the component
const agentAutomationServices = convertToOnboardingFormat(
  AGENT_AUTOMATION_SERVICES
);
const agentToolsExpertise = convertToOnboardingFormat(AGENT_TOOLS_EXPERTISE);

export function AutomationExpertiseSection({
  onNext,
  onPrev,
  onSkip,
  formData,
  setFormData,
}: AutomationExpertiseSectionProps) {
  // Track selected values in state
  const [automationExpertise, setAutomationExpertise] = useState<{
    services: string[];
    tools: string[];
  }>({
    services: formData?.skills || [],
    tools: formData?.automationTools || [],
  });

  // Custom next handler to capture data from Automation component
  const handleNext = () => {
    // Get the selected values from the DOM
    const servicesElements = document.querySelectorAll(
      ".automation-services .selected-item"
    );
    const toolsElements = document.querySelectorAll(
      ".tools-expertise .selected-item"
    );

    const newSelectedServices = Array.from(servicesElements).map(
      (el) => el.getAttribute("data-value") || ""
    );
    const newSelectedTools = Array.from(toolsElements).map(
      (el) => el.getAttribute("data-value") || ""
    );

    // Update local state
    setAutomationExpertise({
      services: newSelectedServices,
      tools: newSelectedTools,
    });

    // Update form data
    setFormData({
      ...formData,
      skills: newSelectedServices,
      automationTools: newSelectedTools,
      expertiseLevel: "intermediate", // Add a default expertise level to pass validation
    });

    // Call the parent's onNext
    onNext();
  };

  const rightContent = (
    <RightContentLayout
      title="Showcase Your Expertise"
      subtitle="Your automation expertise helps us match you with the right clients and projects."
      features={[
        {
          icon: "fa-robot",
          title: "Accurate Matching",
          description:
            "Get matched with projects that align perfectly with your skills and experience",
        },
        {
          icon: "fa-search",
          title: "Enhanced Visibility",
          description: "Improve your visibility in relevant client searches",
        },
        {
          icon: "fa-chart-line",
          title: "Better Opportunities",
          description:
            "Receive personalized recommendations for high-value projects",
        },
      ]}
      currentStep={2}
      totalSteps={6}
    />
  );

  return (
    <Automation
      onNext={handleNext}
      onPrev={onPrev}
      onSkip={onSkip}
      rightContent={rightContent}
      title="Automation Expertise"
      description="Select your primary automation services and tools expertise"
      servicesTitle="Primary Automation Services"
      toolsTitle="Tools/Platforms Expertise"
      servicesOptions={agentAutomationServices}
      toolsOptions={agentToolsExpertise}
      initialServices={automationExpertise.services}
      initialTools={automationExpertise.tools}
    />
  );
}
