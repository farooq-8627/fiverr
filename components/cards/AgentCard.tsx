"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/UI/GlassCard";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { ExternalLink, MessageSquare } from "lucide-react";
import Image from "next/image";
import { UserMessageButton } from "@/components/mesaging/UserMessageButton";

interface UserProfile {
  _id?: string;
  clerkId?: string;
  personalDetails: {
    username?: string;
    website?: string;
    socialLinks?: Array<{ platform: string; url: string }>;
    profilePicture?: { asset: { url: string } };
    bannerImage?: { asset: { url: string } };
  };
  coreIdentity: {
    fullName?: string;
    tagline?: string;
    bio?: string;
  };
  companyDetails?: {
    name?: string;
    bio?: string;
    logo?: { asset: { url: string } };
  };
}

interface AgentProfile {
  automationExpertise: {
    automationServices: string[];
    toolsExpertise: string[];
  };
  availability: {
    currentStatus: string;
  };
  pricing: {
    hourlyRateRange: string;
  };
}

interface AgentCardProps {
  userProfile: UserProfile;
  agentProfile: AgentProfile;
  className?: string;
}

export function AgentCard({
  userProfile,
  agentProfile,
  className,
}: AgentCardProps) {
  const router = useRouter();
  const { personalDetails, coreIdentity, companyDetails } = userProfile;
  const { automationExpertise, availability, pricing } = agentProfile;

  console.log("agentProfile", agentProfile);

  // Select profile image or use placeholder
  const profileImage =
    personalDetails?.profilePicture?.asset?.url ||
    "/images/placeholder-profile.png";
  const bannerImage =
    personalDetails?.bannerImage?.asset?.url ||
    "/images/placeholder-banner.jpg";

  // Format social links
  const website = personalDetails?.website || "";

  const handleCardClick = () => {
    if (personalDetails?.username) {
      router.push(`/dashboard/${personalDetails.username}`);
    }
  };

  const handlePortfolioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (website) {
      window.open(
        website.startsWith("http") ? website : `https://${website}`,
        "_blank"
      );
    }
  };

  return (
    <div onClick={handleCardClick} className="block group cursor-pointer">
      <GlassCard className="overflow-hidden" padding="p-0">
        {/* Banner Section - reduced height for mobile */}
        <div className="relative h-20 sm:h-28">
          <Image
            src={bannerImage}
            alt="Profile Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
        </div>

        {/* Profile Section - adjusted padding for mobile */}
        <div className="relative px-4 sm:px-6">
          {/* Profile Image - smaller size for mobile */}
          <div className="absolute -top-8 sm:-top-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
            <Image
              src={profileImage}
              alt={personalDetails?.username || "Agent"}
              fill
              className="object-cover"
            />
          </div>

          {/* Name and Title Section - adjusted padding for mobile */}
          <div className="pt-10 sm:pt-12 mb-3 sm:mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {coreIdentity?.fullName ||
                    personalDetails?.username ||
                    "Agent"}
                </h2>
                {coreIdentity?.tagline && (
                  <p className="text-xs sm:text-sm text-gray-300">
                    {coreIdentity.tagline}
                  </p>
                )}
              </div>
              {website && (
                <Button
                  variant="link"
                  onClick={handlePortfolioClick}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 p-0 h-auto"
                >
                  Portfolio
                  <ExternalLink size={12} />
                </Button>
              )}
            </div>
          </div>

          {/* Bio Section - adjusted height for mobile */}
          <div className="mb-4 sm:mb-6 sm:min-h-[5rem]">
            <p className="text-xs sm:text-sm text-gray-300 line-clamp-4">
              {coreIdentity?.bio || "No bio available"}
            </p>
          </div>

          {/* Expertise Tags - smaller text and padding for mobile */}
          {automationExpertise?.automationServices && (
            <div className="w-full whitespace-nowrap pb-1.5 sm:pb-2 overflow-x-auto">
              <div className="flex gap-1.5 sm:gap-2">
                {automationExpertise.automationServices.map(
                  (service, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs sm:text-sm bg-purple-900/30 border-purple-500/40 text-purple-200 hover:bg-purple-800/40 shrink-0"
                    >
                      {service}
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}

          {/* Tools Expertise Tags - smaller text and padding for mobile */}
          {automationExpertise?.toolsExpertise && (
            <div className="w-full whitespace-nowrap pb-1.5 sm:pb-2 overflow-x-auto">
              <div className="flex gap-1.5 sm:gap-2">
                {automationExpertise.toolsExpertise.map((tool, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs sm:text-sm bg-blue-900/30 border-blue-500/40 text-blue-200 hover:bg-blue-800/40 shrink-0"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Company Info - adjusted padding and sizes for mobile */}
          {companyDetails && (
            <div className="mb-2">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 sm:gap-3 h-auto p-2 sm:p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 relative shrink-0">
                  <Image
                    src={
                      companyDetails.logo?.asset?.url ||
                      "/images/placeholder-profile.png"
                    }
                    alt={companyDetails.name || "Company"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-medium text-white">
                    {companyDetails.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">
                    {companyDetails.bio}
                  </p>
                </div>
              </Button>
            </div>
          )}

          {/* Bottom Info - adjusted padding and text size for mobile */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 gap-1.5 sm:gap-2 pb-4 md:pb-6">
            {/* Rate */}
            {pricing?.hourlyRateRange && (
              <div>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  Rate
                </span>
                <p className="text-xs sm:text-sm font-medium text-white">
                  {pricing.hourlyRateRange}
                </p>
              </div>
            )}

            {/* Availability */}
            {availability?.currentStatus && (
              <div>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  Availability
                </span>
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    availability.currentStatus === "Available"
                      ? "text-green-400"
                      : availability.currentStatus === "Limited"
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {availability.currentStatus}
                </p>
              </div>
            )}

            {/* Message Button */}
            {userProfile.clerkId && (
              <UserMessageButton
                targetUserId={userProfile.clerkId}
                targetUserName={coreIdentity?.fullName || "User"}
                targetUserAvatar={personalDetails?.profilePicture?.asset?.url}
                variant="outline"
                size="sm"
                className="ml-auto border-blue-600/50 bg-blue-900/20 text-blue-300 hover:bg-blue-800/30 p-1.5 sm:p-2 rounded-full"
              >
                <MessageSquare className="h-4 w-4 sm:h-4 sm:w-4" />
              </UserMessageButton>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
