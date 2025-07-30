"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/cards/Feed/PostCard";
import { InfiniteFeedPageLayout } from "@/components/shared/InfiniteFeedPageLayout";
import { FeedPageLayout } from "@/components/shared/FeedPageLayout";
import { Post } from "@/types/post";

export default function FeedPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ field: string; order: "asc" | "desc" }>({
    field: "createdAt",
    order: "desc",
  });
  const [authorTypes, setAuthorTypes] = useState<("agent" | "client")[]>([]);
  const [isAchievementFilter, setIsAchievementFilter] = useState(false);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);

  const {
    posts,
    latestPosts,
    popularPosts,
    achievementPosts,
    loading,
    error,
    fetchPosts,
    fetchLatestPosts,
    fetchPopularPosts,
    fetchAchievementPosts,
  } = usePosts({ search, sort, authorTypes });

  // Transform Sanity post data to match PostCard component's expected format
  const transformPost = useCallback((post: Post) => {
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
        roles: [post.authorType || "user"],
      },
    };
  }, []);

  // Get posts based on current sort and filters
  const currentPosts = useMemo(() => {
    // If achievement filter is active, show achievement posts
    if (isAchievementFilter) {
      return achievementPosts;
    }

    // Otherwise show based on sort
    switch (sort.field) {
      case "likes":
        return popularPosts;
      case "createdAt":
      default:
        return latestPosts.length > 0 ? latestPosts : posts;
    }
  }, [
    sort.field,
    posts,
    latestPosts,
    popularPosts,
    achievementPosts,
    isAchievementFilter,
  ]);

  // Light debug logging only in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Feed data:", {
        count: currentPosts?.length || 0,
        loading,
        error: !!error,
        hasFilters: search || authorTypes.length > 0 || isAchievementFilter,
        posts: posts?.length || 0,
        latestPosts: latestPosts?.length || 0,
        popularPosts: popularPosts?.length || 0,
        achievementPosts: achievementPosts?.length || 0,
      });
    }
  }, [
    currentPosts?.length,
    loading,
    error,
    search,
    authorTypes.length,
    isAchievementFilter,
    posts?.length,
    latestPosts?.length,
    popularPosts?.length,
    achievementPosts?.length,
  ]);

  const handleSearchAndFiltersChange = useCallback(
    (
      searchQuery: string,
      newAuthorTypes: ("agent" | "client")[],
      newSort?: { field: string; order: "asc" | "desc" },
      achievementFilter?: boolean
    ) => {
      setSearch(searchQuery);
      setAuthorTypes(newAuthorTypes);
      setIsAchievementFilter(achievementFilter || false);
      if (newSort) {
        setSort(newSort);
      }
    },
    []
  );

  const handleSortChange = useCallback(
    (newSort: { field: string; order: "asc" | "desc" }) => {
      setSort(newSort);
      setIsAchievementFilter(false); // Reset achievement filter when changing sort
    },
    []
  );

  const handleAchievementToggle = useCallback(() => {
    const newAchievementFilter = !isAchievementFilter;
    setIsAchievementFilter(newAchievementFilter);

    // Fetch achievement posts when toggling on
    if (newAchievementFilter) {
      fetchAchievementPosts(""); // Fetch all achievement posts
    }
  }, [isAchievementFilter, fetchAchievementPosts]);

  const LayoutComponent = useInfiniteScroll
    ? InfiniteFeedPageLayout
    : FeedPageLayout;

  return (
    <LayoutComponent
      title="Community Feed"
      subtitle="Discover the latest updates, achievements, and insights from our automation community. Connect with experts and stay informed about industry trends."
      data={currentPosts || []}
      loading={loading}
      error={error ? new Error(error) : null}
      renderCard={(post: Post) => (
        <PostCard key={post._id} post={transformPost(post)} />
      )}
      emptyStateMessage="No posts found"
      onSearchAndFiltersChange={handleSearchAndFiltersChange}
      onSortChange={handleSortChange}
      onAchievementToggle={handleAchievementToggle}
      currentSort={sort}
      currentAuthorTypes={authorTypes}
      isAchievementFilter={isAchievementFilter}
      {...(useInfiniteScroll && {
        initialBatchSize: 5,
        batchSize: 5,
      })}
    />
  );
}
