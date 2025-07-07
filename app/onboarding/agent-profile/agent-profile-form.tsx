"use client";

import { useState } from "react";
import { OnboardingCard } from "@/components/Forms/OnboardingCard";
import { PersonalDetailsSection } from "@/components/SharedProfile/Onboarding/PersonalDetailsSection";
import { CoreIdentitySection } from "@/components/AgentProfile/Onboarding/CoreIdentitySection";
import { AutomationExpertiseSection } from "@/components/AgentProfile/Onboarding/AutomationExpertiseSection";
import { ProjectsSection } from "@/components/AgentProfile/Onboarding/ProjectsSection";
import { BusinessDetailsSection } from "@/components/AgentProfile/Onboarding/BusinessDetailsSection";
import { useRouter } from "next/navigation";
import { ConclusionSection } from "@/components/SharedProfile/Onboarding/ConclusionSection";
import { AnimatePresence, motion, Variants } from "framer-motion";

export default function AgentProfileForm() {
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

  const handleSubmit = () => {
    console.log("submit");
  };

  const renderSection = () => {
    const variants: Variants = {
      enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.65,
        transition: {
          x: { type: "tween", duration: 0.85, ease: [0.32, 0.72, 0, 1] },
          opacity: { duration: 0.7 },
          scale: { duration: 0.8 },
        },
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
          x: { type: "tween", duration: 0.85, ease: [0.32, 0.72, 0, 1] },
          opacity: { duration: 0.7 },
          scale: { duration: 0.7 },
        },
      },
      exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.5,
        transition: {
          x: { type: "tween", duration: 1, ease: [0.32, 0.72, 0, 1] },
          opacity: { duration: 0.7 },
          scale: { duration: 0.7 },
        },
      }),
    };

    const contentVariants: Variants = {
      initial: {
        opacity: 0,
        y: 15,
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.3, // Wait for card to be almost centered
          duration: 0.5,
          ease: [0.32, 0.72, 0, 1],
        },
      },
      exit: {
        opacity: 0,
        y: -15,
        transition: {
          duration: 0.3,
          ease: [0.32, 0.72, 0, 1],
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
              <AutomationExpertiseSection
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            )}
          </OnboardingCard>
        );
      case 3:
        return (
          <OnboardingCard
            key="projects"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <ProjectsSection
                onNext={handleNext}
                onPrev={handlePrevious}
                onSkip={handleNext}
              />
            )}
          </OnboardingCard>
        );
      case 4:
        return (
          <OnboardingCard
            key="business"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
            {renderContent(
              <BusinessDetailsSection
                onNext={handleNext}
                onPrev={handlePrevious}
                onSkip={handleNext}
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
                userType="agent"
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
