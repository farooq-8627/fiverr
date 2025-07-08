"use client";

import { useState, useEffect } from "react";
import { OnboardingCard } from "@/components/Onboarding/Forms/OnboardingCard";
import { PersonalDetailsSection } from "@/components/Onboarding/SharedProfile/Onboarding/PersonalDetailsSection";
import { CoreIdentitySection } from "@/components/Onboarding/SharedProfile/Onboarding/CoreIdentitySection";
import { AutomationNeedsSection } from "@/components/Onboarding/ClientProfile/Onboarding/AutomationNeedsSection";
import { useRouter } from "next/navigation";
import { ProjectDetails } from "@/components/Onboarding/ClientProfile/Onboarding/ProjectDetails";
import { ProjectScopeDetails } from "@/components/Onboarding/ClientProfile/Onboarding/ProjectScopeDetails";
import { ConclusionSection } from "@/components/Onboarding/SharedProfile/Onboarding/ConclusionSection";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Toaster, toast } from "sonner";
import { useUser } from "@clerk/nextjs";

// Function to log form data in a structured way
const logFormData = (formData: any, userId: string | undefined) => {
  console.group("Client Profile Form Submission");
  console.log("Submission Time:", new Date().toISOString());
  console.log("User ID:", userId || "Not available");

  // Personal details
  console.group("Personal Details");
  console.log("Email:", formData.email);
  console.log("Phone:", formData.phone);
  console.log("Username:", formData.username);
  console.log("Website:", formData.website);
  console.log(
    "Social Links:",
    formData.socialLinks.filter(
      (link: { platform: string; url: string }) => link.url.trim() !== ""
    )
  );
  console.log(
    "Profile Picture:",
    formData.profilePicture ? "Provided" : "Not provided"
  );
  console.log(
    "Banner Image:",
    formData.bannerImage ? "Provided" : "Not provided"
  );
  console.groupEnd();

  // Core identity
  console.group("Core Identity");
  console.log("Full Name:", formData.fullName);
  console.log("Has Company:", formData.hasCompany);
  if (formData.hasCompany) {
    console.group("Company Details");
    console.log("Company Name:", formData.companyDetails.name);
    console.log("Team Size:", formData.companyDetails.teamSize);
    console.log("Bio:", formData.companyDetails.bio);
    console.log("Website:", formData.companyDetails.website);
    console.log(
      "Logo:",
      formData.companyDetails.logo ? "Provided" : "Not provided"
    );
    console.log(
      "Banner:",
      formData.companyDetails.banner ? "Provided" : "Not provided"
    );
    console.groupEnd();
  }
  console.groupEnd();

  // Automation needs
  console.group("Automation Needs");
  console.log("Automation Needs:", formData.automationNeeds);
  console.log("Current Tools:", formData.currentTools);
  console.groupEnd();

  // Project details
  console.group("Project Details");
  console.log("Project Title:", formData.projectTitle);
  console.log("Business Domain:", formData.businessDomain);
  console.log("Project Description:", formData.projectDescription);
  console.log("Current Challenges:", formData.painPoints);
  console.groupEnd();

  // Project scope
  console.group("Project Scope");
  console.log("Budget Range:", formData.budgetRange);
  console.log("Timeline:", formData.timeline);
  console.log("Priority:", formData.priority);
  console.log("Team Size Required:", formData.teamSizeRequired);
  console.log("Engagement Type:", formData.engagementType);
  console.log("Experience Level:", formData.experienceLevel);
  console.groupEnd();

  // Final section
  console.group("Agreements");
  console.log("Accepted Terms:", formData.acceptedTerms);
  console.log("Accepted Privacy:", formData.acceptedPrivacy);
  console.log("Accepted Communications:", formData.acceptedCommunications);
  console.groupEnd();

  console.groupEnd(); // End of main group
};

// Create initial form state
const createInitialFormState = () => ({
  // Personal details
  email: "",
  phone: "",
  username: "",
  website: "",
  socialLinks: [] as { platform: string; url: string }[],
  profilePicture: null as File | null,
  bannerImage: null as File | null,

  // Core identity
  fullName: "",
  hasCompany: false,
  companyDetails: {
    name: "",
    teamSize: "",
    bio: "",
    website: "",
    logo: null as File | null,
    banner: null as File | null,
  },

  // Automation needs
  automationNeeds: [] as string[],
  currentTools: [] as string[],

  // Project details
  projectTitle: "",
  businessDomain: "",
  projectDescription: "",
  painPoints: "",

  // Project scope
  budgetRange: "",
  timeline: "",
  priority: "",
  teamSizeRequired: "",
  engagementType: "",
  experienceLevel: "",

  // Final section
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedCommunications: false,
});

// Save form data to localStorage
const saveFormToLocalStorage = (formData: any, userId: string | undefined) => {
  if (typeof window !== "undefined" && userId) {
    localStorage.setItem(
      `client_profile_form_${userId}`,
      JSON.stringify({
        ...formData,
        // Remove non-serializable data before saving
        profilePicture: null,
        bannerImage: null,
        companyDetails: {
          ...formData.companyDetails,
          logo: null,
          banner: null,
        },
        lastUpdated: new Date().toISOString(),
      })
    );
  }
};

// Load form data from localStorage
const loadFormFromLocalStorage = (userId: string | undefined) => {
  if (typeof window !== "undefined" && userId) {
    const savedData = localStorage.getItem(`client_profile_form_${userId}`);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }
  }
  return null;
};

export default function ClientProfileForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Form data state
  const [formData, setFormData] = useState(createInitialFormState());

  // Initialize form data with Clerk user data and localStorage data
  useEffect(() => {
    if (isLoaded && user) {
      // First try to load saved form data from localStorage
      const savedFormData = loadFormFromLocalStorage(user.id);

      // Get user data from Clerk
      const email = user.emailAddresses[0]?.emailAddress || "";
      const phone = user.phoneNumbers[0]?.phoneNumber || "";
      const username = user.username || "";
      const fullName = user.fullName || "";

      // Update form data with Clerk data and any saved data
      setFormData((prevData) => {
        // Start with either saved data or current data
        const baseData = savedFormData || prevData;

        // Always update with the latest Clerk data
        return {
          ...baseData,
          email,
          phone,
          username,
          fullName: baseData.fullName || fullName,
        };
      });
    }
  }, [isLoaded, user]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && user) {
      saveFormToLocalStorage(formData, user.id);
    }
  }, [formData, isLoaded, user]);

  // Update form data
  const updateFormData = (newData: any) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const handleNext = () => {
    // Validate current section before proceeding
    if (!validateCurrentSection()) {
      toast.error("Please fill in all required fields.");
      return;
    }

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

  // Validation logic for each section
  const validateCurrentSection = () => {
    switch (currentSection) {
      case 0: // Personal details
        // Email, phone, username come from Clerk and are required
        return true;
      case 1: // Core identity
        return formData.fullName?.trim() !== "";
      case 2: // Automation needs
        // Only require automation needs to be selected
        return formData.automationNeeds && formData.automationNeeds.length > 0;
      case 3: // Project details (optional)
        return true;
      case 4: // Project scope (optional)
        return true;
      case 5: // Conclusion section
        return formData.acceptedTerms && formData.acceptedPrivacy;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
        toast.error("Please accept the terms and privacy policy to continue.");
        return;
      }

      setLoading(true);

      // Log all form data before submission
      logFormData(formData, user?.id);

      // Success message
      toast.success("Profile data logged successfully!");

      // Clear saved form data after successful submission
      if (user?.id) {
        localStorage.removeItem(`client_profile_form_${user.id}`);
      }

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
                formData={formData}
                setFormData={updateFormData}
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
                formData={formData}
                setFormData={updateFormData}
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
                formData={formData}
                setFormData={updateFormData}
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
                formData={formData}
                setFormData={updateFormData}
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
                formData={formData}
                setFormData={updateFormData}
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
                formData={formData}
                setFormData={updateFormData}
                isLoading={loading}
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
                formData={formData}
                setFormData={updateFormData}
              />
            )}
          </OnboardingCard>
        );
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
      <Toaster position="top-center" richColors />
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {renderSection()}
      </AnimatePresence>
    </div>
  );
}
