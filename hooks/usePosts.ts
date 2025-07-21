import { useCallback } from "react";
import { usePost } from "@/lib/context/PostContext";
import { Post, PostFilter, Author } from "@/types/post";

export function usePosts() {
  const {
    posts,
    userPosts,
    achievementPosts,
    latestPosts,
    popularPosts,
    loading,
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
    addComment,
    deleteComment,
  } = usePost();

  // Helper function to handle post creation with error handling
  const handleCreatePost = useCallback(
    async (postData: Partial<Post>) => {
      try {
        await createPost(postData);
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to create post" };
      }
    },
    [createPost]
  );

  // Helper function to handle post deletion with error handling
  const handleDeletePost = useCallback(
    async (postId: string) => {
      try {
        await deletePost(postId);
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to delete post" };
      }
    },
    [deletePost]
  );

  // Helper function to handle post liking with error handling
  const handleLikePost = useCallback(
    async (postId: string, userId: string) => {
      try {
        await likePost(postId, userId);
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to like post" };
      }
    },
    [likePost]
  );

  // Helper function to handle post unliking with error handling
  const handleUnlikePost = useCallback(
    async (postId: string, userId: string) => {
      try {
        await unlikePost(postId, userId);
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to unlike post" };
      }
    },
    [unlikePost]
  );

  // Helper function to handle comment addition with error handling
  const handleAddComment = useCallback(
    async (postId: string, text: string, userId: string, author: Author) => {
      try {
        await addComment(postId, text, userId, author);
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to add comment" };
      }
    },
    [addComment]
  );

  // Helper function to handle comment deletion with error handling
  const handleDeleteComment = useCallback(
    async (postId: string, commentId: string) => {
      try {
        await deleteComment(postId, commentId);
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to delete comment" };
      }
    },
    [deleteComment]
  );

  // Helper function to fetch filtered posts
  const fetchFilteredPosts = useCallback(
    async (filter: PostFilter) => {
      try {
        await fetchPosts(filter);
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to fetch filtered posts" };
      }
    },
    [fetchPosts]
  );

  return {
    // States
    posts,
    userPosts,
    achievementPosts,
    latestPosts,
    popularPosts,
    loading,
    error,

    // Fetch operations
    fetchPosts,
    fetchUserPosts,
    fetchAchievementPosts,
    fetchLatestPosts,
    fetchPopularPosts,
    fetchFilteredPosts,

    // Post operations with error handling
    createPost: handleCreatePost,
    deletePost: handleDeletePost,
    likePost: handleLikePost,
    unlikePost: handleUnlikePost,
    addComment: handleAddComment,
    deleteComment: handleDeleteComment,
  };
}
