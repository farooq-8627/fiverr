import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassCard } from "../../UI/GlassCard";
import { Button } from "../../UI/button";
import { Clock, Calendar, Globe, MessageCircle, Clock4 } from "lucide-react";
import { AvailabilityEditModal } from "../Edit/AvailabilityEditModal";
import {
  AVAILABILITY_STATUSES,
  WORKING_HOURS_PREFERENCES,
  RESPONSE_TIME_COMMITMENTS,
  MEETING_AVAILABILITIES,
} from "@/sanity/schemaTypes/constants";

interface AvailabilityCardProps {
  availability: {
    currentStatus: string;
    workingHours: string;
    timeZone: string;
    responseTime: string;
    availabilityHours: string;
  };
  isCurrentUser: boolean;
  profileId: string;
}

interface DetailItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

function DetailItem({ icon, title, value }: DetailItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center space-x-3 text-sm"
    >
      <div className="text-emerald-400">{icon}</div>
      <div>
        <p className="text-muted-foreground">{title}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

export function AvailabilityCard({
  availability,
  isCurrentUser,
  profileId,
}: AvailabilityCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  return (
    <>
      <GlassCard className="relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Availability</h3>
          {isCurrentUser && (
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant="outline"
              className="bg-white/5 hover:bg-white/10"
            >
              Edit
            </Button>
          )}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <DetailItem
            icon={<Clock className="w-4 h-4" />}
            title="Current Status"
            value={getStatusTitle(availability.currentStatus)}
          />
          <DetailItem
            icon={<Calendar className="w-4 h-4" />}
            title="Working Hours"
            value={getWorkingHoursTitle(availability.workingHours)}
          />
          <DetailItem
            icon={<Clock4 className="w-4 h-4" />}
            title="Availability Hours"
            value={getAvailabilityHoursTitle(availability.availabilityHours)}
          />
          <DetailItem
            icon={<Globe className="w-4 h-4" />}
            title="Time Zone"
            value={availability.timeZone}
          />
          <DetailItem
            icon={<MessageCircle className="w-4 h-4" />}
            title="Response Time"
            value={getResponseTimeTitle(availability.responseTime)}
          />
        </motion.div>
      </GlassCard>

      <AvailabilityEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={availability}
        onSave={(data) => {
          // Handle the save
          setIsEditModalOpen(false);
        }}
        profileId={profileId}
      />
    </>
  );
}
