import { defineField, defineType, SanityDocument } from "sanity";
import {
  INDUSTRY_DOMAINS,
  PRICING_MODELS,
  PROJECT_SIZE_PREFERENCES,
  TEAM_SIZES,
  AVAILABILITY_OPTIONS,
  AVAILABILITY_STATUSES,
  WORKING_HOURS_PREFERENCES,
  RESPONSE_TIME_COMMITMENTS,
  HOURLY_RATE_RANGES,
  MINIMUM_PROJECT_BUDGETS,
  PAYMENT_METHODS,
  CONTACT_METHODS,
  LANGUAGE_PROFICIENCIES,
  UPDATE_FREQUENCIES,
  MEETING_AVAILABILITIES,
} from "./constants";

// Social Media Link Schema
export const socialLinkSchema = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
  ],
});

// Personal Details Schema
export const personalDetailsSchema = defineType({
  name: "personalDetails",
  title: "Personal Details",
  type: "object",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "username",
      title: "Username",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "profilePicture",
      title: "Profile Picture",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bannerImage",
      title: "Banner Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});

// Core Identity Schema
export const coreIdentitySchema = defineType({
  name: "coreIdentity",
  title: "Core Identity",
  type: "object",
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hasCompany",
      title: "Has Company",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "companyId",
      title: "Company ID",
      type: "reference",
      to: [{ type: "company" }],
      hidden: ({ parent }) => !parent?.hasCompany,
    }),
  ],
});

// Automation Expertise Schema (for Agents)
export const automationExpertiseSchema = defineType({
  name: "automationExpertise",
  title: "Automation Expertise",
  type: "object",
  fields: [
    defineField({
      name: "automationServices",
      title: "Automation Services",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "toolsExpertise",
      title: "Tools Expertise",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});

// Agent Business Details Schema
export const agentBusinessDetailsSchema = defineType({
  name: "agentBusinessDetails",
  title: "Business Details",
  type: "object",
  fields: [
    defineField({
      name: "pricingModel",
      title: "Pricing Model",
      type: "string",
      options: {
        list: PRICING_MODELS,
      },
    }),
    defineField({
      name: "projectSizePreferences",
      title: "Project Size Preferences",
      description: "Select the project budget ranges you're comfortable with",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: PROJECT_SIZE_PREFERENCES,
      },
    }),
    defineField({
      name: "teamSize",
      title: "Team Size",
      type: "string",
      options: {
        list: TEAM_SIZES,
      },
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      options: {
        list: AVAILABILITY_OPTIONS,
      },
      description: "Your general availability for work",
    }),
  ],
});

// Automation Needs Schema (for Clients)
export const automationNeedsSchema = defineType({
  name: "automationNeeds",
  title: "Automation Needs",
  type: "object",
  fields: [
    defineField({
      name: "automationRequirements",
      title: "Automation Requirements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "currentTools",
      title: "Current Tools",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});

// Agent Availability Schema
export const agentAvailabilitySchema = defineType({
  name: "agentAvailability",
  title: "Availability & Working Hours",
  type: "object",
  fields: [
    defineField({
      name: "availabilityStatus",
      title: "Current Availability Status",
      type: "string",
      options: {
        list: AVAILABILITY_STATUSES,
      },
      description:
        "Your current, time-based availability status that can change frequently",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "workingHoursPreference",
      title: "Working Hours Preference",
      type: "string",
      options: {
        list: WORKING_HOURS_PREFERENCES,
      },
      description: "Your general working style preference (permanent setting)",
    }),
    defineField({
      name: "availabilityHours",
      title: "Availability Hours",
      type: "string",
      description:
        "Specify your typical available hours (e.g., '9 AM - 5 PM weekdays')",
    }),
    defineField({
      name: "timeZone",
      title: "Time Zone",
      type: "string",
      description:
        "Your primary time zone for work (e.g., 'UTC+1', 'Eastern Time', 'GMT+5:30')",
    }),
    defineField({
      name: "responseTimeCommitment",
      title: "Response Time Commitment",
      type: "string",
      options: {
        list: RESPONSE_TIME_COMMITMENTS,
      },
      description: "How quickly you typically respond to messages",
    }),
  ],
});

// Agent Pricing Schema
export const agentPricingSchema = defineType({
  name: "agentPricing",
  title: "Pricing & Rates",
  type: "object",
  fields: [
    defineField({
      name: "hourlyRateRange",
      title: "Hourly Rate Range (USD)",
      type: "string",
      options: {
        list: HOURLY_RATE_RANGES,
      },
    }),
    defineField({
      name: "minimumProjectBudget",
      title: "Minimum Project Budget (USD)",
      type: "string",
      options: {
        list: MINIMUM_PROJECT_BUDGETS,
      },
    }),
    defineField({
      name: "preferredPaymentMethods",
      title: "Preferred Payment Methods",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: PAYMENT_METHODS,
      },
    }),
  ],
});

// Agent Communication Preferences Schema
export const agentCommunicationPreferencesSchema = defineType({
  name: "agentCommunicationPreferences",
  title: "Communication Preferences",
  type: "object",
  fields: [
    defineField({
      name: "preferredContactMethod",
      title: "Preferred Contact Method",
      type: "string",
      options: {
        list: CONTACT_METHODS,
      },
    }),
    defineField({
      name: "languagesSpoken",
      title: "Languages Spoken",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "language",
              title: "Language",
              type: "string",
            }),
            defineField({
              name: "proficiency",
              title: "Proficiency",
              type: "string",
              options: {
                list: LANGUAGE_PROFICIENCIES,
              },
            }),
          ],
        },
      ],
    }),
  ],
});

// Client Communication Preferences Schema
export const clientCommunicationPreferencesSchema = defineType({
  name: "clientCommunicationPreferences",
  title: "Communication Preferences",
  type: "object",
  fields: [
    defineField({
      name: "preferredContactMethod",
      title: "Preferred Contact Method",
      type: "string",
      options: {
        list: CONTACT_METHODS,
      },
    }),
    defineField({
      name: "languagesSpoken",
      title: "Languages Spoken",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "language",
              title: "Language",
              type: "string",
            }),
            defineField({
              name: "proficiency",
              title: "Proficiency",
              type: "string",
              options: {
                list: LANGUAGE_PROFICIENCIES,
              },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "updateFrequency",
      title: "Update Frequency Preference",
      type: "string",
      options: {
        list: UPDATE_FREQUENCIES,
      },
    }),
    defineField({
      name: "meetingAvailability",
      title: "Availability for Meetings",
      type: "string",
      options: {
        list: MEETING_AVAILABILITIES,
      },
    }),
  ],
});

// Client Must-have Requirements Schema
export const clientMustHaveRequirementsSchema = defineType({
  name: "clientMustHaveRequirements",
  title: "Must-have Requirements",
  type: "object",
  fields: [
    defineField({
      name: "dealBreakers",
      title: "Deal-breaker Requirements",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Requirements that are absolutely necessary for your project. These are non-negotiable conditions that, if not met, would make the project impossible to proceed with. Examples: specific technology requirements, security standards, timeline constraints, etc.",
    }),
    defineField({
      name: "industryDomain",
      title: "Industry/Domain",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: INDUSTRY_DOMAINS,
      },
      description:
        "Select all industries/domains your business operates in or your projects relate to",
      // Handle migration from string to array
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // If no value, it's valid
          if (!value) return true;

          // If it's already an array, it's valid
          if (Array.isArray(value)) return true;

          // If it's a string, explain the error
          if (typeof value === "string") {
            return `The value should be an array, but is currently a string. Please click "Reset value" and select your industries again.`;
          }

          return "Value must be an array of strings";
        }),
    }),
    defineField({
      name: "customIndustry",
      title: "Custom Industry/Domain",
      type: "array",
      of: [{ type: "string" }],
      description: "Add any additional industries not listed above",
      hidden: ({ parent }) => {
        if (!parent?.industryDomain) return true;
        if (Array.isArray(parent.industryDomain)) {
          return !parent.industryDomain.includes("other");
        }
        return parent.industryDomain !== "other";
      },
    }),
  ],
});

// Must Have Requirements Schema
export const mustHaveRequirementsSchema = defineType({
  name: "mustHaveRequirements",
  title: "Must Have Requirements",
  type: "object",
  fields: [
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      description: "A detailed biography or description of yourself/your work",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "text",
      description: "Describe your relevant experience in your field",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dealBreakers",
      title: "Deal Breakers",
      type: "array",
      of: [{ type: "string" }],
      description: "List of absolute requirements or deal breakers",
    }),
    defineField({
      name: "industryDomain",
      title: "Industry Domain",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: INDUSTRY_DOMAINS,
      },
      description: "Industries you specialize in or prefer to work with",
    }),
    defineField({
      name: "customIndustry",
      title: "Custom Industry",
      type: "array",
      of: [{ type: "string" }],
      description: "Add any custom industries not listed above",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
      description: "List of specific requirements or preferences",
    }),
  ],
});

// Update Agent Profile Schema
export const agentProfileSchema = defineType({
  name: "agentProfile",
  title: "Agent Profile",
  type: "document",
  fields: [
    defineField({
      name: "profileId",
      title: "Profile ID",
      type: "slug",
      description: "A unique identifier for this agent profile",
      validation: (Rule) => Rule.required(),
      options: {
        source: (
          doc: SanityDocument & { coreIdentity?: { fullName?: string } }
        ) => {
          const timestamp = new Date().getTime();
          return `${doc.coreIdentity?.fullName || "agent"}-${timestamp}`;
        },
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
      },
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "personalDetails",
      title: "Personal Details",
      type: "personalDetails",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coreIdentity",
      title: "Core Identity",
      type: "coreIdentity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "automationExpertise",
      title: "Automation Expertise",
      type: "automationExpertise",
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "agentProject" }] }],
    }),
    defineField({
      name: "businessDetails",
      title: "Business Details",
      type: "agentBusinessDetails",
    }),
    // Simplified fields for agent profile
    defineField({
      name: "availability",
      title: "Availability",
      type: "agentAvailability",
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "agentPricing",
    }),
    defineField({
      name: "communicationPreferences",
      title: "Communication Preferences",
      type: "agentCommunicationPreferences",
    }),
    defineField({
      name: "mustHaveRequirements",
      title: "Must Have Requirements",
      type: "object",
      fields: [
        defineField({
          name: "tagline",
          title: "Tagline",
          type: "string",
          description: "A single line that best describes what you do",
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: "bio",
          title: "Bio",
          type: "text",
          description:
            "A detailed biography or description of yourself/your work",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "experience",
          title: "Experience",
          type: "text",
          description: "Describe your relevant experience in your field",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "dealBreakers",
          title: "Deal Breakers",
          type: "array",
          of: [{ type: "string" }],
          description: "List of absolute requirements or deal breakers",
        }),
        defineField({
          name: "industryDomain",
          title: "Industry Domain",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: INDUSTRY_DOMAINS,
          },
          description: "Industries you specialize in or prefer to work with",
        }),
        defineField({
          name: "customIndustry",
          title: "Custom Industry",
          type: "array",
          of: [{ type: "string" }],
          description: "Add any custom industries not listed above",
        }),
        defineField({
          name: "requirements",
          title: "Requirements",
          type: "array",
          of: [{ type: "string" }],
          description: "List of specific requirements or preferences",
        }),
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "personalDetails.username",
      subtitle: "coreIdentity.fullName",
      media: "personalDetails.profilePicture",
    },
  },
});

// Client Profile Schema
export const clientProfileSchema = defineType({
  name: "clientProfile",
  title: "Client Profile",
  type: "document",
  fields: [
    defineField({
      name: "profileId",
      title: "Profile ID",
      type: "slug",
      description: "A unique identifier for this client profile",
      validation: (Rule) => Rule.required(),
      options: {
        source: (
          doc: SanityDocument & { coreIdentity?: { fullName?: string } }
        ) => {
          const timestamp = new Date().getTime();
          return `${doc.coreIdentity?.fullName || "client"}-${timestamp}`;
        },
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
      },
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "personalDetails",
      title: "Personal Details",
      type: "personalDetails",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coreIdentity",
      title: "Core Identity",
      type: "coreIdentity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "automationNeeds",
      title: "Automation Needs",
      type: "automationNeeds",
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "clientProject" }] }],
    }),
    // Simplified fields for client profile
    defineField({
      name: "communicationPreferences",
      title: "Communication Preferences",
      type: "clientCommunicationPreferences",
    }),
    defineField({
      name: "mustHaveRequirements",
      title: "Must Have Requirements",
      type: "object",
      fields: [
        defineField({
          name: "tagline",
          title: "Tagline",
          type: "string",
          description:
            "A single line that best describes what you're looking for",
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: "bio",
          title: "Bio",
          type: "text",
          description:
            "A detailed biography or description of yourself/your work",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "experience",
          title: "Experience",
          type: "text",
          description: "Describe your relevant experience in your field",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "dealBreakers",
          title: "Deal Breakers",
          type: "array",
          of: [{ type: "string" }],
          description: "List of absolute requirements or deal breakers",
        }),
        defineField({
          name: "industryDomain",
          title: "Industry Domain",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: INDUSTRY_DOMAINS,
          },
          description: "Industries you specialize in or prefer to work with",
        }),
        defineField({
          name: "customIndustry",
          title: "Custom Industry",
          type: "array",
          of: [{ type: "string" }],
          description: "Add any custom industries not listed above",
        }),
        defineField({
          name: "requirements",
          title: "Requirements",
          type: "array",
          of: [{ type: "string" }],
          description: "List of specific requirements or preferences",
        }),
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "personalDetails.username",
      subtitle: "coreIdentity.fullName",
      media: "personalDetails.profilePicture",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Unnamed Client",
        subtitle: subtitle || "No User ID",
        media: media,
      };
    },
  },
});
