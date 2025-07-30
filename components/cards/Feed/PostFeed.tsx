import React, { useEffect } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useUser } from "@clerk/nextjs";
import { PostFilter } from "@/types/post";

interface PostFeedProps {
  username?: string;
  filter?: PostFilter;
  showAchievementsOnly?: boolean;
}

export function PostFeed({
  username,
  filter,
  showAchievementsOnly,
}: PostFeedProps) {
  const { user } = useUser();
  const {
    posts,
    userPosts,
    achievementPosts,
    loading,
    error,
    fetchPosts,
    fetchUserPosts,
    fetchAchievementPosts,
    likePost,
    unlikePost,
    handleAddComment: addComment,
    handleDeleteComment: deleteComment,
  } = usePosts();

  useEffect(() => {
    if (showAchievementsOnly && username) {
      fetchAchievementPosts(username);
    } else if (username) {
      fetchUserPosts(username);
    } else {
      fetchPosts();
    }
  }, [
    username,
    filter,
    showAchievementsOnly,
    fetchAchievementPosts,
    fetchUserPosts,
    fetchPosts,
  ]);

  const displayPosts = showAchievementsOnly
    ? achievementPosts
    : username
      ? userPosts
      : posts;

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!displayPosts?.length) {
    return <div>No posts found</div>;
  }

  const handleLike = async (postId: string) => {
    if (!user?.id || !user?.username) return;

    const post = displayPosts.find((post) => post._id === postId);
    if (!post) return;

    const isLiked = post.likes.some(
      (like) => like.personalDetails?.username === user.username
    );

    if (isLiked) {
      await unlikePost(postId, user.id);
    } else {
      await likePost(postId, user.id);
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    if (!user?.id) return;

    await addComment(postId, text, {
      _id: user.id,
      personalDetails: {
        username: user.username || "",
        profilePicture: user.imageUrl
          ? {
              asset: {
                url: user.imageUrl,
              },
            }
          : undefined,
      },
      coreIdentity: {
        fullName: user.fullName || "",
      },
    });
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    await deleteComment(postId, commentId);
  };

  return (
    <div className="space-y-6">
      {displayPosts.map((post) => (
        <article key={post._id} className="bg-white rounded-lg shadow p-6">
          {/* Author info */}
          <div className="flex items-center mb-4">
            {post.author.personalDetails?.profilePicture?.asset?.url && (
              <img
                src={post.author.personalDetails.profilePicture.asset.url}
                alt={post.author.coreIdentity?.fullName || "User"}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <h3 className="font-semibold">
                {post.author.coreIdentity?.fullName ||
                  post.author.personalDetails?.username ||
                  "Anonymous"}
              </h3>
              <p className="text-sm text-gray-500">
                @{post.author.personalDetails?.username || "anonymous"}
              </p>
            </div>
          </div>

          {/* Post content */}
          {post.title && (
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          )}
          <p className="text-gray-700 mb-4">{post.content}</p>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {post.media.map((media, index) => (
                <img
                  key={index}
                  src={media.file.asset.url}
                  alt="Post media"
                  className="rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-gray-500">
            <button
              onClick={() => handleLike(post._id)}
              className={`flex items-center gap-1 ${
                user?.username &&
                post.likes.some(
                  (like) => like.personalDetails?.username === user.username
                )
                  ? "text-red-500"
                  : ""
              }`}
            >
              <span>❤️</span>
              <span>{post.likes.length}</span>
            </button>
            <button className="flex items-center gap-1">
              <span>💬</span>
              <span>{post.comments.length}</span>
            </button>
          </div>

          {/* Comments */}
          <div className="mt-4 space-y-3">
            {post.comments.map((comment) => (
              <div
                key={comment._key}
                className="flex items-start gap-2 text-sm"
              >
                {comment.author.personalDetails?.profilePicture?.asset?.url && (
                  <img
                    src={
                      comment.author.personalDetails.profilePicture.asset.url
                    }
                    alt={comment.author.coreIdentity?.fullName || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {comment.author.coreIdentity?.fullName ||
                        comment.author.personalDetails?.username ||
                        "Anonymous"}
                    </h4>
                    {user?.id === comment.author._id && (
                      <button
                        onClick={() =>
                          handleDeleteComment(post._id, comment._key)
                        }
                        className="text-red-500 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add comment */}
          {user && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const comment = new FormData(form).get("comment") as string;
                if (comment.trim()) {
                  handleAddComment(post._id, comment);
                  form.reset();
                }
              }}
              className="mt-4 flex gap-2"
            >
              <input
                type="text"
                name="comment"
                placeholder="Add a comment..."
                className="flex-1 rounded-lg border p-2"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Post
              </button>
            </form>
          )}
        </article>
      ))}
    </div>
  );
}
