import { useState, useCallback, useMemo } from "react";
import { FilterState, EntityType, SortConfig } from "@/types/filters";
import { filterConfigs } from "@/lib/filterConfigs";

export function useFilters(entityType: EntityType) {
  const [filters, setFilters] = useState<FilterState>({});
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [search, setSearch] = useState("");

  const availableFilters = useMemo(
    () => filterConfigs[entityType],
    [entityType]
  );

  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setSort(null);
    setSearch("");
  }, []);

  const updateSort = useCallback((newSort: SortConfig | null) => {
    setSort(newSort);
  }, []);

  const updateSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
  }, []);

  // Build GROQ query based on filters
  const buildQuery = useCallback(() => {
    let baseQuery = `*[_type == "${entityType}"`;
    const filterConditions: string[] = [];

    // Add search condition if present
    if (search) {
      filterConditions.push(
        `(name match "*${search}*" || description match "*${search}*")`
      );
    }

    // Add filter conditions
    Object.entries(filters).forEach(([key, value]) => {
      const filterConfig = availableFilters.find((f) => f.id === key);
      if (!filterConfig) return;

      switch (filterConfig.type) {
        case "toggle":
          filterConditions.push(`${filterConfig.field} == ${value}`);
          break;
        case "select":
          if (value) {
            filterConditions.push(`${filterConfig.field} == "${value}"`);
          }
          break;
        case "multiSelect":
          if (Array.isArray(value) && value.length > 0) {
            filterConditions.push(
              `${filterConfig.field} in [${value.map((v) => `"${v}"`).join(",")}]`
            );
          }
          break;
        case "range":
          if (Array.isArray(value)) {
            const [min, max] = value;
            if (min !== undefined) {
              filterConditions.push(`${filterConfig.field} >= ${min}`);
            }
            if (max !== undefined) {
              filterConditions.push(`${filterConfig.field} <= ${max}`);
            }
          }
          break;
        case "search":
          if (value) {
            filterConditions.push(`${filterConfig.field} match "*${value}*"`);
          }
          break;
      }
    });

    // Add filter conditions to base query
    if (filterConditions.length > 0) {
      baseQuery += ` && ${filterConditions.join(" && ")}`;
    }

    // Close the initial filter bracket
    baseQuery += "]";

    // Add sorting
    if (sort) {
      baseQuery += ` | order(${sort.field} ${sort.order})`;
    }

    return baseQuery;
  }, [entityType, filters, sort, search, availableFilters]);

  return {
    filters,
    sort,
    search,
    availableFilters,
    updateFilters,
    updateSort,
    updateSearch,
    resetFilters,
    buildQuery,
  };
}
