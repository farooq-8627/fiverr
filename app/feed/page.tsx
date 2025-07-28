"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { usePosts } from "@/hooks/usePosts";
import { PostCard, Media } from "@/components/cards/Feed/PostCard";
import { useUser } from "@clerk/nextjs";
import { Like, Post } from "@/types/post";

interface PostCardPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: Like[]; // Array of user IDs who liked the post
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allLoadedPosts, setAllLoadedPosts] = useState<Post[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);
  const POSTS_PER_PAGE = 5;

  // Transform Sanity post data to match PostCard component's expected format
  const transformPost = useCallback((post: Post): PostCardPost => {
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
  }, []);

  // Load more posts for infinite scroll
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Simulate pagination by slicing existing posts
      // In a real app, you'd make an API call with page parameter
      let postsToUse: Post[] = [];
      switch (activeTab) {
        case "latest":
          postsToUse = latestPosts;
          break;
        case "popular":
          postsToUse = popularPosts;
          break;
        default:
          postsToUse = posts;
      }

      const startIndex = (page - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const newPosts = postsToUse.slice(startIndex, endIndex);

      if (newPosts.length < POSTS_PER_PAGE || endIndex >= postsToUse.length) {
        setHasMore(false);
      }

      if (page === 1) {
        setAllLoadedPosts(newPosts);
      } else {
        setAllLoadedPosts((prev) => [...prev, ...newPosts]);
      }

      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading more posts:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    activeTab,
    page,
    hasMore,
    isLoadingMore,
    posts,
    latestPosts,
    popularPosts,
  ]);

  // Reset pagination when tab changes
  const handleTabChange = useCallback((tab: "all" | "latest" | "popular") => {
    setActiveTab(tab);
    setPage(1);
    setHasMore(true);
    setAllLoadedPosts([]);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
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
  }, [hasMore, isLoadingMore, loadMorePosts]);

  // Initial data fetch
  useEffect(() => {
    // Fetch all types of posts when the component mounts
    fetchPosts();
    fetchLatestPosts();
    fetchPopularPosts();
  }, [fetchPosts, fetchLatestPosts, fetchPopularPosts]);

  // Load initial posts when data is available or tab changes
  useEffect(() => {
    if (
      (posts.length > 0 || latestPosts.length > 0 || popularPosts.length > 0) &&
      allLoadedPosts.length === 0
    ) {
      loadMorePosts();
    }
  }, [
    posts,
    latestPosts,
    popularPosts,
    activeTab,
    allLoadedPosts.length,
    loadMorePosts,
  ]);

  // Memoize the posts to display to prevent unnecessary re-renders
  const displayPosts = useMemo(() => {
    if (loading && allLoadedPosts.length === 0) {
      return null; // Show loading state
    }

    if (error) {
      return null; // Show error state
    }

    if (!allLoadedPosts?.length) {
      return null; // Show no posts state
    }

    return (
      <div className="space-y-6">
        {allLoadedPosts.map((post) => (
          <PostCard key={post._id} post={transformPost(post)} />
        ))}
        {isLoadingMore && (
          <div className="text-center py-4">Loading more posts...</div>
        )}
        {!isLoadingMore && hasMore && (
          <div ref={observerTarget} className="h-10" />
        )}
        {!hasMore && allLoadedPosts.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            No more posts to load
          </div>
        )}
      </div>
    );
  }, [allLoadedPosts, transformPost, isLoadingMore, hasMore]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Feed Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleTabChange("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => handleTabChange("latest")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "latest"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => handleTabChange("popular")}
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
      {loading && allLoadedPosts.length === 0 && (
        <div className="text-center py-8">Loading posts...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      )}

      {!loading && !error && allLoadedPosts.length === 0 && (
        <div className="text-center py-8">No posts found</div>
      )}

      {displayPosts}
    </div>
  );
}
