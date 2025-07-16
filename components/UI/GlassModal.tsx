"use client";

import React from "react";
import { X } from "lucide-react";
import { Modal, ModalContent } from "./modal";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[90vw]",
};

export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  size = "md",
}: GlassModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="p-0 border-none bg-transparent ">
        <GlassCard
          className={cn(
            "w-full relative",
            sizeClasses[size],
            "mx-auto",
            className
          )}
          padding="p-0"
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {title && (
            <div className="px-6 py-4 border-b border-white/[0.05]">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>
          )}

          <div className={cn("p-6", !title && "pt-4")}>{children}</div>
        </GlassCard>
      </ModalContent>
    </Modal>
  );
}
