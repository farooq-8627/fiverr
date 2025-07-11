"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/UI/GlassCard";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { ExternalLink, MessageSquare, Building2 } from "lucide-react";
import type { ClientProfile } from "@/types/client-profile";
import Image from "next/image";

interface ClientCardProps {
  profile: ClientProfile;
  className?: string;
}

export function ClientCard({ profile, className }: ClientCardProps) {
  const {
    fullName,
    hasCompany,
    company,
    automationNeeds,
    currentTools,
    projectTitle,
    projectDescription,
    businessDomain,
    budgetRange,
    timeline,
    profilePicture,
    bannerImage,
    website,
    username,
  } = profile;

  // Select profile image or use placeholder
  const profileImage =
    profilePicture?.asset?.url || "/images/placeholder-profile.png";
  const bannerImageUrl =
    bannerImage?.asset?.url || "/images/placeholder-banner.jpg";

  return (
    <GlassCard className="">
      {/* Banner and Profile Image Section */}
      <div className="relative h-24">
        <div className="absolute inset-0 rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
            <Image
              src={bannerImageUrl}
              alt="Profile Banner"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Profile Image and Name Section - Aligned horizontally */}
        <div className="absolute -bottom-12 left-6 flex items-end">
          <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden border-2 border-white shadow-xl backdrop-blur-sm">
            <Image
              src={profileImage}
              alt={username || "Client"}
              fill
              className="object-cover"
            />
          </div>

          {/* Name and Website - Right of profile image */}
          <div className="ml-4">
            <h2 className="text-xl font-bold text-white line-clamp-1">
              {fullName || username || "Client"}
            </h2>

            {website && (
              <Link
                href={
                  website.startsWith("http") ? website : `https://${website}`
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
      </div>

      {/* Content Section */}
      <div className="pt-14 pb-2">
        <div className="flex flex-col min-h-[180px]">
          {/* Project Description Section */}
          <div className="text-sm text-gray-300 flex-grow">
            <p className={`${hasCompany ? "line-clamp-4" : "line-clamp-6"}`}>
              {projectDescription ||
                "Looking for automation expertise to help with project needs."}
            </p>
          </div>

          <div className="mt-auto">
            {/* Automation Needs Tags */}
            {automationNeeds && automationNeeds.length > 0 && (
              <div className="mb-2 mt-3">
                <div className="flex flex-nowrap gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {automationNeeds.map((need, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-900/30 border-blue-500/40 text-blue-200 hover:bg-blue-800/40 shrink-0"
                    >
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info (if available) */}
            {hasCompany && company && (
              <Button className="flex items-center gap-2 w-full text-sm text-gray-300 border border-white/40 hover:bg-white/5 p-2">
                <div className="w-8 h-8 relative shrink-0">
                  <Image
                    src={
                      company.logo?.asset?.url ||
                      "/images/placeholder-profile.png"
                    }
                    alt={company.name || "Company"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-start items-start overflow-hidden">
                  <span className="text-sm font-medium truncate w-full text-left">
                    {company.name}
                  </span>
                  <span className="text-xs text-gray-400 line-clamp-1 overflow-hidden text-left w-fit">
                    {company.bio}
                  </span>
                </div>
              </Button>
            )}
          </div>

          {/* Bottom Info Section: Industry & Tools */}
          <div className="flex justify-between items-center mt-3 pt-4 border-t border-white/10 gap-4">
            {/* Business Domain */}
            <div className="text-sm">
              <span className="text-gray-400 block text-xs">Industry</span>
              <span className="font-medium text-white">
                {businessDomain || "Technology"}
              </span>
            </div>

            {/* Team Size - Show only if has company */}
            {hasCompany && company?.teamSize && (
              <div className="text-sm">
                <span className="text-gray-400 block text-xs">Team Size</span>
                <span className="font-medium text-white">
                  {company.teamSize}
                </span>
              </div>
            )}

            {/* Message Button */}
            <Button className="ml-auto border border-blue-600/50 bg-blue-900/20 text-blue-300 hover:bg-blue-800/30 px-2 py-1 text-sm rounded-md">
              <MessageSquare className="h-4 w-4 mr-1" /> Message
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
