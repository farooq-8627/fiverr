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
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const availableFilters = filterConfigs[entityType];

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
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
            <div className="flex flex-wrap gap-1">
              {selectedValues.map((val) => {
                const option = filter.options?.find(
                  (opt) => opt.value.toString() === val
                );
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {option?.label || val}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleFilterChange(
                          filter.id,
                          selectedValues.filter((v) => v !== val)
                        )
                      }
                    />
                  </Badge>
                );
              })}
            </div>
          </div>
        );

      case "range":
        const [min, max] = value || [0, 100];
        return (
          <div className="space-y-4">
            <Slider
              value={[min, max]}
              min={0}
              max={100}
              step={1}
              onValueChange={(val) => handleFilterChange(filter.id, val)}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <Input
                type="number"
                value={min}
                onChange={(e) =>
                  handleFilterChange(filter.id, [parseInt(e.target.value), max])
                }
                className="w-20"
              />
              <span className="text-sm text-gray-500">to</span>
              <Input
                type="number"
                value={max}
                onChange={(e) =>
                  handleFilterChange(filter.id, [min, parseInt(e.target.value)])
                }
                className="w-20"
              />
            </div>
          </div>
        );

      case "search":
        return (
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
        );

      default:
        return null;
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="h-5 w-5 text-violet-400" />
        <h2 className="text-xl font-semibold text-violet-50">Filters</h2>
      </div>

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

      <div className="flex justify-between pt-4 mt-6 border-t border-white/10">
        <Button
          variant="outline"
          onClick={handleReset}
          className="bg-white/5 hover:bg-white/10 text-violet-200"
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          className="bg-violet-500 hover:bg-violet-600 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </GlassModal>
  );
}
