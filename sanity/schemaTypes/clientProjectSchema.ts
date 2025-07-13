import { defineField, defineType } from "sanity";
import {
  INDUSTRY_DOMAINS,
  BUDGET_RANGES,
  PROJECT_COMPLEXITY,
  ENGAGEMENT_TYPES,
  TEAM_SIZES,
  EXPERIENCE_LEVELS,
  PROJECT_STATUSES,
} from "./constants";

export const clientProjectSchema = defineType({
  name: "clientProject",
  title: "Client Project",
  type: "document",
  fields: [
    // Basic Info
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "painPoints",
      title: "Pain Points",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    // Project Requirements
    defineField({
      name: "budgetRange",
      title: "Budget Range",
      type: "string",
      options: {
        list: BUDGET_RANGES,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "timeline",
      title: "Timeline (in weeks)",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "complexity",
      title: "Project Complexity",
      type: "string",
      options: {
        list: PROJECT_COMPLEXITY,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "engagementType",
      title: "Engagement Type",
      type: "string",
      options: {
        list: ENGAGEMENT_TYPES,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "teamSize",
      title: "Required Team Size",
      type: "string",
      options: {
        list: TEAM_SIZES,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "experienceLevel",
      title: "Required Experience Level",
      type: "string",
      options: {
        list: EXPERIENCE_LEVELS,
      },
      validation: (Rule) => Rule.required(),
    }),
    // References
    defineField({
      name: "client",
      title: "Client",
      type: "reference",
      to: [{ type: "clientProfile" }],
      validation: (Rule) => Rule.required(),
    }),
    // Status
    defineField({
      name: "status",
      title: "Project Status",
      type: "string",
      options: {
        list: PROJECT_STATUSES,
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "industryDomain",
      title: "Industry Domain",
      type: "string",
      options: {
        list: INDUSTRY_DOMAINS,
      },
    }),
    // System Fields
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
    }),
  ],
  preview: {
    select: {
      title: "title",
      client: "client.user.personalDetails.username",
      status: "status",
      media: "images.0",
    },
    prepare(selection) {
      const { title, client, status, media } = selection;
      return {
        title: title || "Untitled Project",
        subtitle:
          `${client ? `by ${client}` : ""} ${status ? `- ${status}` : ""}`.trim(),
        media: media,
      };
    },
  },
});
