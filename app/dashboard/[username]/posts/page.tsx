"use client";

import React, { useRef, useEffect } from "react";
import { useUserFeed } from "@/hooks/useUserFeed";
import { PostCard, Media } from "@/components/cards/Feed/PostCard";
import { useParams } from "next/navigation";
import { Post, Like } from "@/types/post";

interface PostCardPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: Like[];
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

export default function UserPostsPage() {
  const params = useParams();
  const username = params.username as string;
  const { userPosts, isLoading, error, hasMore, loadMore } =
    useUserFeed(username);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadMore]);

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
      likes: post.likes,
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

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!userPosts?.length && !isLoading) {
    return <div className="text-center py-8">No posts found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{username}&apos;s Posts</h1>
      <div className="space-y-6">
        {userPosts.map((post) => (
          <PostCard key={post._id} post={transformPost(post)} />
        ))}
        {isLoading && (
          <div className="text-center py-4">Loading more posts...</div>
        )}
        {!isLoading && hasMore && <div ref={observerTarget} className="h-10" />}
        {!hasMore && userPosts.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            No more posts to load
          </div>
        )}
      </div>
    </div>
  );
}
