import React from "react";
import { Badge } from "@/components/UI/badge";
import { ClientProject } from "@/types";
import {
  Calendar,
  Clock,
  Building2,
  AlertTriangle,
  Target,
  Users,
  Star,
  Flag,
  CircleDollarSign,
  Briefcase,
} from "lucide-react";

interface ClientProjectCardModalProps {
  project: ClientProject;
  className?: string;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-200";
    case "inProgress":
      return "bg-yellow-500/10 text-yellow-200";
    case "planning":
      return "bg-blue-500/10 text-blue-200";
    case "onHold":
      return "bg-orange-500/10 text-orange-200";
    case "cancelled":
      return "bg-red-500/10 text-red-200";
    default:
      return "bg-violet-500/10 text-violet-200";
  }
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-500/10">
      {React.cloneElement(icon, { className: "w-4 h-4 text-violet-400" })}
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-violet-200">{label}:</span>
      <span className="text-sm font-medium text-violet-50">{value}</span>
    </div>
  </div>
);

const getTitleFromValue = (value: string | undefined): string => {
  if (!value) return "Not specified";
  // Convert snake_case or camelCase to Title Case
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function ClientProjectCardModal({
  project,
  className,
}: ClientProjectCardModalProps) {
  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-violet-50">
            {project.title}
          </h2>
          <Badge variant="outline" className={getStatusStyles(project.status)}>
            {getTitleFromValue(project.status)}
          </Badge>
        </div>
        <p className="text-violet-200">{project.description}</p>
      </div>

      {/* Pain Points Section */}
      {project.painPoints && (
        <div className="p-3 rounded-lg bg-white/5">
          <h3 className="text-sm font-medium text-violet-200 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-violet-400" />
            Pain Points
          </h3>
          <p className="text-sm text-violet-100">{project.painPoints}</p>
        </div>
      )}

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <DetailItem
          icon={<Building2 />}
          label="Domain"
          value={getTitleFromValue(project.businessDomain)}
        />
        <DetailItem
          icon={<CircleDollarSign />}
          label="Budget"
          value={getTitleFromValue(project.budgetRange)}
        />
        <DetailItem
          icon={<Clock />}
          label="Timeline"
          value={getTitleFromValue(project.timeline)}
        />
        <DetailItem
          icon={<AlertTriangle />}
          label="Complexity"
          value={getTitleFromValue(project.complexity)}
        />
        <DetailItem
          icon={<Briefcase />}
          label="Engagement"
          value={getTitleFromValue(project.engagementType)}
        />
        <DetailItem
          icon={<Users />}
          label="Team Size"
          value={getTitleFromValue(project.teamSize)}
        />
        <DetailItem
          icon={<Star />}
          label="Experience"
          value={getTitleFromValue(project.experienceLevel)}
        />
        <DetailItem
          icon={<Flag />}
          label="Priority"
          value={getTitleFromValue(project.priority)}
        />
        <DetailItem
          icon={<Calendar />}
          label="Start Date"
          value={project.startDate || "Not specified"}
        />
        <DetailItem
          icon={<Target />}
          label="Status"
          value={getTitleFromValue(project.status)}
        />
      </div>

      {/* Assigned Agents */}
      {project.assignedAgents && project.assignedAgents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-violet-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            Assigned Agents
          </h3>
          <div className="flex flex-wrap gap-1">
            {project.assignedAgents.map((agent: any, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-violet-500/10 text-violet-200 text-xs"
              >
                {agent._ref || agent}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
