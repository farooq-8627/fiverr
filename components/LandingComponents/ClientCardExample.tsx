"use client";

import { ClientCard } from "@/components/cards/ClientCard";
import type { ClientWithProfile } from "@/hooks/useClientProfiles";

export function ClientCardExample() {
  // Example client profile data that matches the ClientWithProfile interface
  const mockClient: ClientWithProfile = {
    userProfile: {
      _id: "user-client-1",
      personalDetails: {
        username: "sarahclient",
        website: "sarahclient.com",
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
          { platform: "linkedin", url: "https://linkedin.com/in/sarahclient" },
          { platform: "twitter", url: "https://twitter.com/sarahclient" },
        ],
      },
      coreIdentity: {
        fullName: "Sarah Johnson",
        tagline: "Tech Entrepreneur & Innovation Leader",
        bio: "Passionate about leveraging technology to drive business transformation. Leading TechFlow Solutions with a focus on digital innovation and process optimization.",
      },
      companyDetails: {
        name: "TechFlow Solutions",
        bio: "Leading tech company specializing in digital transformation and process optimization. We help businesses streamline their operations and embrace modern technology solutions.",
        logo: {
          asset: {
            url: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=800&auto=format&fit=crop",
          },
        },
        industry: "Technology Services",
        size: "10-50",
      },
    },
    clientProfile: {
      automationNeeds: {
        automationRequirements: [
          "Workflow Optimization",
          "Data Integration",
          "Process Automation",
          "AI Integration",
        ],
        currentTools: ["Excel", "Slack", "Trello", "Google Workspace"],
        businessDomain: "Technology Services",
        painPoints: [
          "Manual data entry",
          "Inconsistent processes",
          "Lack of integration between tools",
        ],
      },
      communicationPreferences: {
        languagesSpoken: ["English", "Spanish"],
        timeZone: "GMT-5",
        updateFrequency: "Weekly",
        meetingAvailability: "Weekdays 9-5 EST",
      },
      projectPreferences: {
        budgetRange: "$15,000-25,000",
        timeline: "3-4 months",
        projectComplexity: "High",
        engagementType: "Full-time",
        teamSize: "2-3 experts",
        experienceLevel: "Senior",
      },
      mustHaveRequirements: {
        industryDomain: ["Technology", "SaaS", "E-commerce"],
      },
    },
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Client Profile Card
      </h1>
      <ClientCard
        userProfile={mockClient.userProfile}
        clientProfile={mockClient.clientProfile}
      />
    </div>
  );
}
