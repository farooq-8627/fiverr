import React from "react";
import { Checkbox } from "@/components/UI/checkbox";
import { Label } from "@/components/UI/label";
import { INDUSTRY_DOMAINS } from "@/sanity/schemaTypes/constants";

interface IndustryFilterProps {
  selectedIndustries: string[];
  onChange: (industries: string[]) => void;
  className?: string;
}

/**
 * Industry filter component that uses the centralized industry list
 * This component will automatically update when the central industry list changes
 */
export function IndustryFilter({
  selectedIndustries,
  onChange,
  className = "",
}: IndustryFilterProps) {
  const handleIndustryChange = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      onChange(selectedIndustries.filter((i) => i !== industry));
    } else {
      onChange([...selectedIndustries, industry]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-medium text-sm mb-3">Filter by Industry</h3>
      <div className="space-y-2">
        {INDUSTRY_DOMAINS.map((industry) => (
          <div key={industry.value} className="flex items-center space-x-2">
            <Checkbox
              id={`industry-${industry.value}`}
              checked={selectedIndustries.includes(industry.value)}
              onCheckedChange={() => handleIndustryChange(industry.value)}
            />
            <Label
              htmlFor={`industry-${industry.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {industry.title}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
