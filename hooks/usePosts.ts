import { useState, useCallback } from "react";
import { Post, PostFilter, Comment, Author } from "@/types/post";
import { addComment, deleteComment, editComment } from "@/lib/actions/comments";
import { usePost } from "@/lib/context/PostContext";

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
  } = usePost();

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

  const handleUpdateComment = useCallback(
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
    addComment: handleAddComment,
    deleteComment: handleDeleteComment,
    updateComment: handleUpdateComment,
  };
}
