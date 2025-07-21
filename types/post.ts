import { SanityDocument } from "sanity";

export interface Author {
  _id: string;
  personalDetails: {
    username: string;
    profilePicture?: {
      asset: {
        url: string;
      };
    };
  };
  coreIdentity: {
    fullName: string;
    tagline?: string;
    bio?: string;
  };
}

export interface MediaAsset {
  _key: string;
  type: "pdf" | "video" | "image";
  file: {
    asset: {
      url: string;
    };
  };
  caption?: string;
  altText?: string;
}

export interface Comment {
  _key: string;
  text: string;
  author: Author;
  createdAt: string;
}

export interface Post {
  _id: string;
  _type: "post";
  title?: string;
  content: string;
  author: Author;
  authorType: "agent" | "client";
  media?: MediaAsset[];
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  tags?: string[];
  isAchievement?: boolean;
  createdAt: string;
  _rev: string;
}

export interface PostFilter {
  username?: string;
  limit?: number;
  sortBy?: "latest" | "popular";
  tag?: string;
  achievementOnly?: boolean;
}

export type PostWithAuthor = Post & {
  author: {
    _id: string;
    personalDetails: {
      username: string;
      profilePicture?: {
        asset: {
          url: string;
        };
      };
    };
    coreIdentity: {
      fullName: string;
    };
  };
};

export type PostActionResult = {
  success: boolean;
  message?: string;
  data?: any;
};
