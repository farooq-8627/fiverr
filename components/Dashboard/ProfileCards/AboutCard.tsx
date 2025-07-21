import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "../../UI/GlassCard";
import { Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/UI/button";
import { AboutEditModal } from "../Edit/AboutEditModal";
import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils";

interface AboutCardProps {
  bio: any; // Using any for now as it could be string or block content
  isCurrentUser: boolean;
}

export const AboutCard = ({ bio, isCurrentUser }: AboutCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBio, setCurrentBio] = useState(bio);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const hasContentOverflow =
          contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setHasOverflow(hasContentOverflow);
      }
    };

    // Check overflow after content is rendered
    checkOverflow();

    // Check overflow on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [currentBio]);

  const handleBioUpdate = (newBio: string) => {
    setCurrentBio(newBio);
  };

  return (
    <>
      <GlassCard>
        <div className="space-y-4 md:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">About</h2>
            {isCurrentUser && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <Pencil className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            <div
              ref={contentRef}
              className={cn(
                "transition-all duration-300",
                !isExpanded && "line-clamp-4"
              )}
            >
              {typeof currentBio === "string" ? (
                <p className="whitespace-pre-wrap">{currentBio}</p>
              ) : (
                <PortableText value={currentBio} />
              )}
            </div>
            {hasOverflow && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 h-4 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-transparent hover:bg-white/5"
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
      </GlassCard>

      <AboutEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentBio={typeof currentBio === "string" ? currentBio : ""}
        onBioUpdate={handleBioUpdate}
      />
    </>
  );
};
