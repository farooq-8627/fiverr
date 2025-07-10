import React from "react";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { Automation } from "@/components/Onboarding/SharedProfile/UI/Automation";
import {
  AGENT_AUTOMATION_SERVICES,
  AGENT_TOOLS_EXPERTISE,
} from "@/sanity/schemaTypes/constants";
import { convertToOnboardingFormat } from "@/lib/constants-utils";
import {
  useAgentProfileForm,
  useAgentProfileFormFields,
} from "../context/AgentProfileFormContext";

// Use centralized constants converted to the format needed by the component
const agentAutomationServices = convertToOnboardingFormat(
  AGENT_AUTOMATION_SERVICES
);
const agentToolsExpertise = convertToOnboardingFormat(AGENT_TOOLS_EXPERTISE);

export function AutomationExpertiseSection() {
  const { handleNext, handlePrev, canProceed } = useAgentProfileForm();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useAgentProfileFormFields();

  // Watch form values
  const skills = watch("skills") || [];
  const automationTools = watch("automationTools") || [];

  // Handle service selection
  const handleServicesChange = (services: string[]) => {
    setValue("skills", services, { shouldValidate: true });
  };

  // Handle tools selection
  const handleToolsChange = (tools: string[]) => {
    setValue("automationTools", tools, { shouldValidate: true });
    // Set a default expertise level if not already set
    setValue("expertiseLevel", "intermediate", { shouldValidate: true });
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
      onPrev={handlePrev}
      onSkip={() => {}} // Removed handleSkip as per new_code
      rightContent={rightContent}
      title="Automation Expertise"
      description="Select your primary automation services and tools expertise"
      servicesTitle="Primary Automation Services"
      toolsTitle="Tools/Platforms Expertise"
      servicesOptions={agentAutomationServices}
      toolsOptions={agentToolsExpertise}
      initialServices={skills}
      initialTools={automationTools}
      onServicesChange={handleServicesChange}
      onToolsChange={handleToolsChange}
      errors={{
        services: errors.skills?.message,
        tools: errors.automationTools?.message,
      }}
      canProceed={canProceed}
    />
  );
}
