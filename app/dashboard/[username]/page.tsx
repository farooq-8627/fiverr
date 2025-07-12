"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/UI/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Button } from "@/components/UI/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/UI/badge";

export default function ProfilePage() {
  const { username } = useParams();
  const { profile, isLoading, error } = useUserProfile(username as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Banner and Profile Section */}
          <GlassCard className="relative overflow-hidden">
            {/* Banner */}
            <div className="h-48 relative">
              {profile.personalDetails.bannerImage?.asset.url ? (
                <img
                  src={profile.personalDetails.bannerImage.asset.url}
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
              )}
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col items-start">
                <Avatar className="w-24 h-24 -mt-12 border-4 border-black/50 shadow-xl">
                  <AvatarImage
                    src={profile.personalDetails.profilePicture?.asset.url}
                  />
                  <AvatarFallback>
                    {profile.personalDetails.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4">
                  <h1 className="text-2xl font-bold">
                    {profile.coreIdentity.fullName}
                  </h1>
                  <p className="text-gray-400">
                    {profile.coreIdentity.companyName}
                  </p>
                  {profile.personalDetails.website && (
                    <a
                      href={profile.personalDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Suggestions Section (Only for logged-in users) */}
          <GlassCard>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Suggestions</h2>
              <div className="flex gap-4">
                <Button className="bg-white/10 hover:bg-white/20">
                  Add Projects
                </Button>
                <Button className="bg-white/10 hover:bg-white/20">
                  Add Posts
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* About Section */}
          <GlassCard>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {profile.mustHaveRequirements?.bio}
              </p>
            </div>
          </GlassCard>

          {/* Experience Section */}
          {profile.isAgentProfile && (
            <GlassCard>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Experience</h2>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {profile.mustHaveRequirements?.experience}
                </p>
              </div>
            </GlassCard>
          )}

          {/* Projects Section */}
          <GlassCard>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project cards will go here */}
              </div>
            </div>
          </GlassCard>

          {/* Industries Section */}
          <GlassCard>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Industries</h2>
              <div className="flex flex-wrap gap-2">
                {profile.isAgentProfile
                  ? profile.mustHaveRequirements?.industryDomain.map(
                      (industry: string, index: number) => (
                        <Badge
                          key={`industry-${index}`}
                          variant="outline"
                          className="bg-purple-500/10 text-purple-400 border-purple-500/20"
                        >
                          {industry}
                        </Badge>
                      )
                    )
                  : profile.mustHaveRequirements?.industryDomain.map(
                      (industry: string, index: number) => (
                        <Badge
                          key={`industry-${index}`}
                          variant="outline"
                          className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                        >
                          {industry}
                        </Badge>
                      )
                    )}
              </div>
            </div>
          </GlassCard>

          {/* Requirements Section */}
          <GlassCard>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Requirements</h2>
              <div className="flex flex-wrap gap-2">
                {profile.mustHaveRequirements?.requirements?.map(
                  (requirement: string, index: number) => (
                    <Badge
                      key={`requirement-${index}`}
                      variant="outline"
                      className={`${
                        profile.isAgentProfile
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {requirement}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </GlassCard>

          {/* Deal Breakers Section */}
          <GlassCard>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Deal Breakers</h2>
              <div className="flex flex-wrap gap-2">
                {profile.mustHaveRequirements?.dealBreakers?.map(
                  (dealBreaker: string, index: number) => (
                    <Badge
                      key={`dealBreaker-${index}`}
                      variant="outline"
                      className={`${
                        profile.isAgentProfile
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {dealBreaker}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Suggestions Sidebar */}
        <div className="hidden lg:block">
          <GlassCard className="sticky top-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                People suggestions based on this profile
              </h2>
              <div className="space-y-4">
                {profile.isAgentProfile ? (
                  <p className="text-gray-400 text-sm">
                    We will recommend potential clients for this profile
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    We will recommend potential agents for this profile
                  </p>
                )}
                {/* Add suggestion cards here */}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
