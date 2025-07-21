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

const TOTAL_STEPS = 4;
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
<<<<<<< HEAD
    defaultValues: {
      ...storedData,
    },
=======
    defaultValues: storedData,
>>>>>>> main
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

<<<<<<< HEAD
  // Helper function to validate URL
  const isValidUrl = (url: string) => {
    try {
      if (!url) return true; // Empty URL is valid (optional field)
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Determine if user can proceed based on current step validation
  const canProceed = React.useMemo(() => {
    const currentStepFields =
      {
        1: ["skills", "expertiseLevel", "automationTools"],
        2: ["projects"], // Simplified - only require fullName, hasCompany is optional
        3: [
          "pricingModel",
          "availability",
          "teamSize",
          "workType",
          "projectSizePreference",
        ],
      }[currentStep] || [];

    const values = getValues();

    if (currentStep === 1) {
      const skillsValue = values.skills?.length > 0;
      const expertiseLevelValue = values.expertiseLevel;
      const automationToolsValue = values.automationTools?.length > 0;

      return Boolean(
        skillsValue && expertiseLevelValue && automationToolsValue
      );
    }

    // Special validation for step 2 (Projects)
    if (currentStep === 2) {
      const projectsValue = values.projects?.length > 0;

      // Basic validation - just require projects
      if (!projectsValue) {
        return false;
      }

      // If projects is true, validate projects fields including website
      if (projectsValue && values.projects) {
        const projectsWebsite = values.projects.map((project) =>
          project.projectLink?.trim()
        );

        return Boolean(
          projectsValue &&
            !errors.projects &&
            projectsWebsite?.every((website) => isValidUrl(website || ""))
        );
      }

      // If no company, just validate fullName
      return Boolean(projectsValue && !errors.projects);
    }

    // Special validation for projects section
    if (currentStep === 4) {
      const projects = values.projects || [];

      // Validate project links if they exist
      for (const project of projects) {
        if (project.projectLink && !isValidUrl(project.projectLink)) {
          return false;
        }
      }

      return true; // Projects are optional but links must be valid if provided
    }

    // Default validation for other steps
    return currentStepFields.every((field) => {
      const value = values[field as keyof AgentProfile];
      const hasError = errors[field as keyof AgentProfile];
      return (
        !hasError && (Array.isArray(value) ? value.length > 0 : Boolean(value))
      );
    });
  }, [currentStep, errors, getValues]);

=======
>>>>>>> main
  const isLastStep = currentStep === TOTAL_STEPS;

  const canProceed = React.useMemo(() => {
    return isValid;
  }, [isValid]);

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

  const handleSubmit = async () => {
    console.log("Submitting form...");
    toast.loading("Submitting your profile...");

    try {
      const data = getValues();
      // Convert form data to FormData for server action
      const formData = new FormData();
<<<<<<< HEAD
      console.log("Creating FormData object");
=======
>>>>>>> main

      // Add skills and expertise
      if (
        data.automationExpertise &&
        data.automationExpertise.toolsExpertise.length > 0
      ) {
        formData.append(
          "automationExpertise.toolsExpertise",
          JSON.stringify(data.automationExpertise.toolsExpertise)
        );
      }

<<<<<<< HEAD
      console.log("Adding expertise level:", data.expertiseLevel);

      formData.append("expertiseLevel", data.expertiseLevel || "");
=======
      if (
        data.automationExpertise &&
        data.automationExpertise.automationServices.length > 0
      ) {
        formData.append(
          "automationExpertise.automationServices",
          JSON.stringify(data.automationExpertise.automationServices)
        );
      }
>>>>>>> main

      // Add business details
      formData.append(
        "businessDetails.pricingModel",
        data.businessDetails.pricingModel || ""
      );
      formData.append(
        "businessDetails.availability",
        data.businessDetails.availability || ""
      );
      formData.append(
        "businessDetails.teamSize",
        data.businessDetails.teamSize || ""
      );
      formData.append(
        "businessDetails.workType",
        data.businessDetails.workType || ""
      );

      if (
        data.businessDetails.projectSizePreferences &&
        data.businessDetails.projectSizePreferences.length > 0
      ) {
        data.businessDetails.projectSizePreferences.forEach((size) =>
          formData.append("businessDetails.projectSizePreferences", size)
        );
      }

      // Add projects
      if (data.projects && data.projects.length > 0) {
        formData.append("projects", JSON.stringify(data.projects));

        // Add project images if they exist
        data.projects.forEach((project, i) => {
          if (project.imageFiles && project.imageFiles.length > 0) {
            project.imageFiles.forEach((image, j) => {
              if (image instanceof File) {
                formData.append(`projectImages[${i}][${j}]`, image);
              }
            });
          }
        });
      }

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
