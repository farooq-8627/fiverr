import React, { useState } from "react";
import { GlassCard } from "../../../UI/GlassCard";
import { Button } from "../../../UI/button";
import {
  Pencil,
  Clock,
  Calendar,
  Globe,
  Clock4,
  MessageCircle,
} from "lucide-react";
import { AvailabilityEditModal } from "../../Edit/AgentProfile/AvailabilityEditModal";
import {
  AVAILABILITY_STATUSES,
  WORKING_HOURS_PREFERENCES,
  RESPONSE_TIME_COMMITMENTS,
  MEETING_AVAILABILITIES,
} from "@/sanity/schemaTypes/constants";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

interface DetailItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const DetailItem = ({ icon, title, value, description }: DetailItemProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-200 group">
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-violet-200/80">{title}</h3>
          <div className="h-3 w-[1px] bg-violet-400/20" />
          <div className="text-sm font-medium text-violet-50 flex-1 min-w-0 text-end">
            {value}
          </div>
        </div>
        <p className="text-xs text-violet-200/50 line-clamp-1">{description}</p>
      </div>
    </div>
  );
};

interface AvailabilityData {
  currentStatus: string;
  workingHours: string;
  timeZone: string;
  responseTime: string;
  availabilityHours: string;
}

interface AvailabilityCardProps {
  availability: AvailabilityData;
  isCurrentUser: boolean;
  profileId: string;
}

export function AvailabilityCard({
  availability: initialAvailability,
  isCurrentUser,
  profileId,
}: AvailabilityCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [availability, setAvailability] = useState(initialAvailability);

  const getStatusTitle = (value: string) =>
    AVAILABILITY_STATUSES.find((status) => status.value === value)?.title ||
    value;

  const getWorkingHoursTitle = (value: string) =>
    WORKING_HOURS_PREFERENCES.find((hours) => hours.value === value)?.title ||
    value;

  const getResponseTimeTitle = (value: string) =>
    RESPONSE_TIME_COMMITMENTS.find((time) => time.value === value)?.title ||
    value;

  const getAvailabilityHoursTitle = (value: string) =>
    MEETING_AVAILABILITIES.find((hours) => hours.value === value)?.title ||
    value;

  const handleSave = (data: AvailabilityData) => {
    setAvailability(data);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <GlassCard>
        <div className="md:px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Availability</h2>
            {isCurrentUser && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <Pencil className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DetailItem
              icon={<Clock className="w-4 h-4 text-violet-400" />}
              title="Current Status"
              value={getStatusTitle(availability.currentStatus)}
              description="Current availability for new projects"
            />
            <DetailItem
              icon={<Calendar className="w-4 h-4 text-violet-400" />}
              title="Working Hours"
              value={getWorkingHoursTitle(availability.workingHours)}
              description="Work schedule and commitment"
            />
            <DetailItem
              icon={<Clock4 className="w-4 h-4 text-violet-400" />}
              title="Meeting Availability"
              value={getAvailabilityHoursTitle(availability.availabilityHours)}
              description="Preferred meeting times"
            />
            <DetailItem
              icon={<Globe className="w-4 h-4 text-violet-400" />}
              title="Time Zone"
              value={availability.timeZone}
              description="Local time zone"
            />
          </div>

          {/* Response Time as a full-width item */}
          <div className="mt-3">
            <DetailItem
              icon={<MessageCircle className="w-4 h-4 text-violet-400" />}
              title="Response Time"
              value={getResponseTimeTitle(availability.responseTime)}
              description="Expected response time for messages"
            />
          </div>
        </div>
      </GlassCard>

      <AvailabilityEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={availability}
        onSave={handleSave}
        profileId={profileId}
      />
    </>
  );
}
