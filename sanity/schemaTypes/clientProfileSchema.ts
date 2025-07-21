import { defineField, defineType } from "sanity";
import {
  INDUSTRY_DOMAINS,
  UPDATE_FREQUENCIES,
  MEETING_AVAILABILITIES,
  CONTACT_METHODS,
  LANGUAGE_PROFICIENCIES,
} from "./constants";

export const clientProfileSchema = defineType({
  name: "clientProfile",
  title: "Client Profile",
  type: "document",
  fields: [
    // Automation Needs
    defineField({
      name: "automationNeeds",
      title: "Automation Needs",
      type: "object",
      fields: [
        {
          name: "automationRequirements",
          title: "Automation Requirements",
          type: "array",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().min(1),
        },
        {
          name: "currentTools",
          title: "Current Tools",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    }),
    // Projects
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "clientProject" }] }],
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
        {
          name: "updateFrequency",
          title: "Update Frequency Preference",
          type: "string",
          options: {
            list: UPDATE_FREQUENCIES,
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "meetingAvailability",
          title: "Availability for Meetings",
          type: "string",
          options: {
            list: MEETING_AVAILABILITIES,
          },
          validation: (Rule) => Rule.required(),
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
          name: "bio",
          title: "Bio",
          type: "text",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "experience",
          title: "Experience",
          type: "text",
          validation: (Rule) => Rule.required(),
        },
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
          validation: (Rule) => Rule.required().min(1),
        },
        {
          name: "requirements",
          title: "Requirements",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    }),
  ],
});
