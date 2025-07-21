"use client";

import { useEffect } from "react";
import { AgentCard } from "@/components/cards/AgentCard";
import { useAgentProfiles, AgentWithProfile } from "@/hooks/useAgentProfiles";

export default function AgentsPage() {
  const { data: agents, loading, error } = useAgentProfiles();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Loading Agents...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Error loading agents
          </h1>
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Automation Agents
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents?.map((agent: AgentWithProfile) => (
            <AgentCard
              key={agent.userProfile._id}
              userProfile={agent.userProfile}
              agentProfile={agent.agentProfile}
            />
          ))}
        </div>

        {agents?.length === 0 && (
          <p className="text-gray-400 text-center py-12">No agents found</p>
        )}
      </div>
    </div>
  );
}
