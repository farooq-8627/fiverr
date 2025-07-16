import React from "react";
import { motion, Variants, Easing } from "framer-motion";
import {
  BusinessDetailInfo,
  getBusinessDetailInfo,
  groupBusinessDetails,
} from "@/lib/business-utils";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BusinessDetailCardProps {
  info: BusinessDetailInfo;
  className?: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.215, 0.61, 0.355, 1.0] as Easing,
    },
  },
};

export function BusinessDetailCard({
  info,
  className,
}: BusinessDetailCardProps) {
  const Icon = info.icon;
  const isProjectSize = info.title.toLowerCase().includes("project size");

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200",
        "bg-white/5 hover:bg-white/10",
        isProjectSize ? "col-span-full" : "",
        className
      )}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
        <Icon className="w-4 h-4 text-violet-400" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-violet-200/80">
            {info.title}
          </h3>
          <div className="h-3 w-[1px] bg-violet-400/20" />
          <p className="text-sm font-medium text-violet-50 truncate">
            {isProjectSize
              ? info.value.split(",").slice(0, 2).join(", ") +
                (info.value.split(",").length > 2 ? "..." : "")
              : info.value}
          </p>
        </div>
        <p className="text-xs text-violet-200/50 line-clamp-1">
          {info.description}
        </p>
      </div>
    </motion.div>
  );
}

interface BusinessDetailsGroupProps {
  details: {
    pricingModel: string;
    availability: string;
    workType: string;
    teamSize?: string;
    projectSizePreferences?: string[];
  };
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export function BusinessDetailsGroup({
  details,
  className,
}: BusinessDetailsGroupProps) {
  const allDetails = groupBusinessDetails(details);
  // Flatten and sort details, ensuring project size is last
  const sortedDetails = Object.values(allDetails)
    .flat()
    .sort((a, b) => {
      if (a.title.toLowerCase().includes("project size")) return 1;
      if (b.title.toLowerCase().includes("project size")) return -1;
      return 0;
    });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("grid grid-cols-1 sm:grid-cols-2 gap-2", className)}
    >
      {sortedDetails.map((item) => (
        <BusinessDetailCard key={item.title} info={item} />
      ))}
    </motion.div>
  );
}
