"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgentProfileSchema, type AgentProfile } from "@/types/agent-profile";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveAgentProfile } from "@/app/onboarding/agent-profile/actions";
import { useUser } from "@clerk/nextjs";

interface AgentProfileFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLastStep: boolean;
  canProceed: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  handleSkip: () => void;
  handleSubmit: (data: AgentProfile) => Promise<void>;
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
  const { user } = useUser();

  const methods = useForm<AgentProfile>({
    resolver: zodResolver(AgentProfileSchema),
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

      // Only update if the value has actually changed
      if (currentValueString !== previousValueRef.current) {
        previousValueRef.current = currentValueString;
        setStoredData(value as AgentProfile);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setStoredData]);

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

  const handleSubmit = async (data: AgentProfile) => {
    try {
      // Convert form data to FormData for server action
      const formData = new FormData();
      console.log("Creating FormData object");

      // Add skills and expertise
      console.log("Processing skills and expertise...");
      if (data.skills && data.skills.length > 0) {
        console.log("Adding skills:", data.skills);
        data.skills.forEach((skill) => formData.append("skills", skill));
      }

      if (data.automationTools && data.automationTools.length > 0) {
        console.log("Adding automation tools:", data.automationTools);
        data.automationTools.forEach((tool) =>
          formData.append("automationTools", tool)
        );
      }

      console.log("Adding expertise level:", data.expertiseLevel);

      formData.append("expertiseLevel", data.expertiseLevel || "");

      // Add business details
      console.log("Processing business details...");
      formData.append("pricingModel", data.pricingModel || "");
      formData.append("availability", data.availability || "");
      formData.append("teamSize", data.teamSize || "");
      formData.append("workType", data.workType || "");

      if (data.projectSizePreference && data.projectSizePreference.length > 0) {
        console.log(
          "Adding project size preferences:",
          data.projectSizePreference
        );
        data.projectSizePreference.forEach((size) =>
          formData.append("projectSizePreference", size)
        );
      }

      // Add projects
      if (data.projects && data.projects.length > 0) {
        console.log("Processing projects:", data.projects);
        formData.append("projects", JSON.stringify(data.projects));

        // Add project images if they exist
        data.projects.forEach((project, i) => {
          if (project.images && project.images.length > 0) {
            console.log(`Processing images for project ${i}:`, project.images);
            project.images.forEach((image, j) => {
              if (image instanceof File) {
                console.log(`Adding image ${j} for project ${i}:`, image.name);
                formData.append(`projectImages[${i}][${j}]`, image);
              }
            });
          }
        });
      }

      // Show loading toast
      toast.loading("Submitting your profile...");
      console.log(
        "FormData ready for submission:",
        Object.fromEntries(formData.entries())
      );

      // Submit form data to server action
      console.log("Calling saveAgentProfile");
      const result = await saveAgentProfile(formData);
      console.log("saveAgentProfile result:", result);

      // Handle response
      if (result.success) {
        console.log("Form submission successful!");
        toast.success(result.message);

        // Clear form data from local storage
        localStorage.removeItem(FORM_STORAGE_KEY);
        console.log("Local storage cleared");

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
