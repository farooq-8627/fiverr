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
  return (
    <div className="grid grid-cols-2 h-[82vh]">
      {/* Left Column - Form */}
      <div className="flex flex-col h-full border-r border-white/10">
        {/* Header Section - Fixed at top */}
        <div className="px-6 py-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/60 mt-1"
          >
            {description}
          </motion.p>
        </div>

        {/* Form Content Section - Elastic */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          <motion.div className="space-y-6 pr-4">{children}</motion.div>
        </div>

        {/* Navigation Buttons - Fixed at bottom */}
        <motion.div className="px-6 mr-4 py-4 mt-auto">
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
                  className="border border-white/20 hover:bg-white/10 text-white px-8 py-2"
                >
                  Prev
                </Button>
              )}
              {onFirstSection && (
                <Button
                  onClick={onFirstSection}
                  disabled={isSubmitting}
                  className="border border-white/20 hover:bg-white/10 text-white px-8 py-2"
                >
                  Prev
                </Button>
              )}
              {onSkip && (
                <Button
                  onClick={onSkip}
                  disabled={isSubmitting}
                  className="text-white/60 hover:text-white px-8 py-2"
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
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
                >
                  Next
                </Button>
              </motion.div>
            )}
            {onSubmit && (
              <Button
                onClick={onSubmit}
                disabled={isSubmitting || !canProceed}
                className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-2"
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
          className="absolute inset-0 p-8 flex flex-col justify-center"
        >
          {rightContent}
        </motion.div>
      </div>
    </div>
  );
}
