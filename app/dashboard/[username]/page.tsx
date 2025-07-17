"use client";

import { MenuBar } from "@/components/UI/glow-menu";
import { AgentProfileTab } from "@/components/Dashboard/AgentProfileTab";
import { ClientProfileTab } from "@/components/Dashboard/ClientProfileTab";
import { UserCircle2, Users } from "lucide-react";
import { useState } from "react";
import React from "react";
import { AgentProfile, ClientProfile } from "@/types";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { ProfileBannerCard } from "@/components/Dashboard/ProfileBannerCard";
import { AboutCard } from "@/components/Dashboard/ProfileCards/AboutCard";
import { useUser } from "@/hooks/useUser";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const unwrappedParams = React.use(params) as { username: string };
  const [activeTab, setActiveTab] = useState("Agent Profile");
  const { agentProfiles, clientProfiles, loading, error } = useUserProfiles();
  const { user: userProfile, isLoading: userLoading } = useUser();

  if (loading || userLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profiles</div>;
  }

  // Check if the current user is viewing their own profile
  const isCurrentUser =
    userProfile?.personalDetails?.username === unwrappedParams.username;

  const menuItems = [
    {
      icon: UserCircle2,
      label: "Agent Profile",
      href: "#agent",
      gradient: "rgba(59, 130, 246, 0.2), transparent 80%",
      iconColor: "text-blue-500",
    },
    {
      icon: Users,
      label: "Client Profile",
      href: "#client",
      gradient: "rgba(139, 92, 246, 0.2), transparent 80%",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-4">
      {/* Profile Banner */}
      {userProfile && (
        <div className="">
          <ProfileBannerCard
            bannerImage={
              userProfile.personalDetails?.bannerImage?.asset?.url || ""
            }
            profilePicture={
              userProfile.personalDetails?.profilePicture?.asset?.url || ""
            }
            fullName={userProfile.coreIdentity?.fullName || ""}
            username={userProfile.personalDetails?.username || ""}
            website={userProfile.personalDetails?.website || ""}
            bio={userProfile.coreIdentity?.bio || ""}
            tagline={userProfile.coreIdentity?.tagline || ""}
            location={userProfile.profileDetails?.location}
            socialLinks={userProfile.personalDetails?.socialLinks}
            isCurrentUser={isCurrentUser}
          />
        </div>
      )}

      {/* About Section */}
      {userProfile?.coreIdentity?.bio && (
        <div className="mb-8">
          <AboutCard bio={userProfile.coreIdentity.bio} />
        </div>
      )}

      {/* Profile Tabs using Glow Menu */}
      <div className="w-full mb-8">
        <div className="max-w-2xl mx-auto mb-8">
          <MenuBar
            items={menuItems}
            activeItem={activeTab}
            onItemClick={setActiveTab}
            className="w-full"
          />
        </div>

        <div className="mt-6">
          {activeTab === "Agent Profile" && (
            <AgentProfileTab
              profiles={agentProfiles as AgentProfile[]}
              isCurrentUser={isCurrentUser}
            />
          )}
          {activeTab === "Client Profile" && (
            <ClientProfileTab profiles={clientProfiles as ClientProfile[]} />
          )}
        </div>
      </div>
    </div>
  );
}
