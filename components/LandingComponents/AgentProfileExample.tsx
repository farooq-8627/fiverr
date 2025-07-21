"use client";

import { AgentCard } from "@/components/cards/AgentCard";
import type { AgentProfile } from "@/hooks/useUserProfile";

export function AgentProfileExample() {
  // Example agent profile data
  const mockAgentProfile: AgentProfile = {
    _id: "agent-1",
    profileId: "john-doe-agent",
    userId: "user-123",
    personalDetails: {
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      username: "johndoe",
      website: "johndoe.dev",
      profilePicture: {
        asset: {
          url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
        },
      },
      bannerImage: {
        asset: {
          url: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=800&auto=format&fit=crop",
        },
      },
      socialLinks: [
        { platform: "linkedin", url: "https://linkedin.com/in/johndoe" },
        { platform: "twitter", url: "https://twitter.com/johndoe" },
      ],
    },
    coreIdentity: {
      fullName: "John Doe",
      hasCompany: true,
      companyId: "company-456",
      logo: {
        asset: {
          url: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=800&auto=format&fit=crop",
        },
      },
      companyName: "John Doe Inc.",
      companyWebsite: "https://johndoe.com",
      companyDescription:
        "John Doe Inc. is a company that does things. We are a company of ecommerce. John Doe Inc. is a company that does things. We are a company of ecommerce. John Doe Inc. is a company that does things. We are a company of ecommerce.",
    },
    automationExpertise: {
      automationServices: [
        "Workflow Automation",
        "Data Integration",
        "AI Implementation",
      ],
      toolsExpertise: [
        "Zapier",
        "Make",
        "n8n",
        "Python",
        "Node.js",
        "OpenAI",
        "Langchain",
        "Anthropic",
      ],
    },
    businessDetails: {
      pricingModel: "Project-based and hourly",
      projectSizePreferences: ["Small", "Medium"],
      teamSize: "2-5",
      availability: "30 hours/week",
    },
    availability: {
      availabilityStatus: "Available",
      workingHoursPreference: "Flexible",
      availabilityHours: "30 hours/week",
      timeZone: "GMT+2",
      responseTimeCommitment: "Within 24 hours",
    },
    pricing: {
      hourlyRateRange: "$80-120/hr",
      minimumProjectBudget: "$1,000",
      preferredPaymentMethods: ["Bank Transfer", "PayPal", "Stripe"],
    },
    communicationPreferences: {
      preferredContactMethod: "Email",
      languagesSpoken: [
        { language: "English", proficiency: "Native" },
        { language: "Spanish", proficiency: "Fluent" },
      ],
      updateFrequency: "Weekly",
      meetingAvailability: "Weekdays",
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z",
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Agent Profile Card
      </h1>
      <AgentCard profile={mockAgentProfile} />
    </div>
  );
}
