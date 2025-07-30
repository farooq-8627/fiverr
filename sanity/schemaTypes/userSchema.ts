import { defineField, defineType } from "sanity";
import userProfileDetails from "./userProfileDetails";

export const userSchema = defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    // Clerk Fields
    defineField({
      name: "clerkId",
      title: "Clerk ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    // Personal Details
    defineField({
      name: "personalDetails",
      title: "Personal Details",
      type: "object",
      fields: [
        {
          name: "email",
          title: "Email",
          type: "string",
          validation: (Rule) => Rule.required().email(),
        },
        {
          name: "username",
          title: "Username",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "phone",
          title: "Phone",
          type: "string",
        },
        {
          name: "website",
          title: "Website",
          type: "url",
        },
        {
          name: "profilePicture",
          title: "Profile Picture",
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
          name: "bannerImage",
          title: "Banner Image",
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
          name: "socialLinks",
          title: "Social Links",
          type: "array",
          of: [
            {
              name: "socialLink",
              type: "object",
              fields: [
                { name: "platform", type: "string" },
                { name: "url", type: "string" },
              ],
            },
          ],
        },
      ],
    }),
    // Core Identity
    defineField({
      name: "coreIdentity",
      title: "Core Identity",
      type: "object",
      fields: [
        {
          name: "fullName",
          title: "Full Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "bio",
          title: "Bio",
          type: "text",
        },
        {
          name: "tagline",
          title: "Tagline",
          type: "string",
        },
      ],
    }),
    // Profile Details
    defineField({
      name: "profileDetails",
      title: "Profile Details",
      type: "object",
      fields: userProfileDetails.fields,
    }),
    // Company Details
    defineField({
      name: "hasCompany",
      title: "Has Company",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "companies",
      title: "Companies",
      type: "array",
      of: [{ type: "reference", to: [{ type: "company" }] }],
      hidden: ({ parent }) => !parent?.hasCompany,
    }),
    // Profile References
    defineField({
      name: "agentProfiles",
      title: "Agent Profiles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "agentProfile" }] }],
    }),
    defineField({
      name: "clientProfiles",
      title: "Client Profiles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "clientProfile" }] }],
    }),
    defineField({
      name: "posts",
      title: "Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    }),
    // System Fields
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
      title: "coreIdentity.fullName",
      subtitle: "personalDetails.username",
      media: "personalDetails.profilePicture",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Unnamed User",
        subtitle: subtitle ? `@${subtitle}` : undefined,
        media,
      };
    },
  },
});
