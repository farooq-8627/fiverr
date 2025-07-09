import React, { createContext, useContext, useEffect, useRef } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgentProfileSchema, type AgentProfile } from "@/types/agent-profile";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveAgentProfile } from "@/app/onboarding/agent-profile/actions";

interface AgentProfileFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLastStep: boolean;
  canProceed: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  handleSkip: () => void;
  handleSubmit: () => void;
  goToFirstSection: () => void;
  totalSteps: number;
}

const AgentProfileFormContext =
  createContext<AgentProfileFormContextType | null>(null);

const TOTAL_STEPS = 6;
const FORM_STORAGE_KEY = "agent-profile-form";

export function AgentProfileFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [storedData, setStoredData] = useLocalStorage<Partial<AgentProfile>>(
    FORM_STORAGE_KEY,
    {}
  );
  const router = useRouter();
  const previousValueRef = useRef<string>("");

  const methods = useForm<AgentProfile>({
    resolver: zodResolver(AgentProfileSchema),
    defaultValues: storedData,
    mode: "onChange",
  });

  const {
    formState: { isValid, errors },
    watch,
    handleSubmit: handleFormSubmit,
    getValues,
  } = methods;

  // Watch form changes and persist to local storage
  useEffect(() => {
    const subscription = watch((value) => {
      const currentValueString = JSON.stringify(value);

      // Only update if the value has actually changed
      if (currentValueString !== previousValueRef.current) {
        previousValueRef.current = currentValueString;
        setStoredData(value as AgentProfile);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setStoredData]);

  // Determine if user can proceed based on current step validation
  const canProceed = React.useMemo(() => {
    const currentStepFields =
      {
        1: ["email", "username", "socialLinks"],
        2: ["fullName", "hasCompany"],
        3: ["skills", "automationTools", "expertiseLevel"],
        4: ["projects"],
        5: [
          "pricingModel",
          "projectSizePreference",
          "teamSize",
          "availability",
          "workType",
        ],
        6: [],
      }[currentStep] || [];

    return currentStepFields.every(
      (field) => !errors[field as keyof AgentProfile]
    );
  }, [currentStep, errors]);

  const isLastStep = currentStep === TOTAL_STEPS;

  const handleNext = () => {
    if (canProceed && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToFirstSection = () => {
    router.push("/onboarding");
  };

  const handleSubmit = () => {
    console.log("Submitting form...");

    handleFormSubmit(async (data) => {
      try {
        // Convert form data to FormData for server action
        const formData = new FormData();

        // Add basic fields
        formData.append("email", data.email || "");
        formData.append("username", data.username || "");
        formData.append("phone", data.phone || "");
        formData.append("website", data.website || "");
        formData.append("fullName", data.fullName || "");
        formData.append("hasCompany", String(data.hasCompany || false));

        // Add social links
        if (data.socialLinks && data.socialLinks.length > 0) {
          formData.append("socialLinks", JSON.stringify(data.socialLinks));
        } else {
          formData.append("socialLinks", JSON.stringify([]));
        }

        // Add profile images if they exist
        if (data.profilePicture instanceof File) {
          formData.append("profilePicture", data.profilePicture);
        }

        if (data.bannerImage instanceof File) {
          formData.append("bannerImage", data.bannerImage);
        }

        // Add company details if hasCompany is true
        if (data.hasCompany && data.company) {
          formData.append("company.name", data.company.name || "");
          formData.append("company.teamSize", data.company.teamSize || "");
          formData.append("company.bio", data.company.bio || "");
          formData.append("company.website", data.company.website || "");

          // Add company logo and banner if they exist
          if (data.company.logo instanceof File) {
            formData.append("company.logo", data.company.logo);
          }

          if (data.company.banner instanceof File) {
            formData.append("company.banner", data.company.banner);
          }
        }

        // Add skills and expertise
        if (data.skills && data.skills.length > 0) {
          data.skills.forEach((skill) => formData.append("skills", skill));
        }

        if (data.automationTools && data.automationTools.length > 0) {
          data.automationTools.forEach((tool) =>
            formData.append("automationTools", tool)
          );
        }

        formData.append("expertiseLevel", data.expertiseLevel || "");

        // Add business details
        formData.append("pricingModel", data.pricingModel || "");
        formData.append("availability", data.availability || "");
        formData.append("teamSize", data.teamSize || "");
        formData.append("workType", data.workType || "");

        if (
          data.projectSizePreference &&
          data.projectSizePreference.length > 0
        ) {
          data.projectSizePreference.forEach((size) =>
            formData.append("projectSizePreference", size)
          );
        }

        // Add projects
        if (data.projects && data.projects.length > 0) {
          formData.append("projects", JSON.stringify(data.projects));

          // Add project images if they exist
          data.projects.forEach((project, i) => {
            if (project.images && project.images.length > 0) {
              project.images.forEach((image, j) => {
                if (image instanceof File) {
                  formData.append(`projectImages[${i}][${j}]`, image);
                }
              });
            }
          });
        }

        // Show loading toast
        toast.loading("Submitting your profile...");

        // Submit form data to server action
        const result = await saveAgentProfile(formData);

        // Handle response
        if (result.success) {
          toast.success(result.message);

          // Clear form data from local storage
          localStorage.removeItem(FORM_STORAGE_KEY);

          // Redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          toast.error(
            result.message || "Failed to submit profile. Please try again."
          );
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error(
          "There was an error submitting your profile. Please try again."
        );
      }
    })();
  };

  const contextValue = {
    currentStep,
    setCurrentStep,
    isLastStep,
    canProceed,
    handleNext,
    handlePrev,
    handleSkip,
    handleSubmit,
    goToFirstSection,
    totalSteps: TOTAL_STEPS,
  };

  return (
    <AgentProfileFormContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </AgentProfileFormContext.Provider>
  );
}

export function useAgentProfileForm() {
  const context = useContext(AgentProfileFormContext);
  if (!context) {
    throw new Error(
      "useAgentProfileForm must be used within an AgentProfileFormProvider"
    );
  }
  return context;
}

// Custom hook for form fields
export function useAgentProfileFormFields() {
  const methods = useFormContext<AgentProfile>();
  if (!methods) {
    throw new Error(
      "useAgentProfileFormFields must be used within a FormProvider"
    );
  }
  return methods;
}
