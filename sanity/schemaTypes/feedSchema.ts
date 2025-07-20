import { defineField, defineType } from "sanity";
import { ACHIEVEMENT_TYPES, MEDIA_TYPES } from "./constants";

// Media Schema for different types of media in a post
export const MediaSchema = defineType({
  name: "media",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Media Type",
      type: "string",
      options: {
        list: MEDIA_TYPES,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "file",
      title: "Media File",
      type: "file",
      options: {
        accept: "image/*, video/*, application/pdf",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Media Caption",
      type: "string",
    }),
    defineField({
      name: "altText",
      title: "Alt Text (Accessibility)",
      type: "string",
      description: "Describe the media for screen readers",
    }),
  ],
});

// Comment Schema with nested replies
export const CommentSchema = defineType({
  name: "comment",
  title: "Comment",
  type: "object",
  fields: [
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorType",
      title: "Author Type",
      type: "string",
      options: {
        list: [
          { title: "Agent", value: "agent" },
          { title: "Client", value: "client" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Comment Content",
      type: "text",
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({
      name: "replies",
      title: "Replies",
      type: "array",
      of: [{ type: "comment" }],
      description: "Nested comment replies",
    }),
  ],
});

// Like Schema
export const LikeSchema = defineType({
  name: "like",
  title: "Like",
  type: "object",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "likedAt",
      title: "Liked At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

// Social Feed Post Schema
export const PostSchema = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Post Title",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Post Content",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorType",
      title: "Author Type",
      type: "string",
      options: {
        list: [
          { title: "Agent", value: "agent" },
          { title: "Client", value: "client" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [{ type: "media" }],
      description: "Multiple media types can be added to a single post",
    }),
    defineField({
      name: "isAchievement",
      title: "Is Achievement Post",
      type: "boolean",
      initialValue: false,
      description: "Mark if this post represents a professional achievement",
    }),
    defineField({
      name: "achievementType",
      title: "Achievement Type",
      type: "string",
      options: {
        list: ACHIEVEMENT_TYPES,
      },
      hidden: ({ parent }) => !parent?.isAchievement,
    }),
    defineField({
      name: "relatedProject",
      title: "Related Project",
      type: "reference",
      to: [{ type: "agentProject" }, { type: "clientProject" }],
      description: "Optional: Link this achievement to a specific project",
      hidden: ({ parent }) => !parent?.isAchievement,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Add tags to categorize your post. You can use industry tags, skills, technologies, or any relevant keywords to help others find your content.",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "likes",
      title: "Likes",
      type: "array",
      of: [
        {
          type: "object",
          name: "like",
          fields: [
            {
              name: "user",
              type: "reference",
              to: [{ type: "user" }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: "likedAt",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "comments",
      title: "Comments",
      type: "array",
      of: [{ type: "comment" }],
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
      subtitle: "content",
      media: "media.0.file",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled Post",
        subtitle: subtitle || "No content",
        media: media,
      };
    },
  },
});
