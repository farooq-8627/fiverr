import React from "react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  className,
}: MultiSelectProps) {
  const toggleOption = (id: string) => {
    const newValues = selectedValues.includes(id)
      ? selectedValues.filter((v) => v !== id)
      : [...selectedValues, id];
    onChange(newValues);
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => toggleOption(option.id)}
          data-value={option.id}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm transition-all duration-200",
            "border bg-background/50",
            selectedValues.includes(option.id)
              ? "bg-purple-600/90 border-purple-500 text-white shadow-sm selected-item"
              : "border-white/20 text-white/70 hover:border-white/20 hover:bg-white/5"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
