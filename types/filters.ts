export type SortOrder = "asc" | "desc";

export type FilterType =
  | "select"
  | "multiSelect"
  | "range"
  | "toggle"
  | "search";

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  field: string;
}

export interface FilterState {
  [key: string]: any;
}

export interface SortConfig {
  field: string;
  order: SortOrder;
}

// Profile specific filters
export interface ProfileFilters extends FilterState {
  availability?: boolean;
  industry?: string[];
  experience?: number;
  rating?: number;
  pricing?: [number, number];
}

// Project specific filters
export interface ProjectFilters extends FilterState {
  priority?: "low" | "medium" | "high";
  status?: string;
  budget?: [number, number];
  industry?: string[];
  duration?: [number, number];
}

// Company specific filters
export interface CompanyFilters extends FilterState {
  industry?: string[];
  size?: string;
  location?: string;
  type?: string;
}

export type EntityType = "agent" | "client" | "project" | "company" | "feed";

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: EntityType;
  onApplyFilters: (filters: FilterState) => void;
  currentFilters?: FilterState;
  onResetFilters?: () => void;
}
