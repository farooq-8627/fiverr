"use client";

import { useState } from "react";
import { OnboardingCard } from "@/components/Onboarding/Forms/OnboardingCard";
import { PersonalDetailsSection } from "@/components/Onboarding/SharedProfile/Onboarding/PersonalDetailsSection";
import { CoreIdentitySection } from "@/components/Onboarding/SharedProfile/Onboarding/CoreIdentitySection";
import { AutomationNeedsSection } from "@/components/Onboarding/ClientProfile/Onboarding/AutomationNeedsSection";
import { useRouter } from "next/navigation";
import { ProjectDetails } from "@/components/Onboarding/ClientProfile/Onboarding/ProjectDetails";
import { ProjectScopeDetails } from "@/components/Onboarding/ClientProfile/Onboarding/ProjectScopeDetails";
import { ConclusionSection } from "@/components/Onboarding/SharedProfile/Onboarding/ConclusionSection";
import { AnimatePresence, motion, Variants } from "framer-motion";

export default function ClientProfileForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    setDirection(1);
    setCurrentSection((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentSection((prev) => prev - 1);
  };

  const handleSkip = () => {
    setDirection(1);
    setCurrentSection((prev) => prev + 1);
  };

  const handleSubmit = () => {
    console.log("submit");
  };

  const renderSection = () => {
    // Enhanced variants for smoother train-like sliding effect
    const variants: Variants = {
      enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        transition: {
          x: {
            type: "spring",
            stiffness: 95,
            damping: 17,
            mass: 0.8,
            velocity: 2,
          },
          opacity: { duration: 0.25, ease: "easeOut" },
          delayChildren: 0,
        },
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        transition: {
          x: {
            type: "spring",
            stiffness: 95,
            damping: 17,
            mass: 0.8,
            velocity: 2,
          },
          opacity: { duration: 0.25, ease: "easeOut" },
        },
      },
      exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        transition: {
          x: {
            type: "spring",
            stiffness: direction < 0 ? 130 : 95,
            damping: direction < 0 ? 14 : 17,
            mass: direction < 0 ? 0.6 : 0.8,
            velocity: direction < 0 ? 3 : 2,
          },
          opacity: { duration: direction < 0 ? 0.15 : 0.25, ease: "easeOut" },
        },
      }),
    };

    const contentVariants: Variants = {
      initial: {
        opacity: 0,
        scale: 0.85,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
      exit: {
        opacity: 0,
        y: -10,
        transition: {
          duration: 0.2,
          ease: "easeIn",
        },
      },
    };

    const renderContent = (content: React.ReactNode) => (
      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {content}
      </motion.div>
    );

    switch (currentSection) {
      case 0:
        return (
          <OnboardingCard
            key="personal"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <PersonalDetailsSection
                onNext={handleNext}
                onFirstSection={() => router.push("/onboarding")}
              />
            )}
          </OnboardingCard>
        );
      case 1:
        return (
          <OnboardingCard
            key="core"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <CoreIdentitySection
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            )}
          </OnboardingCard>
        );
      case 2:
        return (
          <OnboardingCard
            key="automation"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <AutomationNeedsSection
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            )}
          </OnboardingCard>
        );
      case 3:
        return (
          <OnboardingCard
            key="project-details"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <ProjectDetails
                onNext={handleNext}
                onPrev={handlePrevious}
                onSkip={handleSkip}
              />
            )}
          </OnboardingCard>
        );
      case 4:
        return (
          <OnboardingCard
            key="project-scope"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <ProjectScopeDetails
                onNext={handleNext}
                onPrev={handlePrevious}
                onSkip={handleSkip}
              />
            )}
          </OnboardingCard>
        );
      case 5:
        return (
          <OnboardingCard
            key="conclusion"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <ConclusionSection
                onSubmit={handleSubmit}
                onPrev={handlePrevious}
                userType="client"
              />
            )}
          </OnboardingCard>
        );
      default:
        return (
          <OnboardingCard
            key="personal"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <PersonalDetailsSection
                onNext={handleNext}
                onFirstSection={() => router.push("/onboarding")}
              />
            )}
          </OnboardingCard>
        );
    }
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {renderSection()}
      </AnimatePresence>
    </div>
  );
}
