import React from "react";
import { motion, Variants, Easing } from "framer-motion";
import { ExpertiseItem } from "@/lib/expertise-utils";
import { cn } from "@/lib/utils";
import { Zap, Wrench } from "lucide-react";

interface ExpertiseCardProps {
  title: string;
  items: ExpertiseItem[];
  className?: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1.0] as Easing,
      staggerChildren: 0.1,
    },
  },
};

const itemChildVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1.0] as Easing,
    },
  },
};

export function ExpertiseCard({ title, items, className }: ExpertiseCardProps) {
  return (
    <div className={cn("rounded-xl inline-block", className)}>
      <motion.div
        className="inline-flex flex-wrap gap-2"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        viewport={{ once: true }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.value}
              variants={itemChildVariants}
              className={cn(
                "group flex flex-row items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-base",
                item.colors.bg,
                item.colors.hover
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-md transition-all duration-300 shrink-0",
                  item.colors.bg,
                  "group-hover:scale-110"
                )}
              >
                <Icon
                  className={cn("w-3 h-3 md:w-5 md:h-5", item.colors.text)}
                  strokeWidth={1.5}
                />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-medium truncate text-sm md:text-base",
                    item.colors.text
                  )}
                >
                  {item.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// Component for displaying grouped expertise items
interface GroupedExpertiseProps {
  title: string;
  groups: [string, ExpertiseItem[]][];
  className?: string;
  type: "services" | "tools"; // Add type to determine which icon to show
}

export function GroupedExpertise({
  title,
  groups,
  className,
  type,
}: GroupedExpertiseProps) {
  const Icon = type === "services" ? Zap : Wrench;
  const iconColor = type === "services" ? "text-violet-400" : "text-indigo-400";

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold text-violet-200 flex items-center">
          <Icon className={`inline-block mr-2 h-5 w-5 ${iconColor}`} />
          {title}
        </h2>
      </div>
      <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar">
        {groups.map(([category, items]) => (
          <ExpertiseCard
            key={category}
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            items={items}
          />
        ))}
      </div>
    </div>
  );
}
