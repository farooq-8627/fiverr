"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "../UI/GlassCard";
import { HTMLMotionProps } from "framer-motion";

interface OnboardingCardProps extends HTMLMotionProps<"div"> {
  className?: string;
  children: React.ReactNode;
}

export function OnboardingCard({
  className,
  children,
  ...props
}: OnboardingCardProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className={cn("relative w-full max-w-7xl mx-auto", className)}>
        <div className="relative">
          {/* Glass card background */}
          <GlassCard theme="dark" className="w-full h-full" {...props}>
            {children}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
