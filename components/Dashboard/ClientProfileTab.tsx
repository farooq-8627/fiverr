import React from "react";
import { ClientProfile } from "@/types/index";
import { Badge } from "@/components/UI/badge";
import { GlassCard } from "@/components/UI/GlassCard";
import { cn } from "@/lib/utils";

interface ClientProfileTabProps {
  profiles: ClientProfile[];
}

export function ClientProfileTab({ profiles }: ClientProfileTabProps) {
  if (!profiles?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No client profiles found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {profiles.map((profile) => (
        <div key={profile._id} className="space-y-6">
          {/* Automation Needs */}
          <GlassCard>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Automation Needs</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-2">Pain Points</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.automationNeeds.automationRequirements.map(
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
                  <h3 className="text-md font-medium mb-2">Current Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.automationNeeds.currentTools.map((tool, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-green-500/10 text-green-400 border-green-500/20"
                      >
                        {tool}
                      </Badge>
                    ))}
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
                    {profile.communicationPreferences?.languagesSpoken?.map(
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
                    {profile.communicationPreferences?.timeZone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Update Frequency</p>
                  <p className="font-medium">
                    {profile.communicationPreferences?.updateFrequency}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Meeting Availability</p>
                  <p className="font-medium">
                    {profile.communicationPreferences?.meetingAvailability}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <GlassCard>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Projects</h2>
                <div className="grid grid-cols-1 gap-6">
                  {profile.projects?.map((project) => (
                    <div
                      key={project._id}
                      className="space-y-4 border border-white/10 rounded-lg p-4"
                    >
                      <div>
                        <h3 className="font-medium text-lg">{project.title}</h3>
                        <p className="text-gray-400">{project.description}</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Budget Range</p>
                          <p className="font-medium">{project.budgetRange}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Timeline</p>
                          <p className="font-medium">{project.timeline}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Complexity</p>
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
                        <p className="text-gray-400 text-sm">Technologies</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technology?.map((tech, index) => (
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
    </div>
  );
}
