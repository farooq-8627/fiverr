import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "../../../UI/GlassCard";
import { Button } from "../../../UI/button";
import { Badge } from "../../../UI/badge";
import {
  Pencil,
  FileText,
  Briefcase,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { RequirementsEditModal } from "../../Edit/ClientProfile/RequirementsEditModal";
import { cn } from "@/lib/utils";
import { INDUSTRY_DOMAINS } from "@/sanity/schemaTypes/constants";

interface RequirementsCardProps {
  mustHaveRequirements: {
    experience: string;
    dealBreakers: string[];
    industryDomain: string[];
    customIndustry?: string[];
    requirements: string[];
  };
  isCurrentUser: boolean;
  profileId: string;
}

export function RequirementsCard({
  mustHaveRequirements: initialRequirements,
  isCurrentUser,
  profileId,
}: RequirementsCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const hasTextOverflow =
        contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setHasOverflow(hasTextOverflow);
    }
  }, [requirements.experience]);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const renderBadges = (
    items: string[] = [],
    isIndustryDomain: boolean = false
  ) => {
    if (!items?.length)
      return <p className="text-gray-400 text-sm italic">None specified</p>;

    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => {
          const displayText = isIndustryDomain
            ? INDUSTRY_DOMAINS.find((ind) => ind.value === item)?.title || item
            : capitalizeFirstLetter(item);

          return (
            <Badge
              key={index}
              variant="outline"
              className="bg-violet-500/10 text-violet-200 border-violet-500/20 hover:bg-violet-500/20 p-2"
            >
              {displayText}
            </Badge>
          );
        })}
      </div>
    );
  };

  const handleSave = (data: typeof requirements) => {
    setRequirements(data);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <GlassCard>
        <div className="md:px-6 py-4 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-violet-50">
              Requirements & Preferences
            </h2>
            {isCurrentUser && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <Pencil className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Experience Section */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-violet-200">
                <FileText className="w-4 h-4 text-violet-400" />
                <h3 className="font-medium">Professional Experience</h3>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p
                  ref={contentRef}
                  className={cn(
                    "text-violet-100/90 leading-relaxed",
                    !isExpanded && "line-clamp-4"
                  )}
                >
                  {requirements.experience || "No experience details provided"}
                </p>
                {hasOverflow && (
                  <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="ghost"
                    className="mt-2 h-8 text-xs text-violet-300 hover:text-violet-200 hover:bg-transparent flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        Show Less <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Deal Breakers Section */}
            <div className="space-y-1">
              <div>
                <div className="flex items-center gap-2 text-violet-200 mb-1">
                  <AlertCircle className="w-4 h-4 text-violet-400" />
                  <h3 className="font-medium">Deal Breakers</h3>
                </div>
                <p className="text-gray-400 text-xs mb-3">
                  Non-negotiable requirements that must be met for project
                  consideration
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                {renderBadges(requirements.dealBreakers)}
              </div>
            </div>

            {/* Industry Domains Section */}
            <div className="space-y-1">
              <div>
                <div className="flex items-center gap-2 text-violet-200 mb-1">
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  <h3 className="font-medium">Industry Domains</h3>
                </div>
                <p className="text-gray-400 text-xs mb-3">
                  Industries and sectors where I have expertise or prefer to
                  work
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                {renderBadges(
                  [
                    ...(requirements.industryDomain || []),
                    ...(requirements.customIndustry || []),
                  ],
                  true
                )}
              </div>
            </div>

            {/* Requirements Section */}
            <div className="space-y-1">
              <div>
                <div className="flex items-center gap-2 text-violet-200 mb-1">
                  <FileText className="w-4 h-4 text-violet-400" />
                  <h3 className="font-medium">Project Requirements</h3>
                </div>
                <p className="text-gray-400 text-xs mb-3">
                  Specific technical or project-related requirements I work with
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                {renderBadges(requirements.requirements)}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <RequirementsEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={requirements}
        onSave={handleSave}
        profileId={profileId}
      />
    </>
  );
}
