import { useState, useCallback, useEffect, useMemo } from "react";
import { Post, PostFilter, Comment, Author } from "@/types/post";
import { addComment, deleteComment, editComment } from "@/lib/actions/comments";
import { usePost } from "@/lib/context/PostContext";
import { client } from "@/sanity/lib/client";

interface UsePostsOptions {
  search?: string;
  sort?: { field: string; order: "asc" | "desc" };
  authorTypes?: ("agent" | "client")[];
}

export function usePosts(options: UsePostsOptions = {}) {
  const { search = "", sort, authorTypes = [] } = options;
  const {
    posts,
    userPosts,
    achievementPosts,
    latestPosts,
    popularPosts,
    loading,
    error,
    fetchPosts: originalFetchPosts,
    fetchUserPosts,
    fetchAchievementPosts,
    fetchLatestPosts: originalFetchLatestPosts,
    fetchPopularPosts: originalFetchPopularPosts,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    setPosts,
    setLatestPosts,
    setPopularPosts,
  } = usePost();

  // State for filtered posts
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Auto-fetch posts when hook is first used
  useEffect(() => {
    const initialFetch = async () => {
      try {
        await originalFetchPosts();
        await originalFetchLatestPosts();
        await originalFetchPopularPosts();
      } catch (error) {
        console.error("Error in initial fetch:", error);
      }
    };

    // Only fetch if we don't have posts already
    if (
      posts.length === 0 &&
      latestPosts.length === 0 &&
      popularPosts.length === 0 &&
      !loading
    ) {
      initialFetch();
    }
  }, [
    originalFetchPosts,
    originalFetchLatestPosts,
    originalFetchPopularPosts,
    posts.length,
    latestPosts.length,
    popularPosts.length,
    loading,
  ]);

  // Memoized filter query string - ONLY memoizes the query string, not the fetch
  const filteredQuery = useMemo(() => {
    // If no search or author type filters, return null to indicate no filtering needed
    if (!search && authorTypes.length === 0) {
      return null;
    }

    const postProjection = `{
      ...,
      "author": coalesce(
        author->{
          _id,
          personalDetails {
            username,
            profilePicture {
              asset-> {
                url
              }
            }
          },
          coreIdentity {
            fullName,
            tagline,
            bio
          },
          mustHaveRequirements {
            industryDomain
          }
        },
        author->userId->{
          _id,
          personalDetails {
            username,
            profilePicture {
              asset-> {
                url
              }
            }
          },
          coreIdentity {
            fullName,
            tagline,
            bio
          },
          mustHaveRequirements {
            industryDomain
          }
        }
      ),
      media[] {
        type,
        caption,
        altText,
        "file": {
          "asset": {
            "url": file.asset->url
          }
        }
      },
      comments[] {
        _key,
        text,
        createdAt,
        "author": coalesce(
          author->{
            _id,
            personalDetails {
              username,
              profilePicture {
                asset-> {
                  url
                }
              }
            },
            coreIdentity {
              fullName
            }
          },
          {
            "_id": author._id,
            "personalDetails": author.personalDetails,
            "coreIdentity": author.coreIdentity
          }
        ),
      },
      likes[] {
        _id,
        personalDetails {
          username,
          profilePicture {
            asset-> {
              url
            }
          }
        }
      }
    }`;

    let baseQuery = `*[_type == "post"`;
    const filterConditions: string[] = [];

    // Enhanced search condition - search in title, content, author names, and tags
    if (search) {
      filterConditions.push(`(
        title match "*${search}*" ||
        content match "*${search}*" ||
        author->coreIdentity.fullName match "*${search}*" ||
        author->personalDetails.username match "*${search}*" ||
        author->userId->coreIdentity.fullName match "*${search}*" ||
        author->userId->personalDetails.username match "*${search}*" ||
        "${search}" in tags[]
      )`);
    }

    // Author type filtering
    if (authorTypes.length > 0) {
      const authorConditions = authorTypes
        .map((type) => `authorType == "${type}"`)
        .join(" || ");
      filterConditions.push(`(${authorConditions})`);
    }

    // Add filter conditions to base query
    if (filterConditions.length > 0) {
      baseQuery += ` && (${filterConditions.join(" && ")})`;
    }

    baseQuery += `]`;

    // Add sorting
    if (sort) {
      baseQuery += ` | order(${sort.field} ${sort.order})`;
    } else {
      baseQuery += ` | order(createdAt desc)`;
    }

    // Add limit and projection
    baseQuery += `[0...50]${postProjection}`;

    return baseQuery;
  }, [search, sort, authorTypes]);

  // Fetch filtered posts when query changes - MOVED BACK TO useEffect
  useEffect(() => {
    if (!filteredQuery) {
      setFilteredPosts([]);
      setIsFiltering(false);
      return;
    }

    const fetchFilteredPosts = async () => {
      try {
        setIsFiltering(true);
        console.log("Executing search query:", filteredQuery);
        const result = await client.fetch(filteredQuery);
        console.log("Search results:", result);
        setFilteredPosts(result || []);
      } catch (error) {
        console.error("Error fetching filtered posts:", error);
        setFilteredPosts([]);
      } finally {
        setIsFiltering(false);
      }
    };

    fetchFilteredPosts();
  }, [filteredQuery]);

  // Determine if we should show filtered posts or regular posts
  const shouldShowFiltered = search || authorTypes.length > 0;

  // Filtered fetch functions that return the appropriate data
  const fetchPosts = useCallback(async () => {
    if (shouldShowFiltered) {
      // If filtering, the useEffect above handles the fetch
      return;
    }
    return originalFetchPosts();
  }, [shouldShowFiltered, originalFetchPosts]);

  const fetchLatestPosts = useCallback(async () => {
    if (shouldShowFiltered) {
      // If filtering, the useEffect above handles the fetch
      return;
    }
    return originalFetchLatestPosts();
  }, [shouldShowFiltered, originalFetchLatestPosts]);

  const fetchPopularPosts = useCallback(async () => {
    if (shouldShowFiltered) {
      // If filtering, the useEffect above handles the fetch
      return;
    }
    return originalFetchPopularPosts();
  }, [shouldShowFiltered, originalFetchPopularPosts]);

  const handleAddComment = useCallback(
    async (
      postId: string,
      text: string,
      author: Author,
      parentCommentKey?: string
    ) => {
      try {
        return await addComment(postId, text, author, parentCommentKey);
      } catch (error) {
        console.error("Error adding comment:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to add comment",
        };
      }
    },
    []
  );

  const handleDeleteComment = useCallback(
    async (
      postId: string,
      commentKey: string,
      isReply?: boolean,
      parentCommentKey?: string
    ) => {
      try {
        return await deleteComment(
          postId,
          commentKey,
          isReply,
          parentCommentKey
        );
      } catch (error) {
        console.error("Error deleting comment:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to delete comment",
        };
      }
    },
    []
  );

  const handleEditComment = useCallback(
    async (
      postId: string,
      commentKey: string,
      text: string,
      isReply?: boolean,
      parentCommentKey?: string
    ) => {
      try {
        return await editComment(
          postId,
          commentKey,
          text,
          isReply,
          parentCommentKey
        );
      } catch (error) {
        console.error("Error updating comment:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to update comment",
        };
      }
    },
    []
  );

  return {
    posts: shouldShowFiltered ? filteredPosts : posts,
    latestPosts: shouldShowFiltered ? filteredPosts : latestPosts,
    popularPosts: shouldShowFiltered ? filteredPosts : popularPosts,
    userPosts,
    achievementPosts,
    loading: loading || isFiltering,
    error,
    fetchPosts,
    fetchUserPosts,
    fetchAchievementPosts,
    fetchLatestPosts,
    fetchPopularPosts,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    handleAddComment,
    handleDeleteComment,
    handleEditComment,
  };
}
