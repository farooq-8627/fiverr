import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Switch } from "./switch";
import { Slider } from "./slider";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Badge } from "./badge";
import { FilterModalProps, FilterState, FilterConfig } from "@/types/filters";
import { filterConfigs } from "@/lib/filterConfigs";
import { X, SlidersHorizontal, Search } from "lucide-react";
import { GlassModal } from "./GlassModal";

export function FilterModal({
  isOpen,
  onClose,
  entityType,
  onApplyFilters,
  currentFilters = {},
  onResetFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const availableFilters = filterConfigs[entityType];

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [id]: value,
      };

      // Remove empty arrays and null/undefined values
      if (Array.isArray(value) && value.length === 0) {
        delete newFilters[id];
      } else if (value === null || value === undefined || value === "") {
        delete newFilters[id];
      }

      return newFilters;
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      setFilters({});
      onApplyFilters({});
    }
    onClose();
  };

  const renderFilterControl = (filter: FilterConfig) => {
    const value = filters[filter.id];

    switch (filter.type) {
      case "toggle":
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) =>
              handleFilterChange(filter.id, checked)
            }
          />
        );

      case "select":
        return (
          <div className="space-y-2">
            <Select
              value={value || ""}
              onValueChange={(val) => handleFilterChange(filter.id, val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem
                    key={option.value.toString()}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {value && (
              <Button
                variant="ghost"
                onClick={() => handleFilterChange(filter.id, "")}
                className="w-full text-xs text-gray-400 hover:text-white py-1"
              >
                Clear Selection
              </Button>
            )}
          </div>
        );

      case "multiSelect":
        const selectedValues = (value || []) as string[];
        return (
          <div className="space-y-2">
            <Select
              value=""
              onValueChange={(val) => {
                if (!selectedValues.includes(val)) {
                  handleFilterChange(filter.id, [...selectedValues, val]);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {filter.options
                  ?.filter(
                    (option) =>
                      !selectedValues.includes(option.value.toString())
                  )
                  .map((option) => (
                    <SelectItem
                      key={option.value.toString()}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedValues.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {selectedValues.map((val) => {
                    const option = filter.options?.find(
                      (opt) => opt.value.toString() === val
                    );
                    return (
                      <Badge
                        key={val}
                        variant="secondary"
                        className="flex items-center gap-1 bg-violet-500/20 text-violet-200 hover:bg-violet-500/30 pr-1"
                      >
                        <span>{option?.label || val}</span>
                        <button
                          type="button"
                          className="ml-1 p-0.5 rounded-full hover:bg-violet-500/50 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newValues = selectedValues.filter(
                              (v) => v !== val
                            );
                            handleFilterChange(filter.id, newValues);
                          }}
                        >
                          <X className="h-3 w-3 text-violet-300 hover:text-white" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleFilterChange(filter.id, [])}
                  className="w-full text-xs text-gray-400 hover:text-white py-1"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        );

      case "range":
        const [min, max] = value || [0, 200];
        return (
          <div className="space-y-4">
            <Slider
              value={[min, max]}
              min={0}
              max={200}
              step={5}
              onValueChange={(val) => handleFilterChange(filter.id, val)}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <Input
                type="number"
                value={min}
                onChange={(e) =>
                  handleFilterChange(filter.id, [
                    parseInt(e.target.value) || 0,
                    max,
                  ])
                }
                className="w-20"
                min={0}
                max={200}
              />
              <span className="text-sm text-gray-500">to</span>
              <Input
                type="number"
                value={max}
                onChange={(e) =>
                  handleFilterChange(filter.id, [
                    min,
                    parseInt(e.target.value) || 200,
                  ])
                }
                className="w-20"
                min={0}
                max={200}
              />
            </div>
          </div>
        );

      case "search":
        return (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                value={value || ""}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="pl-8"
                placeholder={`Search ${filter.label.toLowerCase()}...`}
              />
            </div>
            {value && (
              <Button
                variant="ghost"
                onClick={() => handleFilterChange(filter.id, "")}
                className="w-full text-xs text-gray-400 hover:text-white py-1"
              >
                Clear Search
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-[80vh] max-h-[600px]">
        {/* Fixed Header */}
        <div className="flex items-center gap-2 mb-6 flex-shrink-0">
          <SlidersHorizontal className="h-5 w-5 text-violet-400" />
          <h2 className="text-xl font-semibold text-violet-50">Filters</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 mb-6">
          <div className="grid gap-6">
            {availableFilters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="text-sm font-medium text-violet-200">
                  {filter.label}
                </label>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  {renderFilterControl(filter)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="flex justify-between space-x-4 pt-4 border-t border-violet-800/30 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            Apply
          </Button>
        </div>
      </div>
    </GlassModal>
  );
}
