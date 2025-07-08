import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert from centralized format to select component format
 * Centralized: { title: string, value: string }
 * Select: { value: string, label: string }
 */
export const convertToSelectFormat = (
  options: Array<{ title: string; value: string }>
) => {
  return options.map((option) => ({
    value: option.value,
    label: option.title,
  }));
};
