"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { Post, PostFilter, Like } from "@/types/post";
import { postQueries } from "../queries/post";
import { client } from "@/sanity/lib/client";
import { likePost as likePostAction } from "@/lib/actions/post";

interface PostContextType {
  posts: Post[];
  userPosts: Post[];
  achievementPosts: Post[];
  latestPosts: Post[];
  popularPosts: Post[];
  loading: boolean;
  error: string | null;
  // Post Operations
  fetchPosts: (filter?: PostFilter) => Promise<void>;
  fetchUserPosts: (username: string) => Promise<void>;
  fetchAchievementPosts: (username: string) => Promise<void>;
  fetchLatestPosts: () => Promise<void>;
  fetchPopularPosts: () => Promise<void>;
  createPost: (postData: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  unlikePost: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, text: string, author: any) => Promise<any>;
  deleteComment: (postId: string, commentKey: string) => Promise<any>;
  updateComment: (
    postId: string,
    commentKey: string,
    text: string
  ) => Promise<any>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [achievementPosts, setAchievementPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (filter?: PostFilter) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await client.fetch(postQueries.getAllPosts(filter));
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPosts = useCallback(async (username: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await client.fetch(
        postQueries.getUserPosts(username)
      );
      setUserPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to fetch user posts");
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAchievementPosts = useCallback(async (username: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await client.fetch(
        postQueries.getUserAchievements(username)
      );
      setAchievementPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to fetch achievement posts");
      console.error("Error fetching achievement posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLatestPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await client.fetch(postQueries.getLatestPosts());
      setLatestPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to fetch latest posts");
      console.error("Error fetching latest posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopularPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await client.fetch(postQueries.getPopularPosts());
      setPopularPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to fetch popular posts");
      console.error("Error fetching popular posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (postData: Partial<Post>) => {
      try {
        setLoading(true);
        setError(null);
        await client.create({
          _type: "post",
          ...postData,
          createdAt: new Date().toISOString(),
          likes: [],
          comments: [],
        });
        // Refresh posts after creation
        await fetchPosts();
      } catch (err) {
        setError("Failed to create post");
        console.error("Error creating post:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  const deletePost = useCallback(async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      await client.delete(postId);
      // Update posts state by removing the deleted post
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      setError("Failed to delete post");
      console.error("Error deleting post:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const likePost = useCallback(
    async (postId: string, userId: string) => {
      try {
        // Find the post and check if it's already liked
        const post = posts.find((p) => p._id === postId);
        if (!post) return;

        const isLiked = post.likes.some(
          (like) => like?.personalDetails?.username === userId
        );
        const action = isLiked ? "unlike" : "like";

        // Make the backend call first since we need user details
        console.log("Calling likePost server action...");
        const result = await likePostAction(postId, userId);
        console.log("Server action result:", result);

        if (!result.success) {
          throw new Error(result.error || "Failed to like/unlike post");
        }

        // Update UI after successful backend call
        const updatePostsState = (prevPosts: Post[]): Post[] =>
          prevPosts.map((post): Post => {
            if (post._id !== postId) return post;

            const updatedLikes =
              action === "unlike"
                ? post.likes.filter(
                    (like) => like?.personalDetails?.username !== userId
                  )
                : post.likes;

            return {
              ...post,
              likes: updatedLikes,
            };
          });

        // Update all post states
        setPosts(updatePostsState);
        setUserPosts(updatePostsState);
        setAchievementPosts(updatePostsState);
        setLatestPosts(updatePostsState);
        setPopularPosts(updatePostsState);
      } catch (err) {
        console.error("Error in likePost:", err);
        setError(
          err instanceof Error ? err.message : "Failed to like/unlike post"
        );
      }
    },
    [posts]
  );

  const unlikePost = useCallback(async (postId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await likePostAction(postId, userId);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update posts state based on the action
      const updatePostsState = (posts: Post[]) =>
        posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes:
                  result.action === "unlike"
                    ? post.likes.filter((like) => like._id !== userId)
                    : [...(post.likes || []), userId],
              }
            : post
        );
    } catch (err) {
      setError("Failed to like/unlike post");
      console.error("Error in unlikePost:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(
    async (postId: string, text: string, author: any) => {
      try {
        setLoading(true);
        setError(null);
        const result = await client.create({
          _type: "comment",
          post: { _type: "reference", _ref: postId },
          text: text,
          author: { _type: "reference", _ref: author._id },
          createdAt: new Date().toISOString(),
        });
        // Refresh posts to include the new comment
        await fetchPosts();
        return result;
      } catch (err) {
        setError("Failed to add comment");
        console.error("Error adding comment:", err);
        return { success: false, error: "Failed to add comment" };
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  const deleteComment = useCallback(
    async (postId: string, commentKey: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await client.delete(commentKey);
        // Refresh posts to remove the deleted comment
        await fetchPosts();
        return result;
      } catch (err) {
        setError("Failed to delete comment");
        console.error("Error deleting comment:", err);
        return { success: false, error: "Failed to delete comment" };
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  const updateComment = useCallback(
    async (postId: string, commentKey: string, text: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await client
          .patch(postId)
          .setIfMissing({ comments: [] })
          .insert("after", "comments[-1]", [
            {
              _key: commentKey,
              _type: "comment",
              text: text,
            },
          ])
          .commit();
        // Refresh posts to update the comment
        await fetchPosts();
        return result;
      } catch (err) {
        setError("Failed to update comment");
        console.error("Error updating comment:", err);
        return { success: false, error: "Failed to update comment" };
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  const value = {
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
    updateComment,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
}
