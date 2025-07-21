"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/UI/GlassCard";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { ExternalLink, MessageSquare } from "lucide-react";
import Image from "next/image";

interface UserProfile {
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
    teamSize?: string;
  };
}

interface ClientProfile {
  automationNeeds: {
    automationRequirements: string[];
  };
  projects?: Array<{
    title: string;
    description: string;
    businessDomain: string;
  }>;
}

interface ClientCardProps {
  userProfile: UserProfile;
  clientProfile: ClientProfile;
  className?: string;
}

export function ClientCard({
  userProfile,
  clientProfile,
  className,
}: ClientCardProps) {
  const { personalDetails, coreIdentity, companyDetails } = userProfile;
  const { automationNeeds, projects } = clientProfile;

  // Get the latest/active project if available
  const activeProject = projects?.[0];

  // Select profile image or use placeholder
  const profileImage =
    personalDetails?.profilePicture?.asset?.url ||
    "/images/placeholder-profile.png";
  const bannerImageUrl =
    personalDetails?.bannerImage?.asset?.url ||
    "/images/placeholder-banner.jpg";

  return (
    <GlassCard className="overflow-hidden">
      {/* Banner Section */}
      <div className="relative h-32">
        <Image
          src={bannerImageUrl}
          alt="Profile Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <div className="absolute -top-10 w-20 h-20 rounded-full border-4 border-black overflow-hidden">
          <Image
            src={profileImage}
            alt={personalDetails?.username || "Client"}
            fill
            className="object-cover"
          />
        </div>

        {/* Name and Title Section */}
        <div className="pt-12 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {coreIdentity?.fullName ||
                  personalDetails?.username ||
                  "Client"}
              </h2>
              {coreIdentity?.tagline && (
                <p className="text-sm text-gray-300">{coreIdentity.tagline}</p>
              )}
            </div>
            {personalDetails?.website && (
              <Link
                href={
                  personalDetails.website.startsWith("http")
                    ? personalDetails.website
                    : `https://${personalDetails.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                Portfolio
                <ExternalLink size={12} />
              </Link>
            )}
          </div>
        </div>

        {/* Project/Bio Section */}
        <div className="mb-6">
          {activeProject?.title && (
            <h3 className="text-white font-medium mb-2">
              {activeProject.title}
            </h3>
          )}
          <p className="text-sm text-gray-300 line-clamp-3">
            {activeProject?.description ||
              coreIdentity?.bio ||
              "Looking for automation expertise to help with project needs."}
          </p>
        </div>

        {/* Automation Needs Tags */}
        {automationNeeds?.automationRequirements?.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {automationNeeds.automationRequirements.map((need, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-900/30 border-blue-500/40 text-blue-200 hover:bg-blue-800/40"
                >
                  {need}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Company Info */}
        {companyDetails && (
          <div className="mb-6">
            <Button
              variant="outline"
              className="w-full flex items-center gap-3 h-auto p-3"
            >
              <div className="w-10 h-10 relative shrink-0">
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
                <p className="font-medium text-white">{companyDetails.name}</p>
                <p className="text-sm text-gray-400 line-clamp-1">
                  {companyDetails.bio}
                </p>
              </div>
            </Button>
          </div>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {/* Business Domain */}
          {activeProject?.businessDomain && (
            <div>
              <span className="text-xs text-gray-400">Industry</span>
              <p className="text-sm font-medium text-white">
                {activeProject.businessDomain}
              </p>
            </div>
          )}

          {/* Team Size */}
          {companyDetails?.teamSize && (
            <div>
              <span className="text-xs text-gray-400">Team Size</span>
              <p className="text-sm font-medium text-white">
                {companyDetails.teamSize}
              </p>
            </div>
          )}

          {/* Message Button */}
          <Button
            variant="outline"
            className="ml-auto border-blue-600/50 bg-blue-900/20 text-blue-300 hover:bg-blue-800/30 p-2 rounded-full"
          >
            <MessageSquare className="h-4 w-4 " />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
