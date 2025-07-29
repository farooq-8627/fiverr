import { Button } from "@/components/UI/button";
import { GlassCard } from "@/components/UI/GlassCard";
import { PostCard } from "@/components/cards/Feed/PostCard";
import { Plus } from "lucide-react";
import React, { useState, useMemo } from "react";
import { CreatePostModal } from "./CreatePostModal";
import { User } from "@/types/User";
import Link from "next/link";
import { Post, Like } from "@/types/post";
import { FeedPost } from "@/types/Posts";
import { PostProvider } from "@/lib/context/PostContext";

interface PostCardPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: Like[];
  comments: number;
  reposts: number;
  media?: Post["media"];
  author: {
    _id: string;
    name: string;
    username: string;
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

interface PostSectionProps {
  posts: Post[];
  username: string;
  isCurrentUser?: boolean;
  profileId: string;
  onPostUpdate?: (data: FeedPost) => void;
  user: User;
}

// Memoize the post transformation function
const transformPost = (post: Post): PostCardPost => ({
  _id: post._id,
  title: post.title || "",
  content: post.content,
  tags: post.tags || [],
  createdAt: post.createdAt,
  likes: post.likes || [],
  comments: post.comments?.length ?? 0,
  reposts: 0,
  media: post.media?.map((media) => ({
    ...media,
    file: {
      asset: {
        url: media.file?.asset?.url || "",
      },
    },
  })),
  author: {
    _id: post.author._id,
    name:
      post.author.coreIdentity?.fullName ||
      post.author.personalDetails?.username ||
      "Anonymous",
    username: post.author.personalDetails?.username || "anonymous",
    profilePicture: {
      asset: {
        url: post.author.personalDetails?.profilePicture?.asset?.url || "",
      },
    },
    tagline: post.author.personalDetails?.tagline,
    verified: false,
    roles: [post.author.authorType || "user"],
  },
});

export function PostSectionContent({
  posts,
  username,
  isCurrentUser,
  profileId,
  onPostUpdate = () => {}, // Default empty function
  user,
}: PostSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Memoize the latest post and transformed post data
  const { latestPost, hasMorePosts, transformedLatestPost } = useMemo(() => {
    const latestPost = posts?.[0];
    return {
      latestPost,
      hasMorePosts: (posts?.length ?? 0) > 1,
      transformedLatestPost: latestPost ? transformPost(latestPost) : null,
    };
  }, [posts]);

  const handlePostUpdate = async (updatedPost: FeedPost) => {
    onPostUpdate(updatedPost);
  };

  // Pre-calculate fixed dimensions to prevent layout shifts
  const cardMinHeight = latestPost ? "min-h-[300px]" : "min-h-[100px]";

  return (
    <GlassCard className={cardMinHeight}>
      <div className="md:px-6 py-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Posts</h2>
          <div className="flex items-center gap-2">
            {isCurrentUser && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <Plus className="h-4 w-4 text-white" />
              </Button>
            )}
            {hasMorePosts && (
              <Link href={`/dashboard/${username}/posts`}>
                <Button variant="ghost" className="text-sm">
                  Show All
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Posts List with fixed height container */}
        <div className="space-y-4">
          {transformedLatestPost ? (
            <PostCard post={transformedLatestPost} />
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-center text-gray-400">No posts yet</p>
            </div>
          )}
        </div>
      </div>

      <CreatePostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          profileId,
          user: user,
        }}
        isCurrentUser={isCurrentUser || false}
        onPostUpdate={handlePostUpdate}
      />
    </GlassCard>
  );
}

// Memoize the entire PostSection component
export const PostSection = React.memo(function PostSection(
  props: PostSectionProps
) {
  return (
    <PostProvider>
      <PostSectionContent {...props} />
    </PostProvider>
  );
});
