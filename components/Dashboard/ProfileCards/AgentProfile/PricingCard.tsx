import React, { useState } from "react";
import { GlassCard } from "../../../UI/GlassCard";
import { Button } from "../../../UI/button";
import { DollarSign, Clock, Calendar, Pencil } from "lucide-react";
import { PricingEditModal } from "../../Edit/AgentProfile/PricingEditModal";
import { cn } from "@/lib/utils";
import {
  PAYMENT_METHODS,
  HOURLY_RATE_RANGES,
  MINIMUM_PROJECT_BUDGETS,
} from "@/sanity/schemaTypes/constants";

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
          <p className="text-sm font-medium text-violet-50 flex-1 min-w-0 text-end">
            {value}
          </p>
        </div>
        <p className="text-xs text-violet-200/50 line-clamp-1">{description}</p>
      </div>
    </div>
  );
};

interface PricingCardProps {
  pricing: {
    hourlyRateRange: string;
    minimumProjectBudget: string;
    preferredPaymentMethods: string[];
  };
  isCurrentUser: boolean;
  profileId: string;
}

export function PricingCard({
  pricing,
  isCurrentUser,
  profileId,
}: PricingCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getHourlyRateTitle = (value: string) =>
    HOURLY_RATE_RANGES.find((rate) => rate.value === value)?.title || value;

  const getMinimumBudgetTitle = (value: string) =>
    MINIMUM_PROJECT_BUDGETS.find((budget) => budget.value === value)?.title ||
    value;

  const getPaymentMethodsTitle = (values: string[]) => {
    return values
      .map(
        (value) =>
          PAYMENT_METHODS.find((method) => method.value === value)?.title
      )
      .filter(Boolean)
      .join(", ");
  };

  return (
    <>
      <GlassCard>
        <div className="md:px-6 py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pricing & Rates</h2>
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
              icon={<DollarSign className="w-4 h-4 text-violet-400" />}
              title="Hourly Rate"
              value={getHourlyRateTitle(pricing.hourlyRateRange)}
              description="Base rate charged per hour of work"
            />
            <DetailItem
              icon={<Clock className="w-4 h-4 text-violet-400" />}
              title="Minimum Budget"
              value={getMinimumBudgetTitle(pricing.minimumProjectBudget)}
              description="Minimum project budget requirement"
            />
          </div>

          {/* Full width item */}
          <div className="mt-3">
            <DetailItem
              icon={<Calendar className="w-4 h-4 text-violet-400" />}
              title="Payment Methods"
              value={getPaymentMethodsTitle(pricing.preferredPaymentMethods)}
              description="Accepted payment methods"
            />
          </div>
        </div>
      </GlassCard>

      <PricingEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={pricing}
        onSave={(data) => {
          // Handle the save
          setIsEditModalOpen(false);
        }}
        profileId={profileId}
      />
    </>
  );
}
