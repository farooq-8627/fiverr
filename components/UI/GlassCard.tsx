"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  theme?: "dark" | "light";
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export function GlassCard({
  theme = "dark",
  children,
  className,
  padding = "p-6",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn("relative z-10", className)}
      style={{ perspective: 1500 }}
      {...props}
    >
      <motion.div className="relative" whileHover={{ z: 10 }}>
        <div className="relative group">
          {/* Card glow effect - reduced intensity */}
          <motion.div
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
            animate={{
              boxShadow: [
                "0 0 10px 2px rgba(255,255,255,0.03)",
                "0 0 15px 5px rgba(255,255,255,0.05)",
                "0 0 10px 2px rgba(255,255,255,0.03)",
              ],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            }}
          />

          {/* Card border glow */}
          <div className="absolute -inset-[0.5px] rounded-2xl border border-white/[0.1]" />

          {/* Glass card background */}
          <div
            className={cn(
              "relative bg-black/80 backdrop-blur-xl rounded-2xl   border border-white/[0.05] shadow-2xl overflow-hidden",
              padding
            )}
          >
            {/* Subtle card inner patterns */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                backgroundSize: "30px 30px",
              }}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
