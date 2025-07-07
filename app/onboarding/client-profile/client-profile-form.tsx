"use client";

import { useState } from "react";
import { OnboardingCard } from "@/components/Forms/OnboardingCard";
import { PersonalDetailsSection } from "@/components/SharedProfile/Onboarding/PersonalDetailsSection";
import { CoreIdentitySection } from "@/components/AgentProfile/Onboarding/CoreIdentitySection";
import { AutomationNeedsSection } from "@/components/ClientProfile/Onboarding/AutomationNeedsSection";
import { useRouter } from "next/navigation";
import { ProjectDetails } from "@/components/ClientProfile/Onboarding/ProjectDetails";
import { ProjectScopeDetails } from "@/components/ClientProfile/Onboarding/ProjectScopeDetails";
import { ConclusionSection } from "@/components/SharedProfile/Onboarding/ConclusionSection";

export default function ClientProfileForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();
  const handleNext = () => {
    setCurrentSection((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => prev - 1);
  };

  const handleSkip = () => {
    setCurrentSection((prev) => prev + 1);
  };

  const handleSubmit = () => {
    console.log("submit");
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <PersonalDetailsSection
            onNext={handleNext}
            onFirstSection={() => router.push("/onboarding")}
          />
        );
      case 1:
        return (
          <CoreIdentitySection onNext={handleNext} onPrev={handlePrevious} />
        );
      case 2:
        return (
          <AutomationNeedsSection onNext={handleNext} onPrev={handlePrevious} />
        );
      case 3:
        return (
          <ProjectDetails
            onNext={handleNext}
            onPrev={handlePrevious}
            onSkip={handleSkip}
          />
        );
      case 4:
        return (
          <ProjectScopeDetails
            onNext={handleNext}
            onPrev={handlePrevious}
            onSkip={handleSkip}
          />
        );
      case 5:
        return (
          <ConclusionSection
            onSubmit={handleSubmit}
            onPrev={handlePrevious}
            userType="client"
          />
        );
      default:
        return (
          <PersonalDetailsSection
            onNext={handleNext}
            onFirstSection={() => router.push("/onboarding")}
          />
        );
    }
  };

  return <OnboardingCard>{renderSection()}</OnboardingCard>;
}
