import React from "react";
import { Button } from "../../UI/button";
import { motion } from "framer-motion";

interface FormSectionLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  rightContent?: React.ReactNode;
  onSubmit?: () => void;
  onFirstSection?: () => void;
  isSubmitting?: boolean;
  canProceed?: boolean;
}

export function FormSectionLayout({
  title,
  description,
  children,
  onNext,
  onPrev,
  onSkip,
  rightContent,
  onSubmit,
  onFirstSection,
  isSubmitting = false,
  canProceed = true,
}: FormSectionLayoutProps) {
  // Extract progress component from rightContent if it exists
  const extractProgressFromRightContent = () => {
    if (!rightContent) return null;

    // We need to check if rightContent has progress info
    // This is a bit hacky but works for our use case
    try {
      const rightContentElement = rightContent as React.ReactElement;
      const props = rightContentElement.props as any;

      if (
        typeof props?.currentStep === "number" &&
        typeof props?.totalSteps === "number"
      ) {
        const progress = (props.currentStep / props.totalSteps) * 100;
        return (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-2 mb-6"
          >
            <div className="flex justify-between text-sm text-white/70">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex gap-6">
              <p className="text-sm text-white/50">
                Step {props.currentStep + 1} of {props.totalSteps}
              </p>
              {props.currentStep > 0 && (
                <p className="text-sm font-medium text-purple-400">
                  You're doing great! Keep going.
                </p>
              )}
            </div>
          </motion.div>
        );
      }
    } catch (error) {
      // Fallback if extraction fails
      return null;
    }

    return null;
  };

  const mobileProgress = extractProgressFromRightContent();

  return (
    <>
      {/* Desktop and iPad Layout */}
      <div className="hidden md:grid md:grid-cols-2 h-[82vh]">
        {/* Left Column - Form */}
        <div className="flex flex-col h-full border-r border-white/10">
          {/* Header Section - Fixed at top */}
          <div className="px-4 md:px-6 py-4">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-white/60 mt-1 text-sm md:text-base"
            >
              {description}
            </motion.p>
          </div>

          {/* Form Content Section - Elastic */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4 max-h-[calc(82vh-200px)]">
            <motion.div className="space-y-6 pr-2 md:pr-4 min-h-0">
              {children}
            </motion.div>
          </div>

          {/* Navigation Buttons - Fixed at bottom */}
          <motion.div className="px-4 md:px-6 mr-2 md:mr-4 py-4 mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <motion.div className="space-x-3">
                {onPrev && (
                  <Button
                    onClick={onPrev}
                    disabled={isSubmitting}
                    className="border border-white/20 hover:bg-white/10 text-white px-6 md:px-8 py-2 text-sm md:text-base"
                  >
                    Prev
                  </Button>
                )}
                {onFirstSection && (
                  <Button
                    onClick={onFirstSection}
                    disabled={isSubmitting}
                    className="border border-white/20 hover:bg-white/10 text-white px-6 md:px-8 py-2 text-sm md:text-base"
                  >
                    Prev
                  </Button>
                )}
                {onSkip && (
                  <Button
                    onClick={onSkip}
                    disabled={isSubmitting}
                    className="text-white/60 hover:text-white px-6 md:px-8 py-2 text-sm md:text-base"
                  >
                    Skip
                  </Button>
                )}
              </motion.div>
              {onNext && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Button
                    onClick={onNext}
                    disabled={isSubmitting || !canProceed}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-8 py-2 text-sm md:text-base"
                  >
                    Next
                  </Button>
                </motion.div>
              )}
              {onSubmit && (
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting || !canProceed}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 md:px-12 py-2 text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">
                        <i className="fas fa-circle-notch fa-spin" />
                      </span>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column - Content */}
        <div className="relative h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute inset-0 p-4 md:p-8 flex flex-col justify-center"
          >
            {rightContent}
          </motion.div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className=" md:hidden h-[82vh] flex flex-col">
        {/* Mobile Progress Bar - At Top */}
        {mobileProgress && (
          <div className="px-4 py-4 border-b border-white/10">
            {mobileProgress}
          </div>
        )}

        {/* Header Section */}
        <div className="px-4 py-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/60 mt-1 text-sm"
          >
            {description}
          </motion.p>
        </div>

        {/* Form Content Section - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
          <motion.div className="space-y-6">{children}</motion.div>
        </div>

        {/* Navigation Buttons - Fixed at bottom */}
        <motion.div className="px-4 py-4 mt-auto border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <motion.div className="flex space-x-2">
              {onPrev && (
                <button
                  onClick={onPrev}
                  disabled={isSubmitting}
                  className="border border-white/20 text-white px-4 py-2 text-sm bg-transparent hover:bg-transparent"
                >
                  Prev
                </button>
              )}
              {onFirstSection && (
                <button
                  onClick={onFirstSection}
                  disabled={isSubmitting}
                  className="border border-white/20 text-white px-4 py-2 text-sm bg-transparent hover:bg-transparent"
                >
                  Prev
                </button>
              )}
              {onSkip && (
                <Button
                  onClick={onSkip}
                  disabled={isSubmitting}
                  className="text-white/60 hover:text-white px-4 py-2 text-sm"
                >
                  Skip
                </Button>
              )}
            </motion.div>
            <div className="flex space-x-2">
              {onNext && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Button
                    onClick={onNext}
                    disabled={isSubmitting || !canProceed}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 text-sm"
                  >
                    Next
                  </Button>
                </motion.div>
              )}
              {onSubmit && (
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting || !canProceed}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">
                        <i className="fas fa-circle-notch fa-spin" />
                      </span>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
