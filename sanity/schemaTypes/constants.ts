/**
 * CENTRALIZED CONSTANTS
 *
 * This file contains shared constants used throughout the application.
 * When updating these values, they will be reflected across both backend and frontend.
 *
 * IMPORTANT: After changing any constants here, you may need to:
 * 1. Restart your development server
 * 2. Rebuild your frontend application
 * 3. Update any hardcoded references in components
 */

// Industry/Domain options used for profiles, projects, and filtering
export const INDUSTRY_DOMAINS = [
  { title: "E-commerce", value: "ecommerce" },
  { title: "Healthcare", value: "healthcare" },
  { title: "Finance", value: "finance" },
  { title: "Education", value: "education" },
  { title: "Real Estate", value: "realEstate" },
  { title: "Manufacturing", value: "manufacturing" },
  { title: "Technology", value: "technology" },
  { title: "Marketing & Sales", value: "marketingSales" },
  { title: "Human Resources", value: "hr" },
  { title: "Customer Service", value: "customerService" },
  { title: "Logistics & Supply Chain", value: "logistics" },
  { title: "Legal", value: "legal" },
  { title: "Creative & Design", value: "creative" },
  { title: "Other", value: "other" },
];

// Company Size options
export const COMPANY_SIZES = [
  { title: "Solo (1 member)", value: "solo" },
  { title: "Small Team (2-5)", value: "smallTeam" },
  { title: "Medium Team (5-10)", value: "mediumTeam" },
  { title: "Large Team (10-50)", value: "largeTeam" },
  { title: "Enterprise (50+)", value: "enterprise" },
];

// Team Size options (simplified version for projects)
export const TEAM_SIZES = [
  { title: "Solo (1 member)", value: "solo" },
  { title: "Small Team (2-5)", value: "small" },
  { title: "Medium Team (5-10)", value: "medium" },
  { title: "Large Team (10-50)", value: "large" },
  { title: "Enterprise (50+)", value: "enterprise" },
];

// Project Status options
export const PROJECT_STATUSES = [
  { title: "Draft", value: "draft" },
  { title: "Open for Proposals", value: "openProposals" },
  { title: "In Progress", value: "inProgress" },
  { title: "Completed", value: "completed" },
  { title: "On Hold", value: "onHold" },
  { title: "Cancelled", value: "cancelled" },
];

// Agent Project Status options
export const AGENT_PROJECT_STATUSES = [
  { title: "Planning", value: "planning" },
  { title: "In Progress", value: "inProgress" },
  { title: "Completed", value: "completed" },
  { title: "On Hold", value: "onHold" },
  { title: "Cancelled", value: "cancelled" },
];

// Budget Range options
export const BUDGET_RANGES = [
  { title: "$0-500", value: "micro" },
  { title: "$500 - $2,000", value: "small" },
  { title: "$2,000 - $5,000", value: "medium" },
  { title: "$5,000 - $10,000", value: "large" },
  { title: "$10,000+", value: "enterprise" },
];

// Project Size Preferences (for agent profiles)
export const PROJECT_SIZE_PREFERENCES = [
  { title: "$0-500", value: "0-500" },
  { title: "$500-1,000", value: "500-1000" },
  { title: "$1,000-5,000", value: "1000-5000" },
  { title: "$5,000-10,000", value: "5000-10000" },
  { title: "$10,000+", value: "10000plus" },
];

// Hourly Rate Range options
export const HOURLY_RATE_RANGES = [
  { title: "Under $25", value: "under25" },
  { title: "$25-$50", value: "25to50" },
  { title: "$50-$100", value: "50to100" },
  { title: "$100-$150", value: "100to150" },
  { title: "$150+", value: "150plus" },
];

// Minimum Project Budget options
export const MINIMUM_PROJECT_BUDGETS = [
  { title: "Under $500", value: "under500" },
  { title: "$500-$1,000", value: "500to1000" },
  { title: "$1,000-$5,000", value: "1000to5000" },
  { title: "$5,000-$10,000", value: "5000to10000" },
  { title: "$10,000+", value: "10000plus" },
];

// Timeline options
export const TIMELINE_OPTIONS = [
  { title: "ASAP", value: "asap" },
  { title: "Within 1 Week", value: "1week" },
  { title: "Within 2 Weeks", value: "2weeks" },
  { title: "Within 1 Month", value: "1month" },
  { title: "1-3 Months", value: "3months" },
  { title: "Flexible", value: "flexible" },
];

// Project Complexity options
export const PROJECT_COMPLEXITY = [
  { title: "Simple", value: "simple" },
  { title: "Moderate", value: "moderate" },
  { title: "Complex", value: "complex" },
  { title: "Very Complex", value: "veryComplex" },
];

// Engagement Type options
export const ENGAGEMENT_TYPES = [
  { title: "One-time Project", value: "oneTime" },
  { title: "Ongoing Support", value: "ongoing" },
  { title: "Training & Implementation", value: "training" },
];

// Experience Level options
export const EXPERIENCE_LEVELS = [
  { title: "No Prior Experience", value: "none" },
  { title: "Basic Understanding", value: "basic" },
  { title: "Some Experience", value: "moderate" },
  { title: "Extensive Experience", value: "extensive" },
];

// Priority options
export const PRIORITY_LEVELS = [
  { title: "Low", value: "low" },
  { title: "Medium", value: "medium" },
  { title: "High", value: "high" },
  { title: "Urgent", value: "urgent" },
];

// Pricing Model options
export const PRICING_MODELS = [
  { title: "Hourly", value: "hourly" },
  { title: "Project-based", value: "project" },
  { title: "Retainer", value: "retainer" },
  { title: "Performance-based", value: "performance" },
];

// Availability Status options
export const AVAILABILITY_STATUSES = [
  { title: "Available Now", value: "availableNow" },
  { title: "Available Soon (within 2 weeks)", value: "availableSoon" },
  { title: "Limited Availability", value: "limited" },
  { title: "Currently Unavailable", value: "unavailable" },
  { title: "Booking Projects for Next Month", value: "bookingNextMonth" },
];

// Working Hours Preference options
export const WORKING_HOURS_PREFERENCES = [
  { title: "Full-time", value: "fullTime" },
  { title: "Part-time", value: "partTime" },
  { title: "Project-based", value: "projectBased" },
  { title: "Evenings/Weekends", value: "eveningsWeekends" },
  { title: "Flexible Hours", value: "flexible" },
];

// Response Time Commitment options
export const RESPONSE_TIME_COMMITMENTS = [
  { title: "Same day", value: "sameDay" },
  { title: "Within 24 hours", value: "within24" },
  { title: "Within 48 hours", value: "within48" },
  { title: "3+ days", value: "3PlusDays" },
];

// Preferred Payment Methods options
export const PAYMENT_METHODS = [
  { title: "PayPal", value: "paypal" },
  { title: "Bank Transfer", value: "bankTransfer" },
  { title: "Credit Card", value: "creditCard" },
  { title: "Crypto", value: "crypto" },
];

// Preferred Contact Method options
export const CONTACT_METHODS = [
  { title: "Email", value: "email" },
  { title: "Phone", value: "phone" },
  { title: "Video Call", value: "video" },
  { title: "Chat/Messaging", value: "chat" },
];

// Language Proficiency options
export const LANGUAGE_PROFICIENCIES = [
  { title: "Native", value: "native" },
  { title: "Fluent", value: "fluent" },
  { title: "Intermediate", value: "intermediate" },
  { title: "Basic", value: "basic" },
];

// Update Frequency options
export const UPDATE_FREQUENCIES = [
  { title: "Daily", value: "daily" },
  { title: "Weekly", value: "weekly" },
  { title: "As needed", value: "asNeeded" },
];

// Meeting Availability options
export const MEETING_AVAILABILITIES = [
  { title: "Regular business hours", value: "businessHours" },
  { title: "Evenings only", value: "evenings" },
  { title: "Weekends only", value: "weekends" },
  { title: "Flexible", value: "flexible" },
];

// General Availability options
export const AVAILABILITY_OPTIONS = [
  { title: "Full-time", value: "fullTime" },
  { title: "Part-time", value: "partTime" },
  { title: "Project-based", value: "projectBased" },
];

// Skill categories for agents
export const SKILL_OPTIONS = [
  { title: "Web Development", value: "web-development" },
  { title: "Mobile Development", value: "mobile-development" },
  { title: "UI/UX Design", value: "ui-ux-design" },
  { title: "Graphic Design", value: "graphic-design" },
  { title: "Content Writing", value: "content-writing" },
  { title: "Digital Marketing", value: "digital-marketing" },
  { title: "SEO", value: "seo" },
  { title: "Data Analysis", value: "data-analysis" },
  { title: "Consulting", value: "consulting" },
  { title: "DevOps", value: "devops" },
  { title: "Cloud Architecture", value: "cloud-architecture" },
  { title: "AI/ML", value: "ai-ml" },
  { title: "Blockchain", value: "blockchain" },
  { title: "Other", value: "other" },
];

// Working days options
export const WORKING_DAYS_OPTIONS = [
  { title: "Monday", value: "monday" },
  { title: "Tuesday", value: "tuesday" },
  { title: "Wednesday", value: "wednesday" },
  { title: "Thursday", value: "thursday" },
  { title: "Friday", value: "friday" },
  { title: "Saturday", value: "saturday" },
  { title: "Sunday", value: "sunday" },
];

// Portfolio project types
export const PORTFOLIO_TYPE_OPTIONS = [
  { title: "Personal Project", value: "personal" },
  { title: "Client Work", value: "client" },
  { title: "Open Source", value: "open-source" },
  { title: "Research", value: "research" },
];

// Language options
export const LANGUAGE_OPTIONS = [
  { title: "English", value: "english" },
  { title: "Spanish", value: "spanish" },
  { title: "French", value: "french" },
  { title: "German", value: "german" },
  { title: "Chinese", value: "chinese" },
  { title: "Japanese", value: "japanese" },
  { title: "Arabic", value: "arabic" },
  { title: "Hindi", value: "hindi" },
  { title: "Portuguese", value: "portuguese" },
  { title: "Russian", value: "russian" },
];

// Client Automation Needs options
export const CLIENT_AUTOMATION_NEEDS = [
  { title: "Lead Generation & Nurturing", value: "lead_gen" },
  { title: "Email Marketing Campaigns", value: "email" },
  { title: "Social Media Management", value: "social" },
  { title: "E-commerce Operations", value: "ecommerce" },
  { title: "Data Collection & Reporting", value: "data" },
  { title: "Workflow Automation", value: "workflow" },
  { title: "Others", value: "others" },
];

// Client Current Tools options
export const CLIENT_CURRENT_TOOLS = [
  { title: "CRM (HubSpot, Salesforce, Pipedrive)", value: "crm" },
  { title: "Email (Mailchimp, Klaviyo, ActiveCampaign)", value: "email" },
  { title: "E-commerce (Shopify, WooCommerce, Amazon)", value: "ecommerce" },
  { title: "Other Business Tools", value: "other" },
];

// Agent Automation Services options
export const AGENT_AUTOMATION_SERVICES = [
  { title: "Marketing Automation", value: "marketing" },
  { title: "Sales Automation", value: "sales" },
  { title: "E-commerce Automation", value: "ecommerce" },
  { title: "Workflow Automation", value: "workflow" },
  { title: "Data Automation", value: "data" },
  { title: "AI & Chatbots", value: "ai" },
  { title: "Custom Development", value: "custom" },
  { title: "Other Services", value: "others" },
];

// Agent Tools Expertise options
export const AGENT_TOOLS_EXPERTISE = [
  { title: "Zapier & Make.com", value: "automation" },
  { title: "HubSpot & Salesforce", value: "crm" },
  { title: "Klaviyo & Mailchimp", value: "email" },
  { title: "Airtable & Notion", value: "project" },
  { title: "Shopify & WooCommerce", value: "commerce" },
  { title: "ChatGPT & Claude", value: "ai_tools" },
  { title: "Other Tools", value: "others" },
];

// Export a function to get industry title by value
export const getIndustryTitleByValue = (value: string): string => {
  const industry = INDUSTRY_DOMAINS.find(
    (industry) => industry.value === value
  );
  return industry ? industry.title : value;
};

// Export a function to check if a value is a valid industry
export const isValidIndustry = (value: string): boolean => {
  return INDUSTRY_DOMAINS.some((industry) => industry.value === value);
};
