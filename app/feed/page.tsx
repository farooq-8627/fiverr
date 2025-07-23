"use client";

import React, { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { PostCard, Media } from "@/components/cards/Feed/PostCard";
import { useUser } from "@clerk/nextjs";
import { Post } from "@/types/post";

interface PostCardPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: number;
  reposts: number;
  media?: Media[];
  author: {
    _id: string;
    name: string;
    username: string;
    portfolio?: string;
    profilePicture: {
      asset: {
        url: string;
      };
    };
    tagline?: string;
    verified?: boolean;
    roles?: string[];
  };
}

export default function FeedPage() {
  const { user } = useUser();
  const {
    posts,
    latestPosts,
    popularPosts,
    loading,
    error,
    fetchPosts,
    fetchLatestPosts,
    fetchPopularPosts,
  } = usePosts();

  const [activeTab, setActiveTab] = useState<"all" | "latest" | "popular">(
    "all"
  );

  useEffect(() => {
    // Fetch all types of posts when the component mounts
    fetchPosts();
    fetchLatestPosts();
    fetchPopularPosts();
  }, [fetchPosts, fetchLatestPosts, fetchPopularPosts]);

  // Transform Sanity post data to match PostCard component's expected format
  const transformPost = (post: Post): PostCardPost => {
    // Handle media transformation with null checks
    const transformedMedia = post.media
      ?.filter((media) => media && media.type && media.file?.asset?.url)
      .map((media) => ({
        type: media.type as "pdf" | "video" | "image",
        file: {
          asset: {
            url: media.file.asset.url,
          },
        },
        caption: media.caption || "",
        altText: media.altText || "",
      }));

    // Handle author profile picture with null check
    const profilePicture = post.author.personalDetails?.profilePicture || {
      asset: {
        url: "/default-avatar.png",
      },
    };

    return {
      _id: post._id,
      title: post.title || "",
      content: post.content,
      tags: post.tags || [],
      createdAt: post.createdAt,
      likes: post.likes || [], // Pass the likes array directly
      comments: post.comments?.length || 0,
      reposts: 0,
      media: transformedMedia,
      author: {
        _id: post.author._id,
        name: post.author.coreIdentity?.fullName || "",
        username: post.author.personalDetails?.username || "",
        profilePicture: {
          asset: {
            url: profilePicture.asset?.url || "",
          },
        },
        tagline: post.author.personalDetails?.tagline || "",
        verified: false,
        roles: [post.author.authorType || "user"],
      },
    };
  };

  const displayPosts = () => {
    if (loading) {
      return <div className="text-center py-8">Loading posts...</div>;
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      );
    }

    let postsToDisplay: Post[] = [];
    switch (activeTab) {
      case "latest":
        postsToDisplay = latestPosts;
        break;
      case "popular":
        postsToDisplay = popularPosts;
        break;
      default:
        postsToDisplay = posts;
    }

    if (!postsToDisplay?.length) {
      return <div className="text-center py-8">No posts found</div>;
    }

    return (
      <div className="space-y-6">
        {postsToDisplay.map((post) => (
          <PostCard key={post._id} post={transformPost(post)} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Feed Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setActiveTab("latest")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "latest"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "popular"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Popular
        </button>
      </div>

      {/* Posts Display */}
      {displayPosts()}
    </div>
  );
}
