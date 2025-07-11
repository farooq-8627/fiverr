"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/UI/GlassCard";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { ExternalLink, MessageSquare } from "lucide-react";
import type { AgentProfile } from "@/hooks/useUseProfile";
import Image from "next/image";

interface AgentCardProps {
  profile: AgentProfile;
  className?: string;
}

export function AgentCard({ profile, className }: AgentCardProps) {
  const {
    personalDetails,
    coreIdentity,
    automationExpertise,
    availability,
    businessDetails,
  } = profile;

  // Select profile image or use placeholder
  const profileImage =
    personalDetails?.profilePicture?.asset?.url ||
    "/images/placeholder-profile.png";
  const bannerImage =
    personalDetails?.bannerImage?.asset?.url ||
    "/images/placeholder-banner.jpg";

  // Format social links
  const website = personalDetails?.website || "";
  const socialLinks = personalDetails?.socialLinks || [];

  return (
    <GlassCard className="">
      {/* Banner and Profile Image Section */}
      <div className="relative h-24">
        <div className="absolute inset-0 rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
            {bannerImage ? (
              <Image
                src={bannerImage}
                alt="Profile Banner"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
                Banner Image
              </div>
            )}
          </div>
        </div>

        {/* Profile Image and Name Section - Aligned horizontally */}
        <div className="absolute -bottom-12 left-6 flex items-end">
          <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden border-2 border-white shadow-xl backdrop-blur-sm">
            <Image
              src={profileImage}
              alt={personalDetails?.username || "Agent"}
              fill
              className="object-cover"
            />
          </div>

          {/* Name and Website - Right of profile image */}
          <div className="ml-4">
            <h2 className="text-xl font-bold text-white line-clamp-1">
              {coreIdentity?.fullName || personalDetails?.username || "Agent"}
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
          {/* Bio Section */}
          <div className="text-sm text-gray-300 flex-grow">
            <p
              className={`${
                coreIdentity?.hasCompany ? "line-clamp-4" : "line-clamp-6"
              }`}
            >
              {(coreIdentity?.hasCompany && coreIdentity?.companyDescription) ||
                "Automation expert ready to help with your project needs. Specializing in creating efficient and reliable automated solutions for businesses of all sizes. We are a company of ecommerce. John Doe Inc. is a company that does things. We are a company of ecommerce. John Doe Inc. is a company that does things. We are a company of ecommerce."}
            </p>
          </div>

          <div className="mt-auto">
            {/* Expertise Tags */}
            {automationExpertise?.automationServices && (
              <div className="mb-2">
                <div className="flex flex-nowrap gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {automationExpertise.automationServices.map(
                    (service, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-purple-900/30 border-purple-500/40 text-purple-200 hover:bg-purple-800/40 shrink-0"
                      >
                        {service}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Company Info (if available) */}
            {coreIdentity?.hasCompany && (
              <Button className="flex items-center gap-2 w-full text-sm text-gray-300 border border-white/40 hover:bg-white/5 p-2">
                {coreIdentity.hasCompany && (
                  <div className="w-8 h-8 relative shrink-0">
                    <Image
                      src={
                        coreIdentity.logo?.asset?.url ||
                        "/images/placeholder-profile.png"
                      }
                      alt={coreIdentity.fullName || "Independent Consultant"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-start items-start overflow-hidden">
                  <span className="text-sm font-medium truncate w-full text-left">
                    {coreIdentity.companyName || "Independent Consultant"}
                  </span>
                  <span className="text-xs text-gray-400 line-clamp-1 overflow-hidden text-left w-fit">
                    {coreIdentity.companyDescription ||
                      "Independent Consultant"}
                  </span>
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Info Section: Rate & Availability */}
        <div className="flex justify-between items-center mt-3 pt-4 border-t border-white/10 gap-4">
          {/* Pricing if available */}
          {profile.pricing && (
            <div className="text-sm">
              <span className="text-gray-400 block text-xs">Rate</span>
              <span className="font-medium text-white">
                {profile.pricing.hourlyRateRange}
              </span>
            </div>
          )}

          {/* Availability if available */}
          {availability && (
            <div className="text-sm">
              <span className="text-gray-400 block text-xs">Availability</span>
              <span
                className={`font-medium ${
                  availability.availabilityStatus === "Available"
                    ? "text-green-400"
                    : availability.availabilityStatus === "Limited"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {availability.availabilityStatus || "Available"}
              </span>
            </div>
          )}

          {/* Message Button */}
          <Button className="ml-auto border border-blue-600/50 bg-blue-900/20 text-blue-300 hover:bg-blue-800/30 px-2 py-1 text-sm rounded-md">
            <MessageSquare className="h-4 w-4 mr-1" /> Message
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
