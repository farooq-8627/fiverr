"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "./visually-hidden";

const Modal = SheetPrimitive.Root;

const ModalTrigger = SheetPrimitive.Trigger;

const ModalPortal = SheetPrimitive.Portal;

const ModalClose = SheetPrimitive.Close;

const ModalTitle = SheetPrimitive.Title;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
ModalOverlay.displayName = SheetPrimitive.Overlay.displayName;

interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  title?: string;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  ModalContentProps
>(({ className, children, title = "Modal", ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-7xl translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      <VisuallyHidden>
        <ModalTitle>{title}</ModalTitle>
      </VisuallyHidden>
      {children}
    </SheetPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = SheetPrimitive.Content.displayName;

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
};
