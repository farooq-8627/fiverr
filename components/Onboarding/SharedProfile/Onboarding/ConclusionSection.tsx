import React, { useState } from "react";
import { FormSectionLayout } from "@/components/Onboarding/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Onboarding/Forms/RightContentLayout";
import { motion, Variants } from "framer-motion";
import { Checkbox } from "@/components/UI/checkbox";
import { Button } from "@/components/UI/button";
import Link from "next/link";

interface ConclusionSectionProps {
  onSubmit: () => void;
  onPrev?: () => void;
  userType: "client" | "agent";
}

export function ConclusionSection({
  onSubmit,
  onPrev,
  userType,
}: ConclusionSectionProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedCommunication, setAcceptedCommunication] = useState(false);

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
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
      title="Almost There!"
      subtitle={`Complete your ${userType === "client" ? "client" : "agent"} profile setup by reviewing and accepting our terms.`}
      features={[
        {
          icon: "fa-shield-alt",
          title: "Data Protection",
          description:
            "Your data is protected under our privacy policy and security measures",
        },
        {
          icon: "fa-handshake",
          title: "Fair Usage",
          description:
            "Our terms ensure a fair and professional environment for all users",
        },
        {
          icon: "fa-bell",
          title: "Stay Updated",
          description: "Opt in to receive important updates and opportunities",
        },
      ]}
      currentStep={5}
      totalSteps={6}
    />
  );

  const isSubmitEnabled = acceptedTerms && acceptedPrivacy;

  return (
    <FormSectionLayout
      title="Complete Your Profile"
      description="Review and accept our terms to start your journey"
      onSubmit={onSubmit}
      onPrev={onPrev}
      rightContent={rightContent}
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
              checked={acceptedTerms}
              onCheckedChange={(checked) =>
                setAcceptedTerms(checked as boolean)
              }
              className="mt-1"
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
              checked={acceptedPrivacy}
              onCheckedChange={(checked) =>
                setAcceptedPrivacy(checked as boolean)
              }
              className="mt-1"
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
              id="communication"
              checked={acceptedCommunication}
              onCheckedChange={(checked) =>
                setAcceptedCommunication(checked as boolean)
              }
              className="mt-1"
            />
            <label htmlFor="communication" className="text-sm text-white/80">
              I would like to receive updates about new features, matching
              opportunities, and platform news (optional).
            </label>
          </div>
        </motion.div>

        {/* Summary Section */}
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
                You'll get access to the{" "}
                {userType === "client" ? "talent pool" : "project listings"}
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-purple-400" />
              <span>
                You can enhance your profile with additional details anytime
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
