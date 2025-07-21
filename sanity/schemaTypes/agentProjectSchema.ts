import { defineField, defineType } from "sanity";
import { PROJECT_STATUSES, TEAM_SIZES } from "./constants";

export const agentProjectSchema = defineType({
  name: "agentProject",
  title: "Agent Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
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
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Project Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectLink",
      title: "Project URL",
      type: "url",
    }),

    defineField({
      name: "technologies",
      title: "Technologies Used",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "agent",
      title: "Agent",
      type: "reference",
      to: [{ type: "agentProfile" }],
      validation: (Rule) => Rule.required(),
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
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: PROJECT_STATUSES,
      },
      initialValue: "active",
    }),
    defineField({
      name: "isPortfolioProject",
      title: "Is Portfolio Project",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "images",
      title: "Project Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
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
      title: "title",
      subtitle: "description",
      media: "images.0",
    },
  },
});
