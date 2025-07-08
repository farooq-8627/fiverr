import React from "react";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { Automation } from "@/components/Onboarding/Forms/Automation";
import {
  CLIENT_AUTOMATION_NEEDS,
  CLIENT_CURRENT_TOOLS,
} from "@/sanity/schemaTypes/constants";
import { convertToOnboardingFormat } from "@/lib/constants-utils";
import { toast } from "sonner";

interface AutomationNeedsSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  formData?: any;
  setFormData?: (data: any) => void;
}

// Use centralized constants converted to the format needed by the component
const clientAutomationNeeds = convertToOnboardingFormat(
  CLIENT_AUTOMATION_NEEDS
);
const clientCurrentTools = convertToOnboardingFormat(CLIENT_CURRENT_TOOLS);

export function AutomationNeedsSection({
  onNext,
  onPrev,
  onSkip,
  formData,
  setFormData,
}: AutomationNeedsSectionProps) {
  // Custom next handler to capture data from Automation component
  const handleNext = () => {
    if (formData && setFormData) {
      // Get the selected values from the DOM
      const servicesElements = document.querySelectorAll(
        ".automation-services .selected-item"
      );
      const toolsElements = document.querySelectorAll(
        ".tools-expertise .selected-item"
      );

      const selectedNeeds = Array.from(servicesElements).map(
        (el) => el.getAttribute("data-value") || ""
      );
      const selectedTools = Array.from(toolsElements).map(
        (el) => el.getAttribute("data-value") || ""
      );

      // Update form data
      setFormData({
        ...formData,
        automationNeeds: selectedNeeds,
        currentTools: selectedTools,
      });
    }

    // Call the parent's onNext
    onNext();
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
      title="Automation Needs"
      description="Tell us what you need automated and what tools you currently use"
      servicesTitle="What Do You Need Automated?"
      toolsTitle="What Tools Do You Currently Use?"
      servicesOptions={clientAutomationNeeds}
      toolsOptions={clientCurrentTools}
      servicesPlaceholder="Other automation needs..."
      toolsPlaceholder="Other tools you use..."
      initialServices={formData?.automationNeeds || []}
      initialTools={formData?.currentTools || []}
    />
  );
}
