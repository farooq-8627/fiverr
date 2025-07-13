import { defineField, defineType } from "sanity";
import {
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
  INDUSTRY_DOMAINS,
} from "./constants";

export const agentProfileSchema = defineType({
  name: "agentProfile",
  title: "Agent Profile",
  type: "document",
  fields: [
    // User
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    }),
    // Automation Expertise
    defineField({
      name: "automationExpertise",
      title: "Automation Expertise",
      type: "object",
      fields: [
        {
          name: "automationServices",
          title: "Automation Services",
          type: "array",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().min(1),
        },
        {
          name: "toolsExpertise",
          title: "Tools Expertise",
          type: "array",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().min(1),
        },
      ],
    }),
    // Projects
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "agentProject" }] }],
    }),
    // Business Details
    defineField({
      name: "businessDetails",
      title: "Business Details",
      type: "object",
      fields: [
        {
          name: "pricingModel",
          title: "Pricing Model",
          type: "string",
          options: {
            list: PRICING_MODELS,
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "projectSizePreferences",
          title: "Project Size Preferences",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: PROJECT_SIZE_PREFERENCES,
          },
          validation: (Rule) => Rule.required().min(1),
        },
        {
          name: "teamSize",
          title: "Team Size",
          type: "string",
          options: {
            list: TEAM_SIZES,
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "availability",
          title: "Availability",
          type: "string",
          options: {
            list: AVAILABILITY_OPTIONS,
          },
        },
        {
          name: "workType",
          title: "Work Type",
          type: "string",
          options: {
            list: WORKING_HOURS_PREFERENCES,
          },
        },
      ],
    }),
    // Availability
    defineField({
      name: "availability",
      title: "Availability",
      type: "object",
      fields: [
        {
          name: "availabilityStatus",
          title: "Current Availability Status",
          type: "string",
          options: {
            list: AVAILABILITY_STATUSES,
          },
        },
        {
          name: "workingHoursPreference",
          title: "Working Hours Preference",
          type: "string",
          options: {
            list: WORKING_HOURS_PREFERENCES,
          },
        },
        {
          name: "responseTimeCommitment",
          title: "Response Time Commitment",
          type: "string",
          options: {
            list: RESPONSE_TIME_COMMITMENTS,
          },
        },
      ],
    }),
    // Pricing
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        {
          name: "hourlyRateRange",
          title: "Hourly Rate Range (USD)",
          type: "string",
          options: {
            list: HOURLY_RATE_RANGES,
          },
        },
        {
          name: "minimumProjectBudget",
          title: "Minimum Project Budget (USD)",
          type: "string",
          options: {
            list: MINIMUM_PROJECT_BUDGETS,
          },
        },
        {
          name: "preferredPaymentMethods",
          title: "Preferred Payment Methods",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: PAYMENT_METHODS,
          },
        },
      ],
    }),
    // Communication Preferences
    defineField({
      name: "communicationPreferences",
      title: "Communication Preferences",
      type: "object",
      fields: [
        {
          name: "preferredContactMethod",
          title: "Preferred Contact Method",
          type: "string",
          options: {
            list: CONTACT_METHODS,
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "languagesSpoken",
          title: "Languages Spoken",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "language",
                  title: "Language",
                  type: "string",
                },
                {
                  name: "proficiency",
                  title: "Proficiency",
                  type: "string",
                  options: {
                    list: LANGUAGE_PROFICIENCIES,
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    // Must Have Requirements
    defineField({
      name: "mustHaveRequirements",
      title: "Must Have Requirements",
      type: "object",
      fields: [
        {
          name: "dealBreakers",
          title: "Deal Breakers",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "industryDomain",
          title: "Industry Domain",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: INDUSTRY_DOMAINS,
          },
        },
        {
          name: "requirements",
          title: "Requirements",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "user.coreIdentity.fullName",
      subtitle: "user.personalDetails.email",
      media: "user.personalDetails.profilePicture",
    },
  },
});
