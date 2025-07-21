"use client";

import { ClientCard } from "@/components/cards/ClientCard";
import type { ClientProfile } from "@/types/client-profile";

export function ClientCardExample() {
  // Example client profile data
  const mockClientProfile: ClientProfile = {
    email: "sarah.client@example.com",
    phone: "+1 (555) 987-6543",
    username: "sarahclient",
    website: "sarahclient.com",
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/sarahclient" },
      { platform: "twitter", url: "https://twitter.com/sarahclient" },
    ],
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
    fullName: "Sarah Johnson",
    hasCompany: true,
    company: {
      name: "TechFlow Solutions",
      teamSize: "10-50",
      bio: "Leading tech company specializing in digital transformation and process optimization. We help businesses streamline their operations and embrace modern technology solutions.",
      website: "https://techflow.com",
      logo: {
        asset: {
          url: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=800&auto=format&fit=crop",
        },
      },
    },
    automationNeeds: [
      "Workflow Optimization",
      "Data Integration",
      "Process Automation",
      "AI Integration",
    ],
    currentTools: ["Excel", "Slack", "Trello", "Google Workspace"],
    projectTitle: "Enterprise Workflow Automation",
    businessDomain: "Technology Services",
    projectDescription:
      "Looking to implement comprehensive workflow automation across our organization. We need expertise in integrating various tools and platforms to create seamless processes. The goal is to reduce manual work and improve efficiency across departments.",
    painPoints:
      "Manual data entry, inconsistent processes, and lack of integration between different tools causing delays and errors.",
    budgetRange: "$15,000-25,000",
    timeline: "3-4 months",
    complexity: "High",
    engagementType: "Full-time",
    teamSizeRequired: "2-3 experts",
    experienceLevel: "Senior",
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Client Profile Card
      </h1>
      <ClientCard profile={mockClientProfile} />
    </div>
  );
}
