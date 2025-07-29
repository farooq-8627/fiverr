import React, { useState } from "react";
import { useFilters } from "@/hooks/useFilters";
import { FilterModal } from "@/components/UI/FilterModal";
import { Button } from "@/components/UI/button";
import { SlidersHorizontal } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { FilterState } from "@/types/filters";

interface FilteredFeedProps {
  initialData?: any[];
}

export function FilteredFeed({ initialData = [] }: FilteredFeedProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { filters, updateFilters, buildQuery } = useFilters("feed");

  // Use the buildQuery function to get filtered data
  const query = buildQuery();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Fetch data when filters change
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await client.fetch(query);
        setData(result);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [query]);

  const handleApplyFilters = (newFilters: FilterState) => {
    updateFilters(newFilters);
  };

  return (
    <div>
      {/* Filter Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filtered Content */}
      <div className="grid gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          data?.map((item: any) => (
            <div key={item._id}>
              {/* Render your feed items here */}
              {item.title}
            </div>
          ))
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        entityType="feed"
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
}
