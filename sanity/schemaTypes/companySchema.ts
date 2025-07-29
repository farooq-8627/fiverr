import { defineField, defineType } from "sanity";
import { INDUSTRY_DOMAINS, TEAM_SIZES } from "./constants";

// Shared Base Company Schema
export const companySchema = defineType({
  name: "company",
  title: "Company",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Company Name",
      type: "string",
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
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "A short, catchy phrase that describes the company",
    }),
    defineField({
      name: "bio",
      title: "Company Bio",
      type: "text",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "banner",
      title: "Banner",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "industries",
      title: "Industries",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: INDUSTRY_DOMAINS,
      },
      description: "Select all industries your company operates in",
    }),
    defineField({
      name: "customIndustries",
      title: "Custom Industries",
      type: "array",
      of: [{ type: "string" }],
      description: "Add any additional industries not listed above",
      hidden: ({ parent }) => {
        if (!parent?.industries) return true;
        return !parent.industries.includes("other");
      },
    }),
    defineField({
      name: "companyType",
      title: "Company Type",
      type: "string",
      options: {
        list: [
          { title: "Agent Company", value: "agent" },
          { title: "Client Company", value: "client" },
        ],
      },
    }),
    defineField({
      name: "createdBy",
      title: "Created By",
      type: "string",
      description: "Clerk ID of the user who created this company",
      validation: (Rule) => Rule.required(),
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
      title: "name",
      subtitle: "bio",
      media: "logo",
    },
  },
});
