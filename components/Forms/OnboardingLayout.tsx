"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassCard } from "../UI/GlassCard";

interface OnboardingLayoutProps {
  theme?: "dark" | "light";
  formContent: React.ReactNode;
  sideContent: React.ReactNode;
  className?: string;
}

export function OnboardingLayout({
  theme = "dark",
  formContent,
  sideContent,
  className,
}: OnboardingLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8",
        theme === "dark" ? "bg-black" : "bg-gray-50",
        className
      )}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-purple-700/20 to-black pointer-events-none" />

      {/* Animated glow spots */}
      <motion.div
        className="absolute left-1/4 top-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"
        animate={{
          opacity: [0.5, 0.3, 0.5],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
      />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard theme={theme} className="max-w-md mx-auto">
              {formContent}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
