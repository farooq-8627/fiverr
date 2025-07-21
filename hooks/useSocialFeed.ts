"use client";
import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";

export interface FeedMedia {
  type: "image" | "video" | "pdf";
  file: {
    asset: {
      url: string;
    };
  };
  caption?: string;
  altText?: string;
}

export interface FeedComment {
  _id: string;
  content: string;
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
  };
  createdAt: string;
}

export interface FeedLike {
  profile: {
    _id: string;
    personalDetails: {
      username: string;
      profilePicture?: {
        asset: {
          url: string;
        };
      };
    };
  };
  likedAt: string;
}

export interface FeedPost {
  _id: string;
  title?: string;
  content: string;
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
  };
  authorType: "agent" | "client";
  media?: FeedMedia[];
  isAchievement: boolean;
  achievementType?:
    | "projectCompletion"
    | "milestone"
    | "award"
    | "certification"
    | "other";
  relatedProject?: {
    _id: string;
    title: string;
    description: string;
  };
  industryTags: string[];
  likes: FeedLike[];
  comments: FeedComment[];
  createdAt: string;
  updatedAt: string;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-21",
  useCdn: true,
});

const POST_FIELDS = `
  _id,
  title,
  content,
  author-> {
    _id,
    personalDetails {
      username,
      profilePicture {
        asset-> {
          url
        }
      }
    }
  },
  authorType,
  media[] {
    type,
    file {
      asset-> {
        url
      }
    },
    caption,
    altText
  },
  isAchievement,
  achievementType,
  relatedProject-> {
    _id,
    title,
    description
  },
  tags,
  likes[] {
    profile-> {
      _id,
      personalDetails {
        username,
        profilePicture {
          asset-> {
            url
          }
        }
      }
    },
    likedAt
  },
  comments[] {
    _id,
    content,
    author-> {
      _id,
      personalDetails {
        username,
        profilePicture {
          asset-> {
            url
          }
        }
      }
    },
    createdAt
  },
  createdAt,
  updatedAt
`;

export function useSocialFeed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all posts with pagination
  const fetchPosts = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      setError(null);

      const start = (page - 1) * limit;
      const postsData = await client.fetch<FeedPost[]>(
        `*[_type == "feedPost"] | order(createdAt desc) [${start}...${start + limit}] {
          ${POST_FIELDS}
        }`
      );

      if (page === 1) {
        setPosts(postsData);
      } else {
        setPosts((prev) => [...prev, ...postsData]);
      }
      return postsData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch posts"));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts by username
  const fetchUserPosts = async (username: string) => {
    try {
      const postsData = await client.fetch<FeedPost[]>(
        `*[_type == "feedPost" && author->personalDetails.username == $username] | order(createdAt desc) {
          ${POST_FIELDS}
        }`,
        { username }
      );
      return postsData;
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
      return [];
    }
  };

  // Fetch achievement posts only
  const fetchAchievementPosts = async () => {
    try {
      const postsData = await client.fetch<FeedPost[]>(
        `*[_type == "feedPost" && isAchievement == true] | order(createdAt desc) {
          ${POST_FIELDS}
        }`
      );
      return postsData;
    } catch (err) {
      console.error("Failed to fetch achievement posts:", err);
      return [];
    }
  };

  // Fetch posts by industry
  const fetchPostsByIndustry = async (industry: string) => {
    try {
      const postsData = await client.fetch<FeedPost[]>(
        `*[_type == "feedPost" && $industry in industryTags] | order(createdAt desc) {
          ${POST_FIELDS}
        }`,
        { industry }
      );
      return postsData;
    } catch (err) {
      console.error("Failed to fetch industry posts:", err);
      return [];
    }
  };

  // Fetch trending posts (most liked in last 7 days)
  const fetchTrendingPosts = async (limit = 10) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const postsData = await client.fetch<FeedPost[]>(
        `*[_type == "feedPost" && createdAt > $sevenDaysAgo] | order(count(likes) desc) [0...$limit] {
          ${POST_FIELDS}
        }`,
        {
          sevenDaysAgo: sevenDaysAgo.toISOString(),
          limit,
        }
      );
      return postsData;
    } catch (err) {
      console.error("Failed to fetch trending posts:", err);
      return [];
    }
  };

  // Fetch posts by author type (agent/client)
  const fetchPostsByAuthorType = async (authorType: "agent" | "client") => {
    try {
      const postsData = await client.fetch<FeedPost[]>(
        `*[_type == "feedPost" && authorType == $authorType] | order(createdAt desc) {
          ${POST_FIELDS}
        }`,
        { authorType }
      );
      return postsData;
    } catch (err) {
      console.error("Failed to fetch posts by author type:", err);
      return [];
    }
  };

  // Search posts by content or title
  const searchPosts = async (searchTerm: string) => {
    try {
      const postsData = await client.fetch<FeedPost[]>(
        `*[_type == "feedPost" && (title match $searchTerm || content match $searchTerm)] | order(createdAt desc) {
          ${POST_FIELDS}
        }`,
        { searchTerm: `*${searchTerm}*` }
      );
      return postsData;
    } catch (err) {
      console.error("Failed to search posts:", err);
      return [];
    }
  };

  // Load initial data
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    fetchUserPosts,
    fetchAchievementPosts,
    fetchPostsByIndustry,
    fetchTrendingPosts,
    fetchPostsByAuthorType,
    searchPosts,
  };
}
