"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClientProfileSchema,
  type ClientProfile,
} from "@/types/client-profile";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveClientProfile } from "@/app/onboarding/client-profile/actions";
import { useUser } from "@clerk/nextjs";

interface ClientProfileFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLastStep: boolean;
  canProceed: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  handleSkip: () => void;
  handleSubmit: (data: ClientProfile) => Promise<void>;
  goToFirstSection: () => void;
  totalSteps: number;
}

const ClientProfileFormContext =
  createContext<ClientProfileFormContextType | null>(null);

const TOTAL_STEPS = 6;
const FORM_STORAGE_KEY = "client-profile-form";

export function ClientProfileFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [storedData, setStoredData] = useLocalStorage<Partial<ClientProfile>>(
    FORM_STORAGE_KEY,
    {}
  );
  const router = useRouter();
  const previousValueRef = useRef<string>("");
  const { user } = useUser();

  const methods = useForm<ClientProfile>({
    resolver: zodResolver(ClientProfileSchema),
    defaultValues: {
      ...storedData,
    },
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
      if (currentValueString !== previousValueRef.current) {
        previousValueRef.current = currentValueString;
        setStoredData(value as ClientProfile);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setStoredData]);

  // Determine if user can proceed based on current step validation
  const canProceed = React.useMemo(() => {
    // Step 6 (Conclusion) can always proceed
    if (currentStep === 6) {
      return true;
    }

    // For all other steps, we'll let the individual sections handle validation
    return true;
  }, [currentStep]);

  const isLastStep = currentStep === TOTAL_STEPS;

  const handleNext = () => {
    console.log("handleNext called. Current step:", currentStep);
    if (currentStep < TOTAL_STEPS) {
      console.log("Moving to next step");
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

  const handleSubmit = async (data: ClientProfile) => {
    try {
      // Convert form data to FormData for server action
      const formData = new FormData();
      console.log("Creating FormData object");

      // Add automation needs and tools
      console.log("Processing automation needs and tools...");
      if (data.automationNeeds && data.automationNeeds.length > 0) {
        console.log("Adding automation needs:", data.automationNeeds);
        data.automationNeeds.forEach((need) => {
          formData.append("automationNeeds", need);
        });
      }

      if (data.currentTools && data.currentTools.length > 0) {
        console.log("Adding current tools:", data.currentTools);
        data.currentTools.forEach((tool) => {
          formData.append("currentTools", tool);
        });
      }

      // Add project details
      console.log("Processing project details...");
      formData.append("projectTitle", data.projectTitle || "");
      formData.append("businessDomain", data.businessDomain || "");
      formData.append("projectDescription", data.projectDescription || "");
      formData.append("painPoints", data.painPoints || "");
      formData.append("budgetRange", data.budgetRange || "");
      formData.append("timeline", data.timeline || "");
      formData.append("complexity", data.complexity || "");
      formData.append("engagementType", data.engagementType || "");
      formData.append("teamSizeRequired", data.teamSizeRequired || "");
      formData.append("experienceLevel", data.experienceLevel || "");
      formData.append("priority", data.priority || "");
      // Show loading toast
      toast.loading("Submitting your profile...");
      console.log(
        "FormData ready for submission:",
        Object.fromEntries(formData.entries())
      );

      // Submit form data to server action
      console.log("Calling saveClientProfile");
      const result = await saveClientProfile(formData);
      console.log("saveClientProfile result:", result);

      // Handle response
      if (result.success) {
        console.log("Form submission successful!");
        toast.success(result.message);
        localStorage.removeItem(FORM_STORAGE_KEY);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        console.error("Form submission failed:", result.message);
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
    <ClientProfileFormContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ClientProfileFormContext.Provider>
  );
}

export function useClientProfileForm() {
  const context = useContext(ClientProfileFormContext);
  if (!context) {
    throw new Error(
      "useClientProfileForm must be used within a ClientProfileFormProvider"
    );
  }
  return context;
}

export function useClientProfileFormFields() {
  const methods = useFormContext<ClientProfile>();
  if (!methods) {
    throw new Error(
      "useClientProfileFormFields must be used within a FormProvider"
    );
  }
  return methods;
}
