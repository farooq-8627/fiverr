"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { Post, PostFilter, Comment } from "@/types/post";
import { postQueries } from "../queries/post";
import { client } from "@/sanity/lib/client";

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
  addComment: (
    postId: string,
    comment: string,
    userId: string,
    author: Comment["author"]
  ) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
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
      const query = postQueries.getAllPosts(filter);
      const result = await client.fetch<Post[]>(query);
      setPosts(result);
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
      const query = postQueries.getUserPosts(username);
      const result = await client.fetch<Post[]>(query);
      setUserPosts(result);
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
      const query = postQueries.getUserAchievements(username);
      const result = await client.fetch<Post[]>(query);
      setAchievementPosts(result);
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
      const query = postQueries.getLatestPosts();
      const result = await client.fetch<Post[]>(query);
      setLatestPosts(result);
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
      const query = postQueries.getPopularPosts();
      const result = await client.fetch<Post[]>(query);
      setPopularPosts(result);
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

  const likePost = useCallback(async (postId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await client
        .patch(postId)
        .setIfMissing({ likes: [] })
        .append("likes", [userId])
        .commit();

      // Update posts state to reflect the like
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: [...(post.likes || []), userId] }
            : post
        )
      );
    } catch (err) {
      setError("Failed to like post");
      console.error("Error liking post:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikePost = useCallback(async (postId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await client
        .patch(postId)
        .unset([`likes[@ == "${userId}"]`])
        .commit();

      // Update posts state to reflect the unlike
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: post.likes.filter((id) => id !== userId) }
            : post
        )
      );
    } catch (err) {
      setError("Failed to unlike post");
      console.error("Error unliking post:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(
    async (
      postId: string,
      text: string,
      userId: string,
      author: Comment["author"]
    ) => {
      try {
        setLoading(true);
        setError(null);
        const newComment: Comment = {
          _key: new Date().toISOString(),
          text,
          author,
          createdAt: new Date().toISOString(),
        };

        await client
          .patch(postId)
          .setIfMissing({ comments: [] })
          .append("comments", [newComment])
          .commit();

        // Update posts state to reflect the new comment
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...(post.comments || []), newComment] }
              : post
          )
        );
      } catch (err) {
        setError("Failed to add comment");
        console.error("Error adding comment:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteComment = useCallback(
    async (postId: string, commentId: string) => {
      try {
        setLoading(true);
        setError(null);
        await client
          .patch(postId)
          .unset([`comments[_key == "${commentId}"]`])
          .commit();

        // Update posts state to reflect the deleted comment
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment._key !== commentId
                  ),
                }
              : post
          )
        );
      } catch (err) {
        setError("Failed to delete comment");
        console.error("Error deleting comment:", err);
      } finally {
        setLoading(false);
      }
    },
    []
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
