"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/UI/GlassCard";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { ExternalLink, MessageSquare, Building2, Users } from "lucide-react";
import Image from "next/image";
import { UserMessageButton } from "@/components/mesaging/UserMessageButton";

export interface CompanyProfile {
  _id: string;
  name: string;
  tagline?: string;
  bio?: string;
  website?: string;
  teamSize?: string;
  industries?: string[];
  customIndustries?: string[];
  companyType: "agent" | "client";
  logo?: {
    asset: {
      url: string;
    };
  };
  banner?: {
    asset: {
      url: string;
    };
  };
  createdBy?: string; // This will be the clerkId of the user who created the company
  createdAt: string;
  updatedAt?: string;
}

interface CompanyCardProps {
  company: CompanyProfile;
  className?: string;
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  const router = useRouter();

  // Select images or use placeholders
  const logoImage =
    company.logo?.asset?.url || "/images/placeholder-company.png";
  const bannerImage =
    company.banner?.asset?.url || "/images/placeholder-banner.jpg";

  const handleCardClick = () => {
    router.push(`/companies/${company._id}`);
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (company.website) {
      window.open(
        company.website.startsWith("http")
          ? company.website
          : `https://${company.website}`,
        "_blank"
      );
    }
  };

  return (
    <div onClick={handleCardClick} className="block group cursor-pointer">
      <GlassCard className="overflow-hidden" padding="p-0">
        {/* Banner Section */}
        <div className="relative h-20 sm:h-32">
          <Image
            src={bannerImage}
            alt="Company Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
        </div>

        {/* Profile Section */}
        <div className="relative px-4 sm:px-6">
          {/* Company Logo */}
          <div className="absolute -top-8 sm:-top-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-black overflow-hidden">
            <Image
              src={logoImage}
              alt={company.name || "Company"}
              fill
              className="object-cover"
            />
          </div>

          {/* Name and Type Section */}
          <div className="pt-10 sm:pt-12 mb-3 sm:mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {company.name}
                </h2>
                {company.tagline && (
                  <p className="text-xs sm:text-sm text-gray-300">
                    {company.tagline}
                  </p>
                )}
              </div>
              {company.website && (
                <Button
                  variant="link"
                  onClick={handleWebsiteClick}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 p-0 h-auto"
                >
                  Website
                  <ExternalLink size={12} />
                </Button>
              )}
            </div>
          </div>

          {/* Bio Section */}
          {company.bio && (
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-3">
                {company.bio}
              </p>
            </div>
          )}

          {/* Company Type and Team Size */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                company.companyType === "agent"
                  ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                  : "bg-green-500/10 text-green-300 border-green-500/20"
              }`}
            >
              <Building2 className="w-3 h-3 mr-1" />
              {company.companyType === "agent" ? "Service Provider" : "Client"}
            </Badge>
            {company.teamSize && (
              <Badge
                variant="outline"
                className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-xs"
              >
                <Users className="w-3 h-3 mr-1" />
                {company.teamSize}
              </Badge>
            )}
          </div>

          {/* Industries */}
          {company.industries && company.industries.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-400 mb-2">
                Industries
              </h4>
              <div className="flex flex-wrap gap-1">
                {company.industries.slice(0, 3).map((industry, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-500/10 text-gray-300 border-gray-500/20 text-xs"
                  >
                    {industry}
                  </Badge>
                ))}
                {company.industries.length > 3 && (
                  <Badge
                    variant="outline"
                    className="bg-gray-500/10 text-gray-300 border-gray-500/20 text-xs"
                  >
                    +{company.industries.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pb-4">
            {company.createdBy && (
              <UserMessageButton
                targetUserId={company.createdBy}
                targetUserName={company.name}
                targetUserAvatar={company.logo?.asset?.url}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs sm:text-sm p-2 rounded-full"
              >
                <MessageSquare size={14} />
              </UserMessageButton>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
