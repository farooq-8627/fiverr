import React from "react";
import { RightContentLayout } from "@/components/Forms/RightContentLayout";
import { Automation } from "@/components/Forms/Automation";

interface AutomationExpertiseSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
}

const agentAutomationServices = [
  { id: "marketing", label: "Marketing Automation" },
  { id: "sales", label: "Sales Automation" },
  { id: "ecommerce", label: "E-commerce Automation" },
  { id: "workflow", label: "Workflow Automation" },
  { id: "data", label: "Data Automation" },
  { id: "ai", label: "AI & Chatbots" },
  { id: "custom", label: "Custom Development" },
];

const agentToolsExpertise = [
  { id: "automation", label: "Zapier & Make.com" },
  { id: "crm", label: "HubSpot & Salesforce" },
  { id: "email", label: "Klaviyo & Mailchimp" },
  { id: "project", label: "Airtable & Notion" },
  { id: "commerce", label: "Shopify & WooCommerce" },
  { id: "ai_tools", label: "ChatGPT & Claude" },
];

export function AutomationExpertiseSection({
  onNext,
  onPrev,
  onSkip,
}: AutomationExpertiseSectionProps) {
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
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
      rightContent={rightContent}
      title="Automation Expertise"
      description="Select your primary automation services and tools expertise"
      servicesTitle="Primary Automation Services"
      toolsTitle="Tools/Platforms Expertise"
      servicesOptions={agentAutomationServices}
      toolsOptions={agentToolsExpertise}
      servicesPlaceholder="Other automation services..."
      toolsPlaceholder="Other tools or platforms..."
    />
  );
}
