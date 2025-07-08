"use client";

import { useState, useEffect } from "react";
import { OnboardingCard } from "@/components/Onboarding/Forms/OnboardingCard";
import { PersonalDetailsSection } from "@/components/Onboarding/SharedProfile/Onboarding/PersonalDetailsSection";
import { CoreIdentitySection } from "@/components/Onboarding/SharedProfile/Onboarding/CoreIdentitySection";
import { AutomationExpertiseSection } from "@/components/Onboarding/AgentProfile/Onboarding/AutomationExpertiseSection";
import { useRouter } from "next/navigation";
import { ProjectsSection } from "@/components/Onboarding/AgentProfile/Onboarding/ProjectsSection";
import { BusinessDetailsSection } from "@/components/Onboarding/AgentProfile/Onboarding/BusinessDetailsSection";
import { ConclusionSection } from "@/components/Onboarding/SharedProfile/Onboarding/ConclusionSection";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Toaster, toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { saveAgentProfile, FormState } from "./actions";

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

  // Automation expertise
  skills: [] as string[],
  expertiseLevel: "",
  automationTools: [] as string[],
  yearsOfExperience: "",
  industries: [] as string[],

  // Projects
  projects: [] as {
    title: string;
    description: string;
    technologies: string[];
    projectLink?: string;
    images: File[];
  }[],

  // Business details
  pricingModel: "",
  availability: "",
  languages: [] as string[],
  timezone: "",
  projectSizePreference: [] as string[], // project budget ranges preference
  teamSize: "", // team size (solo, small team, etc.)
  workType: "", // full-time, part-time, project-based, etc.

  // Final section
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedCommunications: false,
});

// Save form data to localStorage
const saveFormToLocalStorage = (formData: any, userId: string | undefined) => {
  if (typeof window !== "undefined" && userId) {
    localStorage.setItem(
      `agent_profile_form_${userId}`,
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
        // Handle project images
        projects: formData.projects.map((project: any) => ({
          ...project,
          images: project.images ? project.images.map(() => null) : [],
        })),
        lastUpdated: new Date().toISOString(),
      })
    );
  }
};

// Load form data from localStorage
const loadFormFromLocalStorage = (userId: string | undefined) => {
  if (typeof window !== "undefined" && userId) {
    const savedData = localStorage.getItem(`agent_profile_form_${userId}`);
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

export default function AgentProfileForm() {
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
      case 2: // Automation expertise
        // Only require skills to be selected
        return formData.skills && formData.skills.length > 0;
      case 3: // Projects (optional)
        return true;
      case 4: // Business details (some required)
        return (
          formData?.pricingModel?.trim() !== "" &&
          formData.availability?.trim() !== ""
        );
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
      toast.info(
        "Starting profile submission. This may take a moment for image uploads..."
      );

      // Check file sizes and warn user if they're large
      let totalFileSize = 0;

      // Check profile picture and banner image sizes
      if (formData.profilePicture)
        totalFileSize += formData.profilePicture.size;
      if (formData.bannerImage) totalFileSize += formData.bannerImage.size;

      // Check company images if applicable
      if (formData.hasCompany) {
        if (formData.companyDetails.logo)
          totalFileSize += formData.companyDetails.logo.size;
        if (formData.companyDetails.banner)
          totalFileSize += formData.companyDetails.banner.size;
      }

      // Check project image sizes
      formData.projects.forEach((project) => {
        project.images.forEach((image) => {
          totalFileSize += image.size;
        });
      });

      // Convert to MB for display
      const totalFileSizeMB = (totalFileSize / (1024 * 1024)).toFixed(2);

      // Warn if total size is large
      if (totalFileSize > 10 * 1024 * 1024) {
        // Over 10MB
        toast.warning(
          `You're uploading ${totalFileSizeMB}MB of images. This may take some time.`
        );
      }

      // Create FormData object to send to the server
      const submitFormData = new FormData();

      // Add all form fields to FormData
      submitFormData.append("email", formData.email);
      submitFormData.append("phone", formData.phone);
      submitFormData.append("username", formData.username);
      submitFormData.append("website", formData.website || "");
      submitFormData.append("fullName", formData.fullName);
      submitFormData.append("hasCompany", String(formData.hasCompany));

      // Add profile picture and banner image if available
      if (formData.profilePicture) {
        submitFormData.append("profilePicture", formData.profilePicture);
      }

      if (formData.bannerImage) {
        submitFormData.append("bannerImage", formData.bannerImage);
      }

      // Add social links as JSON
      submitFormData.append(
        "socialLinks",
        JSON.stringify(formData.socialLinks)
      );

      // Add company details if applicable
      if (formData.hasCompany) {
        submitFormData.append(
          "companyDetails.name",
          formData.companyDetails.name
        );
        submitFormData.append(
          "companyDetails.teamSize",
          formData.companyDetails.teamSize
        );
        submitFormData.append(
          "companyDetails.bio",
          formData.companyDetails.bio
        );
        submitFormData.append(
          "companyDetails.website",
          formData.companyDetails.website || ""
        );

        // Add company logo and banner if available
        if (formData.companyDetails.logo) {
          submitFormData.append(
            "companyDetails.logo",
            formData.companyDetails.logo
          );
        }

        if (formData.companyDetails.banner) {
          submitFormData.append(
            "companyDetails.banner",
            formData.companyDetails.banner
          );
        }
      }

      // Add automation expertise
      formData.skills.forEach((skill) => {
        submitFormData.append("skills", skill);
      });
      submitFormData.append("expertiseLevel", formData.expertiseLevel);
      formData.automationTools.forEach((tool) => {
        submitFormData.append("automationTools", tool);
      });
      submitFormData.append("yearsOfExperience", formData.yearsOfExperience);
      formData.industries.forEach((industry) => {
        submitFormData.append("industries", industry);
      });

      // Add business details
      submitFormData.append("availability", formData.availability);

      // Add pricing model
      submitFormData.append("pricingModel", formData.pricingModel);

      // Add project size preferences
      if (
        formData.projectSizePreference &&
        formData.projectSizePreference.length > 0
      ) {
        formData.projectSizePreference.forEach((size) => {
          submitFormData.append("projectSizePreference", size);
        });
      }

      // Add team size
      if (formData.teamSize) {
        submitFormData.append("teamSize", formData.teamSize);
      }

      // Add projects as JSON and project images as files
      submitFormData.append(
        "projects",
        JSON.stringify(
          formData.projects.map((project) => ({
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            projectLink: project.projectLink,
          }))
        )
      );

      // Add project images separately
      formData.projects.forEach((project, projectIndex) => {
        project.images.forEach((image, imageIndex) => {
          submitFormData.append(
            `projectImages[${projectIndex}][${imageIndex}]`,
            image
          );
        });
      });

      // Save to Sanity with timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Request timed out after 60 seconds")),
          60000
        );
      });

      const resultPromise = saveAgentProfile(submitFormData);

      // Race between the actual request and the timeout
      const result = (await Promise.race([
        resultPromise,
        timeoutPromise,
      ])) as FormState;

      if (result.success) {
        toast.success(result.message);

        // Clear saved form data after successful submission
        if (user?.id) {
          localStorage.removeItem(`agent_profile_form_${user.id}`);
        }

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);

      // Provide more specific error messages
      if (error.message?.includes("timed out")) {
        toast.error(
          "The request timed out. Your images may be too large. Try compressing them or uploading fewer images."
        );
      } else if (error.message?.includes("Body exceeded")) {
        toast.error(
          "The form data is too large. Try reducing the size or number of images."
        );
      } else {
        toast.error(
          `An error occurred: ${error.message || "Unknown error"}. Please try again.`
        );
      }
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
            key="skills"
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
                formData={formData}
                setFormData={updateFormData}
              />
            )}
          </OnboardingCard>
        );
      case 3:
        return (
          <OnboardingCard
            key="portfolio"
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
            key="experience"
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
                userType="agent"
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
