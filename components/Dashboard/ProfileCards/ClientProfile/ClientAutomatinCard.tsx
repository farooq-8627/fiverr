import React, { useState } from "react";
import { Button } from "@/components/UI/button";
import { Pencil, Zap, Wrench } from "lucide-react";
import { GlassCard } from "@/components/UI/GlassCard";
import {
  groupClientExpertiseByCategory,
  getClientAutomationNeedsInfo,
  getClientToolsInfo,
} from "@/lib/expertise-utils";
import {
  CLIENT_AUTOMATION_NEEDS,
  CLIENT_CURRENT_TOOLS,
} from "@/sanity/schemaTypes/constants";
import { ClientAutomationExpertiseEditModal } from "@/components/Dashboard/Edit/ClientProfile/ClientAutomationExpertiseEditModal";
import { cn } from "@/lib/utils";
import { Easing, motion, Variants } from "framer-motion";
import { ExpertiseItem } from "@/lib/expertise-utils";

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
        className="inline-flex flex-wrap gap-1 sm:gap-2"
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
                "group flex flex-row items-center gap-1 sm:gap-2 px-2 sm:px-2 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-base",
                item.colors.bg,
                item.colors.border,
                item.colors.hover
              )}
            >
              <div
                className={cn(
                  "p-1 sm:p-2 rounded-md transition-all duration-300 shrink-0",
                  item.colors.bg,
                  item.colors.border,
                  "group-hover:scale-110"
                )}
              >
                <Icon
                  className={cn("w-3 h-3 sm:w-4 sm:h-4", item.colors.text)}
                  strokeWidth={1.5}
                />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-medium truncate text-sm sm:text-base",
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
  type: "services" | "tools";
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
    <div className={cn("space-y-1 sm:space-y-2", className)}>
      <div className="flex flex-row items-center justify-between ">
        <h2 className="text-sm sm:text-base font-semibold text-violet-200 flex items-center">
          <Icon
            className={`inline-block mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`}
          />
          {title}
        </h2>
      </div>
      <div className="flex flex-row gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {groups.map(([category, items]) => (
          <ExpertiseCard key={category} title={category} items={items} />
        ))}
      </div>
    </div>
  );
}

interface ClientAutomationCardProps {
  automationNeeds: {
    automationRequirements: string[];
    currentTools: string[];
  };

  isCurrentUser?: boolean;
  profileId: string;
}

export function ClientAutomationCard({
  automationNeeds,
  isCurrentUser,
  profileId,
}: ClientAutomationCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExpertise, setCurrentExpertise] = useState(automationNeeds);

  const updateAutomationNeeds = (data: {
    automationRequirements: string[];
    currentTools: string[];
  }) => {
    setCurrentExpertise(data);
  };

  return (
    <>
      <GlassCard>
        <div className="md:px-6 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Automation Needs</h2>
            {isCurrentUser && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <Pencil className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>

          {/* Services Section */}
          <GroupedExpertise
            title="Automation Needs"
            groups={groupClientExpertiseByCategory(
              [...currentExpertise.automationRequirements],
              getClientAutomationNeedsInfo
            )}
            className="mb-8"
            type="services"
          />

          {/* Tools Section */}
          <GroupedExpertise
            title="Current Tools"
            groups={groupClientExpertiseByCategory(
              [...currentExpertise.currentTools],
              getClientToolsInfo
            )}
            type="tools"
          />
        </div>
      </GlassCard>

      <ClientAutomationExpertiseEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          profileId,
          automationRequirements: currentExpertise.automationRequirements,
          currentTools: currentExpertise.currentTools,
        }}
        isCurrentUser={isCurrentUser ?? false}
        onExpertiseUpdate={updateAutomationNeeds}
      />
    </>
  );
}
