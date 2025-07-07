import React from "react";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { Automation } from "@/components/Onboarding/Forms/Automation";
import {
  CLIENT_AUTOMATION_NEEDS,
  CLIENT_CURRENT_TOOLS,
} from "@/sanity/schemaTypes/constants";
import { convertToOnboardingFormat } from "@/lib/constants-utils";

interface AutomationNeedsSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
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
}: AutomationNeedsSectionProps) {
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
      onNext={onNext}
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
    />
  );
}
