"use client";
import { OnboardingCard } from "@/components/Onboarding/Forms/OnboardingCard";
import { ProjectDetails } from "@/components/Onboarding/ClientProfile/Onboarding/ProjectDetails";
import { ConclusionSection } from "@/components/Onboarding/ClientProfile/Onboarding/ConclusionSection";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  ClientProfileFormProvider,
  useClientProfileForm,
} from "@/components/Onboarding/ClientProfile/context/ClientProfileFormContext";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { AutomationNeedsSection } from "@/components/Onboarding/ClientProfile/Onboarding/AutomationNeedsSection";
import { ProjectScopeDetails } from "@/components/Onboarding/ClientProfile/Onboarding/ProjectScopeDetails";

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
  const { currentStep } = useClientProfileForm();

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
            {renderContent(<AutomationNeedsSection />)}
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
            {renderContent(<ProjectDetails />)}
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
            {renderContent(<ProjectScopeDetails />)}
          </OnboardingCard>
        );
      case 4:
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

export default function ClientProfileForm() {
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
    redirect("/sign-in");
  }

  return (
    <ClientProfileFormProvider>
      <FormContent />
    </ClientProfileFormProvider>
  );
}
