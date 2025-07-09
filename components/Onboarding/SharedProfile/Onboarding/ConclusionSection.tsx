import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/UI/checkbox";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useAgentProfileForm } from "@/components/Onboarding/AgentProfile/context/AgentProfileFormContext";
import { toast } from "sonner";

interface ConclusionSectionProps {
  userType: "agent" | "client";
}

export function ConclusionSection({ userType }: ConclusionSectionProps) {
  const { handlePrev, handleSubmit } = useAgentProfileForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [localState, setLocalState] = useState({
    acceptedTerms: false,
    acceptedPrivacy: false,
    acceptedCommunications: false,
  });

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setLocalState((prev) => ({ ...prev, [field]: checked }));
  };

  // Check if all required checkboxes are checked
  const canSubmit = localState.acceptedTerms && localState.acceptedPrivacy;

  // Custom submit handler that shows loading state
  const handleFormSubmit = () => {
    console.log("Submit button clicked, canSubmit:", canSubmit);

    if (canSubmit) {
      toast.info("Submitting your profile...");
      setIsSubmitting(true);

      // Call the context's submit handler
      console.log("Calling handleSubmit from context");
      handleSubmit();
    }
  };

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const rightContent = (
    <RightContentLayout
      title={
        userType === "agent" ? "Ready for Opportunities" : "Ready to Connect"
      }
      subtitle={
        userType === "agent"
          ? "Get ready to connect with clients and showcase your expertise"
          : "Your profile will help match you with the perfect automation specialists"
      }
      features={[
        {
          icon: "fa-handshake",
          title: "Agreement",
          description: "Terms and privacy ensure a safe environment for all",
        },
        {
          icon: "fa-bell",
          title: "Updates",
          description: "Stay informed about new opportunities and connections",
        },
        {
          icon: "fa-rocket",
          title: "Launch",
          description: "Complete your profile to start your journey",
        },
      ]}
      currentStep={6}
      totalSteps={6}
    />
  );

  // This is the key part - we're explicitly NOT providing onNext
  return (
    <FormSectionLayout
      title="Complete Your Profile"
      description="Review and accept our terms to start your journey"
      onSubmit={handleFormSubmit} // Only providing onSubmit, not onNext
      onPrev={handlePrev}
      rightContent={rightContent}
      canProceed={canSubmit}
      isSubmitting={isSubmitting}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={localState.acceptedTerms}
              onCheckedChange={(checked) =>
                handleCheckboxChange("acceptedTerms", checked as boolean)
              }
              className="mt-1"
              disabled={isSubmitting}
            />
            <label htmlFor="terms" className="text-sm text-white/80">
              I accept the{" "}
              <Link
                href="/terms"
                className="text-purple-400 hover:text-purple-300"
              >
                Terms and Conditions
              </Link>{" "}
              and agree to abide by the platform's rules and guidelines.
            </label>
          </div>

          {/* Privacy Policy */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={localState.acceptedPrivacy}
              onCheckedChange={(checked) =>
                handleCheckboxChange("acceptedPrivacy", checked as boolean)
              }
              className="mt-1"
              disabled={isSubmitting}
            />
            <label htmlFor="privacy" className="text-sm text-white/80">
              I have read and agree to the{" "}
              <Link
                href="/privacy"
                className="text-purple-400 hover:text-purple-300"
              >
                Privacy Policy
              </Link>{" "}
              and consent to the processing of my personal data.
            </label>
          </div>

          {/* Communication Preferences */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="communications"
              checked={localState.acceptedCommunications}
              onCheckedChange={(checked) =>
                handleCheckboxChange(
                  "acceptedCommunications",
                  checked as boolean
                )
              }
              className="mt-1"
              disabled={isSubmitting}
            />
            <label htmlFor="communications" className="text-sm text-white/80">
              I agree to receive important updates, new opportunities, and
              occasional newsletters. (Optional)
            </label>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 p-4 rounded-lg bg-white/[0.03] border border-white/10"
        >
          <h3 className="text-white font-medium mb-2">What's Next?</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-purple-400" />
              <span>Your profile will be reviewed by our team</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-purple-400" />
              <span>
                Once approved, your profile will be visible to{" "}
                {userType === "agent" ? "clients" : "automation specialists"}
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-purple-400" />
              <span>
                You can start{" "}
                {userType === "agent"
                  ? "bidding on projects"
                  : "posting automation projects"}{" "}
                right away
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
