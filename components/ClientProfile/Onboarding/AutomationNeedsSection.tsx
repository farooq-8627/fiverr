import React from "react";
import { RightContentLayout } from "@/components/Forms/RightContentLayout";
import { Automation } from "@/components/Forms/Automation";

interface AutomationNeedsSectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
}

const clientAutomationNeeds = [
  { id: "lead_gen", label: "Lead Generation & Nurturing" },
  { id: "email", label: "Email Marketing Campaigns" },
  { id: "social", label: "Social Media Management" },
  { id: "ecommerce", label: "E-commerce Operations" },
  { id: "data", label: "Data Collection & Reporting" },
  { id: "workflow", label: "Workflow & Process Automation" },
];

const clientCurrentTools = [
  { id: "crm", label: "CRM (HubSpot, Salesforce, Pipedrive)" },
  { id: "email", label: "Email (Mailchimp, Klaviyo, ActiveCampaign)" },
  { id: "ecommerce", label: "E-commerce (Shopify, WooCommerce, Amazon)" },
  { id: "other", label: "Other Business Tools" },
];

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
