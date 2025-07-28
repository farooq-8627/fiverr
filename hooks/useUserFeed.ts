import { useState, useEffect, useCallback } from "react";
import { client } from "@/sanity/lib/client";
import { postQueries } from "@/lib/queries/post";
import type { Post } from "@/types/post";
import { usePost } from "@/lib/context/PostContext";

const POST_PROJECTION = `{
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

export const useUserFeed = (username: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const POSTS_PER_PAGE = 5;

  // Use PostContext instead of local state for posts
  const {
    userPosts,
    setUserPosts,
    achievementPosts,
    setAchievementPosts,
    latestPosts,
    setLatestPosts,
    popularPosts,
    setPopularPosts,
  } = usePost();

  const fetchUserPosts = useCallback(
    async (pageNumber: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const start = (pageNumber - 1) * POSTS_PER_PAGE;
        const query = `*[_type == "post" && (author->personalDetails.username == "${username}" || author->userId->personalDetails.username == "${username}")] | order(createdAt desc) [${start}...${start + POSTS_PER_PAGE}] ${POST_PROJECTION}`;

        const newPosts = await client.fetch<Post[]>(query);

        if (newPosts.length < POSTS_PER_PAGE) {
          setHasMore(false);
        }

        if (pageNumber === 1) {
          setUserPosts(newPosts);
        } else {
          setUserPosts((prev: Post[]) => [...prev, ...newPosts]);
        }

        return newPosts;
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to fetch user posts");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [username, setUserPosts]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    await fetchUserPosts(nextPage);
    setPage(nextPage);
  }, [fetchUserPosts, hasMore, isLoading, page]);

  useEffect(() => {
    // Reset state when username changes
    setUserPosts([]);
    setPage(1);
    setHasMore(true);

    // Fetch initial data
    fetchUserPosts(1);

    // Fetch other data in parallel
    const fetchInitialData = async () => {
      try {
        const [achievementsData, latestPostsData, popularPostsData] =
          await Promise.all([
            client.fetch<Post[]>(postQueries.getUserAchievements(username)),
            client.fetch<Post[]>(postQueries.getLatestPosts()),
            client.fetch<Post[]>(postQueries.getPopularPosts()),
          ]);

        setAchievementPosts(achievementsData);
        setLatestPosts(latestPostsData);
        setPopularPosts(popularPostsData);
      } catch (err) {
        console.error("Error fetching additional data:", err);
      }
    };

    fetchInitialData();
  }, [
    username,
    fetchUserPosts,
    setUserPosts,
    setAchievementPosts,
    setLatestPosts,
    setPopularPosts,
  ]);

  return {
    userPosts,
    achievementPosts,
    latestPosts,
    popularPosts,
    isLoading,
    error,
    hasMore,
    loadMore,
  };
};
