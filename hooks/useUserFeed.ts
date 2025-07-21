import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { postQueries } from "@/lib/queries/post";
import type { Post } from "@/types/post";

export const useUserFeed = (username: string) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [achievements, setAchievements] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserFeed = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          userPostsData,
          achievementsData,
          latestPostsData,
          popularPostsData,
        ] = await Promise.all([
          client.fetch<Post[]>(postQueries.getUserPosts(username)),
          client.fetch<Post[]>(postQueries.getUserAchievements(username)),
          client.fetch<Post[]>(postQueries.getLatestPosts()),
          client.fetch<Post[]>(postQueries.getPopularPosts()),
        ]);

        setUserPosts(userPostsData);
        setAchievements(achievementsData);
        setLatestPosts(latestPostsData);
        setPopularPosts(popularPostsData);
      } catch (err) {
        console.error("Error fetching user feed:", err);
        setError("Failed to fetch user feed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFeed();
  }, [username]);

  return {
    userPosts,
    achievements,
    latestPosts,
    popularPosts,
    isLoading,
    error,
  };
};
