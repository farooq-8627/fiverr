import { defineField, defineType, Rule } from "sanity";
import {
  INDUSTRY_DOMAINS,
  AGENT_PROJECT_STATUSES,
  PROJECT_STATUSES,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  PROJECT_COMPLEXITY,
  ENGAGEMENT_TYPES,
  TEAM_SIZES,
  EXPERIENCE_LEVELS,
  PRIORITY_LEVELS,
} from "./constants";

// Project Image Schema
export const projectImageSchema = defineType({
  name: "projectImage",
  title: "Project Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
    }),
  ],
});

// Base Project Schema - Common fields shared between agent and client projects
export const baseProjectSchema = {
  title: {
    type: "string",
    validation: (Rule: Rule) => Rule.required(),
  },
  description: {
    type: "text",
    validation: (Rule: Rule) => Rule.required(),
  },
  status: {
    type: "string",
    options: {
      list: [
        { title: "Planning", value: "planning" },
        { title: "In Progress", value: "inProgress" },
        { title: "Completed", value: "completed" },
        { title: "On Hold", value: "onHold" },
        { title: "Cancelled", value: "cancelled" },
      ],
    },
    validation: (Rule: Rule) => Rule.required(),
  },
  createdAt: {
    type: "datetime",
    readOnly: true,
  },
  updatedAt: {
    type: "datetime",
  },
};

// Agent Project Schema
export const agentProjectSchema = defineType({
  name: "agentProject",
  title: "Agent Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectLink",
      title: "Project Link",
      type: "url",
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "projectImage" }],
    }),
    defineField({
      name: "completionDate",
      title: "Completion Date",
      type: "date",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: AGENT_PROJECT_STATUSES,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isPortfolioProject",
      title: "Show in Portfolio",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0.image",
      subtitle: "description",
    },
    prepare(selection) {
      const { title, media, subtitle } = selection;
      return {
        title: title || "Untitled Project",
        media: media,
        subtitle: subtitle
          ? subtitle.length > 50
            ? subtitle.substring(0, 50) + "..."
            : subtitle
          : "",
      };
    },
  },
});

// Client Project Schema
export const clientProjectSchema = defineType({
  name: "clientProject",
  title: "Client Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessDomain",
      title: "Business Domain",
      type: "string",
      options: {
        list: INDUSTRY_DOMAINS,
      },
    }),
    defineField({
      name: "painPoints",
      title: "Pain Points",
      type: "text",
    }),
    // Budget Range
    defineField({
      name: "budgetRange",
      title: "Budget Range",
      type: "string",
      options: {
        list: BUDGET_RANGES,
      },
    }),
    // Timeline
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
      options: {
        list: TIMELINE_OPTIONS,
      },
    }),
    // Project Complexity
    defineField({
      name: "complexity",
      title: "Project Complexity",
      type: "string",
      options: {
        list: PROJECT_COMPLEXITY,
      },
    }),
    // Engagement Type
    defineField({
      name: "engagementType",
      title: "Type of Engagement",
      type: "string",
      options: {
        list: ENGAGEMENT_TYPES,
      },
    }),
    // Team Size
    defineField({
      name: "teamSize",
      title: "Team Size",
      type: "string",
      options: {
        list: TEAM_SIZES,
      },
    }),
    // Experience Level
    defineField({
      name: "experienceLevel",
      title: "Automation Experience Level",
      type: "string",
      options: {
        list: EXPERIENCE_LEVELS,
      },
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: PRIORITY_LEVELS,
      },
    }),
    defineField({
      name: "assignedAgents",
      title: "Assigned Agents",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "agentProfile" }],
          options: {
            disableNew: true,
          },
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: PROJECT_STATUSES,
      },
      validation: (Rule) => Rule.required(),
      initialValue: "draft",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
});
