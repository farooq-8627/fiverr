import { SanityDocument } from "sanity";

export interface Author {
  _id: string;
  authorType?: string;
  personalDetails?: {
    username?: string;
    tagline?: string;
    profilePicture?: {
      asset?: {
        url?: string;
      };
    };
  };
  coreIdentity?: {
    fullName?: string;
  };
}

export interface Media {
  type: "image" | "video" | "pdf";
  file: {
    asset: {
      url: string;
    };
  };
  caption?: string;
  altText?: string;
  aspectRatio?: number;
}

export interface Comment {
  _key: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
  author: Author;
  replies?: Comment[];
}

export interface Like {
  _id: string;
  _key: string;
  likedAt: string;
  personalDetails?: {
    username: string;
    profilePicture?: {
      asset: {
        url: string;
      };
    };
  };
}

export interface Post {
  _id: string;
  title?: string;
  content: string;
  tags?: string[];
  createdAt: string;
  likes: Like[];
  comments: Comment[];
  media?: Media[];
  author: Author;
  authorType?: string;
  isAchievement?: boolean;
  achievementType?: string;
}

export type PostFilter = {
  username?: string;
  limit?: number;
  sortBy?: "latest" | "popular";
  tag?: string;
  achievementOnly?: boolean;
};

export interface PostActionResult {
  success: boolean;
  error?: string;
  data?: any;
}
