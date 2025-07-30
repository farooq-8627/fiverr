# Industry/Domain List Guide

This document explains how to work with the centralized industry/domain list in the application.

## Overview

We maintain a single source of truth for all industry/domain options in:

```
sanity/schemaTypes/constants.ts
```

This ensures consistency across:

- Sanity Studio schemas
- Frontend filters
- Search functionality
- Display components

## How to Update Industries

When you need to add, remove, or modify industries:

1. Edit the `INDUSTRY_DOMAINS` array in `sanity/schemaTypes/constants.ts`
2. Restart your development server
3. The changes will automatically propagate to all parts of the application

```typescript
// Example of adding a new industry
export const INDUSTRY_DOMAINS = [
  // ... existing industries
  { title: "New Industry Name", value: "newIndustryValue" },
];
```

## Where Industries Are Used

The centralized industry list is used in:

### Backend (Sanity Studio)

- Client profile industry selection
- Agent company industry focus
- Client company industry field
- Project business domain field

### Frontend

- Industry filter components
- Search filters
- Profile displays
- Project cards

## Utility Functions

We provide utility functions in `lib/industry.ts` to work with industries:

```typescript
// Get display name for an industry value
getIndustryTitle("ecommerce"); // Returns "E-commerce"

// Format an array of industry values for display
formatIndustries(["ecommerce", "finance"]); // Returns "E-commerce, Finance"

// Get all industry values as an array
getAllIndustryValues();

// Check if a value is a valid industry
isValidIndustry("ecommerce"); // Returns true
```

## Components

Use the `IndustryFilter` component for consistent industry filtering:

```tsx
import { IndustryFilter } from "@/components/UI/IndustryFilter";

// In your component
const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

// Then in JSX
<IndustryFilter
  selectedIndustries={selectedIndustries}
  onChange={setSelectedIndustries}
/>;
```

## Migration Notes

If you've previously stored industry data as strings rather than arrays, you may need to handle migration. The schema includes validation helpers that prompt users to reset and reselect values.
