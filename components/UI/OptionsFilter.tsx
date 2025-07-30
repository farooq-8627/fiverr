import React from "react";
import { Checkbox } from "@/components/UI/checkbox";
import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";

interface Option {
  title: string;
  value: string;
}

interface OptionsFilterProps {
  title: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
  multiSelect?: boolean;
  description?: string;
}

/**
 * Generic options filter component that can be used with any constant list
 * This component supports both single-select (radio) and multi-select (checkbox) modes
 */
export function OptionsFilter({
  title,
  options,
  selectedValues,
  onChange,
  className = "",
  multiSelect = true,
  description,
}: OptionsFilterProps) {
  const handleOptionChange = (optionValue: string) => {
    if (multiSelect) {
      // For multi-select (checkboxes)
      if (selectedValues.includes(optionValue)) {
        onChange(selectedValues.filter((value) => value !== optionValue));
      } else {
        onChange([...selectedValues, optionValue]);
      }
    } else {
      // For single-select (radio buttons)
      onChange([optionValue]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-medium text-sm mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}

      {multiSelect ? (
        // Multi-select with checkboxes
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`option-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={() => handleOptionChange(option.value)}
              />
              <Label
                htmlFor={`option-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.title}
              </Label>
            </div>
          ))}
        </div>
      ) : (
        // Single-select with radio buttons
        <RadioGroup
          value={selectedValues[0] || ""}
          onValueChange={(value: string) => handleOptionChange(value)}
          className="space-y-2"
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`option-${option.value}`}
              />
              <Label
                htmlFor={`option-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
