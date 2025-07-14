"use client";

import { useParams } from "next/navigation";
import { GlassCard } from "@/components/UI/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/UI/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { useUser } from "@/hooks/useUser";
import { ProfileBannerCard } from "@/components/cards/ProfileBannerCard";

export default function ProfilePage() {
  const { user, isLoading: profileLoading, error: profileError } = useUser();
  const {
    agentProfiles,
    clientProfiles,
    loading: profilesLoading,
    error: profilesError,
  } = useUserProfiles();

  if (profileLoading || profilesLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || profilesError || !user) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6 w-full md:w-2/3">
      {/* User Profile Header */}
      <ProfileBannerCard
        bannerImage={user.personalDetails.bannerImage?.asset.url || ""}
        profilePicture={user.personalDetails.profilePicture?.asset.url || ""}
        fullName={user.coreIdentity.fullName}
        username={user.personalDetails.username}
        website={user.personalDetails.website || ""}
        tagline={user.coreIdentity.tagline || ""}
        socialLinks={user.personalDetails.socialLinks || []}
      />

      {/* Profile Tabs */}
      <Tabs defaultValue="agent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agent" disabled={!agentProfiles.length}>
            Agent Profile ({agentProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="client" disabled={!clientProfiles.length}>
            Client Profile ({clientProfiles.length})
          </TabsTrigger>
        </TabsList>

        {/* Agent Profiles Tab */}
        <TabsContent value="agent">
          {agentProfiles.map((agentProfile) => (
            <div key={agentProfile._id} className="space-y-6 mt-6">
              {/* Automation Expertise */}
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Automation Expertise
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium mb-2">Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {agentProfile.automationExpertise.automationServices.map(
                          (service, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-purple-500/10 text-purple-400 border-purple-500/20"
                            >
                              {service}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-2">Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        {agentProfile.automationExpertise.toolsExpertise.map(
                          (tool, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                            >
                              {tool}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Business Details */}
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Business Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Pricing Model</p>
                      <p className="font-medium">
                        {agentProfile.businessDetails.pricingModel}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Availability</p>
                      <p className="font-medium">
                        {agentProfile.businessDetails.availability}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Work Type</p>
                      <p className="font-medium">
                        {agentProfile.businessDetails.workType}
                      </p>
                    </div>
                    {agentProfile.businessDetails.teamSize && (
                      <div>
                        <p className="text-gray-400">Team Size</p>
                        <p className="font-medium">
                          {agentProfile.businessDetails.teamSize}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Projects */}
              {agentProfile.projects && agentProfile.projects.length > 0 && (
                <GlassCard>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {agentProfile.projects.map((project) => (
                        <div key={project._id} className="space-y-2">
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-gray-400">
                            {project.description}
                          </p>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-green-500/10 text-green-400 border-green-500/20"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {project.images && project.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {project.images.map((img, index) => (
                                <img
                                  key={index}
                                  src={img.image.asset.url}
                                  alt={img.alt}
                                  className="rounded-md w-full h-32 object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          ))}
        </TabsContent>

        {/* Client Profiles Tab */}
        <TabsContent value="client">
          {clientProfiles.map((clientProfile) => (
            <div key={clientProfile._id} className="space-y-6 mt-6">
              {/* Automation Needs */}
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Automation Needs
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium mb-2">Pain Points</h3>
                      <div className="flex flex-wrap gap-2">
                        {clientProfile.automationNeeds.automationRequirements.map(
                          (point, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-red-500/10 text-red-400 border-red-500/20"
                            >
                              {point}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-2">
                        Automation Goals
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {clientProfile.automationNeeds.currentTools.map(
                          (goal, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-green-500/10 text-green-400 border-green-500/20"
                            >
                              {goal}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Communication Preferences */}
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Communication Preferences
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Languages</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {clientProfile.communicationPreferences?.languagesSpoken?.map(
                          (lang, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                            >
                              {lang}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400">Timezone</p>
                      <p className="font-medium">
                        {clientProfile.communicationPreferences?.timeZone}
                      </p>
                    </div>
                    {clientProfile.communicationPreferences
                      ?.meetingAvailability && (
                      <div className="col-span-2">
                        <p className="text-gray-400">Available Hours</p>
                        <p className="font-medium">
                          {
                            clientProfile.communicationPreferences
                              ?.meetingAvailability
                          }{" "}
                          -{" "}
                          {
                            clientProfile.communicationPreferences
                              ?.meetingAvailability
                          }{" "}
                          (
                          {
                            clientProfile.communicationPreferences
                              ?.meetingAvailability
                          }
                          )
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Projects */}
              {clientProfile.projects && clientProfile.projects.length > 0 && (
                <GlassCard>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Projects</h2>
                    <div className="grid grid-cols-1 gap-6">
                      {clientProfile.projects.map((project) => (
                        <div
                          key={project._id}
                          className="space-y-4 border border-white/10 rounded-lg p-4"
                        >
                          <div>
                            <h3 className="font-medium text-lg">
                              {project.title}
                            </h3>
                            <p className="text-gray-400">
                              {project.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-gray-400 text-sm">
                                Budget Range
                              </p>
                              <p className="font-medium">
                                {project.budgetRange}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Timeline</p>
                              <p className="font-medium">{project.timeline}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">
                                Complexity
                              </p>
                              <p className="font-medium">
                                {project.projectComplexity}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Status</p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "mt-1",
                                  project.status === "active"
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                )}
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Technologies
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.technology.map((tech, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-purple-500/10 text-purple-400 border-purple-500/20"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
