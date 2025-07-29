"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/UI/button";
import { FilterModal } from "@/components/UI/FilterModal";
import { FilterState } from "@/types/filters";
import { useFilters } from "@/hooks/useFilters";

interface ProfilesPageLayoutProps {
  title: string;
  subtitle: string;
  data: any[];
  loading: boolean;
  error: Error | null;
  entityType: "agent" | "client" | "company";
  renderCard: (item: any) => React.ReactNode;
  emptyStateMessage?: string;
  onFiltersChange?: (filters: FilterState, search: string) => void;
}

export function ProfilesPageLayout({
  title,
  subtitle,
  data,
  loading,
  error,
  entityType,
  renderCard,
  emptyStateMessage = "No profiles found",
  onFiltersChange,
}: ProfilesPageLayoutProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Local input state
  const { filters, updateFilters, availableFilters, resetFilters } =
    useFilters(entityType);

  const handleApplyFilters = (newFilters: FilterState) => {
    updateFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters, searchQuery);
    }
  };

  const handleResetFilters = () => {
    resetFilters();
    setSearchQuery("");
    setSearchInput(""); // Also reset input
    if (onFiltersChange) {
      onFiltersChange({}, "");
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    if (onFiltersChange) {
      onFiltersChange(filters, searchInput);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Count active filters
  const activeFiltersCount = Object.keys(filters).length;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-red-400">
              Error loading profiles: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm"
            />
            <Button
              variant="ghost"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-violet-500 hover:bg-violet-500/10"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-violet-500 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-400 text-sm">
            Showing {data?.length || 0} {title.toLowerCase()}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {data?.map((item, index) => (
            <motion.div
              key={item.userProfile?._id || item._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              {renderCard(item)}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {data?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {emptyStateMessage}
            </h3>
            <p className="text-gray-400">
              {searchQuery || activeFiltersCount > 0
                ? `No results found for your search or filters. Try adjusting your criteria.`
                : "Check back later for new profiles."}
            </p>
          </motion.div>
        )}

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          entityType={entityType}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
