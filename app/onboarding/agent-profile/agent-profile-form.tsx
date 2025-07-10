"use client";
import { OnboardingCard } from "@/components/Onboarding/Forms/OnboardingCard";
import { PersonalDetailsSection } from "@/components/Onboarding/AgentProfile/Onboarding/PersonalDetailsSection";
import { CoreIdentitySection } from "@/components/Onboarding/AgentProfile/Onboarding/CoreIdentitySection";
import { AutomationExpertiseSection } from "@/components/Onboarding/AgentProfile/Onboarding/AutomationExpertiseSection";
import { ProjectsSection } from "@/components/Onboarding/AgentProfile/Onboarding/ProjectsSection";
import { BusinessDetailsSection } from "@/components/Onboarding/AgentProfile/Onboarding/BusinessDetailsSection";
import { ConclusionSection } from "@/components/Onboarding/AgentProfile/Onboarding/ConclusionSection";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  AgentProfileFormProvider,
  useAgentProfileForm,
} from "@/components/Onboarding/AgentProfile/context/AgentProfileFormContext";
import { Loader2 } from "lucide-react";

// Animation variants for page transitions
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

function FormContent() {
  const { currentStep } = useAgentProfileForm();

  const renderSection = () => {
    const renderContent = (content: React.ReactNode) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {content}
      </motion.div>
    );

    switch (currentStep) {
      case 1:
        return (
          <OnboardingCard
            key="personal"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
          >
            {renderContent(<PersonalDetailsSection />)}
          </OnboardingCard>
        );
      case 2:
        return (
          <OnboardingCard
            key="core"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
          >
            {renderContent(<CoreIdentitySection />)}
          </OnboardingCard>
        );
      case 3:
        return (
          <OnboardingCard
            key="skills"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
          >
            {renderContent(<AutomationExpertiseSection />)}
          </OnboardingCard>
        );
      case 4:
        return (
          <OnboardingCard
            key="portfolio"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
          >
            {renderContent(<ProjectsSection />)}
          </OnboardingCard>
        );
      case 5:
        return (
          <OnboardingCard
            key="business"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
          >
            {renderContent(<BusinessDetailsSection />)}
          </OnboardingCard>
        );
      case 6:
        return (
          <OnboardingCard
            key="conclusion"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
          >
            {renderContent(<ConclusionSection />)}
          </OnboardingCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
      <Toaster position="top-center" richColors />
      <AnimatePresence initial={false} mode="wait">
        {renderSection()}
      </AnimatePresence>
    </div>
  );
}

export default function AgentProfileForm() {
  const { user, isLoaded } = useUser();

  // Wait for user data to be loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Redirect if no user
  if (!user) {
    return <div>Please sign in to continue</div>;
  }

  return (
    <AgentProfileFormProvider>
      <FormContent />
    </AgentProfileFormProvider>
  );
}
