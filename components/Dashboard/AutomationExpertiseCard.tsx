import React, { useState } from "react";
import { Button } from "@/components/UI/button";
import { Pencil } from "lucide-react";
import { GlassCard } from "@/components/UI/GlassCard";
import { GroupedExpertise } from "@/components/Dashboard/ExpertiseCard";
import {
  groupExpertiseByCategory,
  getAutomationServiceInfo,
  getToolsExpertiseInfo,
} from "@/lib/expertise-utils";
import { AutomationExpertiseEditModal } from "./Edit/AutomationExpertiseEditModal";

interface AutomationExpertiseCardProps {
  automationExpertise: {
    automationServices: string[];
    toolsExpertise: string[];
  };
  isCurrentUser?: boolean;
  profileId: string;
  onExpertiseUpdate: (data: {
    automationServices: string[];
    toolsExpertise: string[];
  }) => void;
}

export function AutomationExpertiseCard({
  automationExpertise,
  isCurrentUser,
  profileId,
  onExpertiseUpdate,
}: AutomationExpertiseCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExpertise, setCurrentExpertise] = useState(automationExpertise);

  const handleExpertiseUpdate = (data: {
    automationServices: string[];
    toolsExpertise: string[];
  }) => {
    setCurrentExpertise({
      automationServices: data.automationServices,
      toolsExpertise: data.toolsExpertise,
    });
    onExpertiseUpdate(data);
  };

  return (
    <>
      <GlassCard>
        <div className="md:px-6 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Automation Expertise</h2>
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
            title="Automation Services"
            groups={groupExpertiseByCategory(
              [...currentExpertise.automationServices],
              getAutomationServiceInfo
            )}
            className="mb-8"
            type="services"
          />

          {/* Tools Section */}
          <GroupedExpertise
            title="Tools & Platforms"
            groups={groupExpertiseByCategory(
              [...currentExpertise.toolsExpertise],
              getToolsExpertiseInfo
            )}
            type="tools"
          />
        </div>
      </GlassCard>

      <AutomationExpertiseEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          profileId,
          automationServices: currentExpertise.automationServices,
          toolsExpertise: currentExpertise.toolsExpertise,
        }}
        isCurrentUser={isCurrentUser ?? false}
        onExpertiseUpdate={handleExpertiseUpdate}
      />
    </>
  );
}
