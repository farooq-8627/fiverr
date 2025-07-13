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

      if (
        data.automationExpertise &&
        data.automationExpertise.automationServices.length > 0
      ) {
        formData.append(
          "automationExpertise.automationServices",
          JSON.stringify(data.automationExpertise.automationServices)
        );
      }

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
