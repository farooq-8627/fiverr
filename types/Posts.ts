import { User } from "./User";

// Media types
export interface FeedMedia {
  _key: string;
  type: "image" | "video" | "pdf";
  file: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    url: string;
  };
  caption?: string;
  altText?: string;
}

// Comment types
export interface FeedComment {
  _key: string;
  author: {
    _ref: string;
    _type: "reference";
  };
  authorType: "agent" | "client";
  content: string;
  createdAt: string;
  updatedAt?: string;
  replies?: FeedComment[];
}

// Like type
export interface FeedLike {
  _key: string;
  user: {
    _ref: string;
    _type: "reference";
  };
  likedAt: string;
}

// Achievement types
export type AchievementType =
  | "projectCompletion"
  | "milestone"
  | "award"
  | "certification"
  | "other";

// Project reference type
export interface ProjectReference {
  _ref: string;
  _type: "reference";
  _key: string;
}

// Main post type
export interface FeedPost {
  _id: string;
  _type: "post";
  title?: string;
  content: string;
  author: {
    _ref: string;
    _type: "reference";
  };
  authorType: "agent" | "client";
  media?: FeedMedia[];
  isAchievement: boolean;
  achievementType?: AchievementType;
  relatedProject?: ProjectReference;
  tags?: string[];
  likes: FeedLike[];
  comments: FeedComment[];
  createdAt: string;
  updatedAt?: string;
}

// Response types for API calls
export interface FeedPostResponse {
  post: FeedPost;
  author: User;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
}

export interface FeedPostsResponse {
  posts: FeedPost[];
  authors: { [key: string]: User };
  totalPosts: number;
  hasMore: boolean;
}

// Request types for creating/updating posts
export interface CreateFeedPostRequest {
  title?: string;
  content: string;
  media?: Omit<FeedMedia, "_key">[];
  isAchievement?: boolean;
  achievementType?: AchievementType;
  relatedProject?: string; // Project ID
  tags?: string[];
}

export interface UpdateFeedPostRequest extends Partial<CreateFeedPostRequest> {
  postId: string;
}

// Comment request types
export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentCommentKey?: string; // For replies
}

export interface UpdateCommentRequest {
  postId: string;
  commentKey: string;
  content: string;
}
