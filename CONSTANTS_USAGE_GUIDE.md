# Constants Usage Guide

This guide explains how to use the centralized constants system in our application.

## Overview

All dropdown options, select lists, and other constant data are centralized in `sanity/schemaTypes/constants.ts`. This ensures consistency across the application and makes it easy to update options in one place.

## Available Constants

The constants file includes various categories of options:

- Industry domains (`INDUSTRY_DOMAINS`)
- Company sizes (`COMPANY_SIZES`)
- Team sizes (`TEAM_SIZES`)
- Project statuses (`PROJECT_STATUSES`)
- Budget ranges (`BUDGET_RANGES`)
- Timeline options (`TIMELINE_OPTIONS`)
- Experience levels (`EXPERIENCE_LEVELS`)
- Pricing models (`PRICING_MODELS`)
- Availability statuses (`AVAILABILITY_STATUSES`)
- And many more

## How to Use Constants

### In Sanity Schemas

```typescript
import { INDUSTRY_DOMAINS } from "@/sanity/schemaTypes/constants";

defineField({
  name: "industryDomain",
  title: "Industry/Domain",
  type: "array",
  of: [{ type: "string" }],
  options: {
    list: INDUSTRY_DOMAINS,
  },
});
```

### In React Components

For components that expect a different format, use the utility functions:

```typescript
import { INDUSTRY_DOMAINS } from "@/sanity/schemaTypes/constants";
import { convertToSelectFormat } from "@/lib/constants-utils";

// Convert to format needed by Select component
const industryOptions = convertToSelectFormat(INDUSTRY_DOMAINS);

// Use in component
<Select options={industryOptions} />
```

## Utility Functions

We provide several utility functions in `lib/constants-utils.ts` to help work with constants:

### Format Conversion

```typescript
// Convert from { title, value } to { id, label } format
const options = convertToOnboardingFormat(INDUSTRY_DOMAINS);

// Convert from { title, value } to { value, label } format
const options = convertToSelectFormat(INDUSTRY_DOMAINS);
```

### Lookup and Validation

```typescript
// Get display title for a value
const title = getTitleByValue(INDUSTRY_DOMAINS, "finance");

// Check if a value is valid
const isValid = isValidValue(INDUSTRY_DOMAINS, "finance");
```

### Filtering and Grouping

```typescript
// Filter constants by search term
const filteredOptions = filterConstantsBySearch(INDUSTRY_DOMAINS, "tech");

// Group constants by a property
const groupedOptions = groupConstantsByProperty(INDUSTRY_DOMAINS, "category");
```

## Adding New Constants

When adding new constants:

1. Add them to `sanity/schemaTypes/constants.ts`
2. Use the standard format: `{ title: "Display Name", value: "value_key" }`
3. Export the constant with an ALL_CAPS name
4. Add a comment describing what the constant is used for

## Migrating Existing Code

When migrating from hardcoded values:

1. Add the constants to the central file
2. Import the constants in your component
3. Use utility functions if format conversion is needed
4. Replace hardcoded arrays with the imported constants

## Best Practices

- Always use centralized constants for dropdown options
- Keep constant values (not titles) in your database
- Use utility functions to convert between formats as needed
- When displaying values to users, always convert back to titles
