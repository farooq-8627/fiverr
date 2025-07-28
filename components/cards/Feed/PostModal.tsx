"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Modal, ModalContent } from "../../UI/modal";
import { Button } from "../../UI/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../UI/avatar";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  BadgeCheck,
  ShieldCheck,
  Link,
  ArrowUpRight,
  Clock,
  Trash,
  Pencil,
  Check,
  X as XIcon,
  Loader2,
} from "lucide-react";
import { formatPostTime } from "@/lib/formatPostTime";
import type { Media } from "./PostCard";
import { GlassModal } from "../../UI/GlassModal";
import { cn } from "@/lib/utils";
import { usePosts } from "@/hooks/usePosts";
import { useUser } from "@clerk/nextjs";
import { Author, Like } from "@/types/post";
import { client } from "@/sanity/lib/client";
import { postQueries } from "@/lib/queries/post";

interface Comment {
  _key: string;
  text: string;
  createdAt: string;
  author: Author;
  isEdited?: boolean;
  replies?: Comment[]; // Added for replies
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    _id: string; // Changed from id to _id to match our post structure
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    likes: Like[]; // Array of user IDs who liked the post
    comments: number;
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
  };
  selectedMediaIndex: number;
}

export function PostModal({
  isOpen,
  onClose,
  post,
  selectedMediaIndex,
}: PostModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] =
    useState(selectedMediaIndex);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentKey, setEditingCommentKey] = useState<string | null>(
    null
  );
  const [editText, setEditText] = useState("");
  const [replyingToKey, setReplyingToKey] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const { user } = useUser();
  const {
    handleAddComment: addCommentAPI,
    handleDeleteComment: deleteCommentAPI,
    handleEditComment: updateCommentAPI,
  } = usePosts();

  // Fetch comments when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, post._id]); // Only depend on isOpen and post.id

  const fetchComments = useCallback(async () => {
    try {
      console.log("=== Fetching comments ===");
      const query = postQueries.getPostComments(post._id);
      console.log("Executing query:", query);

      const result = await client.fetch(query);
      console.log("Raw query result:", result);

      const comments = result?.comments || [];
      console.log("Extracted comments:", comments);

      setComments(comments);
      console.log("=== Comments fetch complete ===");
    } catch (error) {
      console.error("=== Comments fetch failed ===");
      console.error("Error fetching comments:", error);
    }
  }, [post._id]); // Memoize fetchComments

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const authorData: Author = {
        _id: user.id,
        personalDetails: {
          username: user.username || user.id,
          profilePicture: user.imageUrl
            ? {
                asset: {
                  url: user.imageUrl,
                },
              }
            : undefined,
        },
        coreIdentity: {
          fullName: user.fullName || user.username || "Anonymous User",
        },
      };

      const result = await addCommentAPI(
        post._id,
        commentText.trim(),
        authorData
      );

      if (result.success && result.data) {
        await fetchComments(); // Fetch fresh comments
        setCommentText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentKey: string) => {
    try {
      const result = await deleteCommentAPI(post._id, commentKey);
      if (result.success) {
        await fetchComments(); // Fetch fresh comments
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (commentKey: string) => {
    const comment = comments.find((c) => c._key === commentKey);
    if (comment) {
      setEditingCommentKey(commentKey);
      setEditText(comment.text);
    }
  };

  const handleSaveEdit = async (commentKey: string) => {
    try {
      const result = await updateCommentAPI(
        post._id,
        commentKey,
        editText.trim()
      );
      if (result.success) {
        await fetchComments();
        setEditingCommentKey(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error saving comment edit:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentKey(null);
    setEditText("");
  };

  const handleAddReply = async (
    e: React.FormEvent,
    parentCommentKey: string
  ) => {
    e.preventDefault();
    if (!user || !replyText.trim()) return;

    try {
      setIsSubmitting(true);
      const result = await addCommentAPI(
        post._id,
        replyText.trim(),
        {
          _id: user.id,
          personalDetails: {
            username: user.username || user.id,
            profilePicture: user.imageUrl
              ? {
                  asset: {
                    url: user.imageUrl,
                  },
                }
              : undefined,
          },
          coreIdentity: {
            fullName: user.fullName || user.username || "Anonymous User",
          },
        },
        parentCommentKey
      );
      if (result.success) {
        setReplyText("");
        setReplyingToKey(null);
        await fetchComments();
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReply = async (
    commentKey: string,
    parentCommentKey: string
  ) => {
    try {
      const result = await deleteCommentAPI(
        post._id,
        commentKey,
        true,
        parentCommentKey
      );
      if (result.success) {
        await fetchComments();
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleEditReply = async (
    commentKey: string,
    parentCommentKey: string
  ) => {
    const parentComment = comments.find((c) => c._key === parentCommentKey);
    const reply = parentComment?.replies?.find((r) => r._key === commentKey);
    if (reply) {
      setEditingCommentKey(commentKey);
      setEditText(reply.text);
    }
  };

  const handleSaveReplyEdit = async (
    commentKey: string,
    parentCommentKey: string
  ) => {
    try {
      const result = await updateCommentAPI(
        post._id,
        commentKey,
        editText.trim(),
        true,
        parentCommentKey
      );
      if (result.success) {
        await fetchComments();
        setEditingCommentKey(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error saving reply edit:", error);
    }
  };

  const toggleReplies = (commentKey: string) => {
    setExpandedReplies((prev) =>
      prev.includes(commentKey)
        ? prev.filter((key) => key !== commentKey)
        : [...prev, commentKey]
    );
  };

  const currentMedia = post.media?.[currentMediaIndex];
  const hasMultipleMedia = (post.media?.length || 0) > 1;

  const handlePrevious = () => {
    const mediaLength = post.media?.length || 0;
    if (mediaLength === 0) return;
    setCurrentMediaIndex((prev) => (prev === 0 ? mediaLength - 1 : prev - 1));
  };

  const handleNext = () => {
    const mediaLength = post.media?.length || 0;
    if (mediaLength === 0) return;
    setCurrentMediaIndex((prev) => (prev === mediaLength - 1 ? 0 : prev + 1));
  };

  const renderMedia = () => {
    if (!currentMedia) return null;

    switch (currentMedia.type) {
      case "image":
        return (
          <div className="relative w-full h-full">
            <Image
              src={currentMedia.file.asset.url}
              alt={currentMedia.altText || currentMedia.caption || "Post image"}
              fill
              className="object-contain"
              priority
            />
          </div>
        );
      case "video":
        return (
          <div className="relative w-full h-full">
            <video
              src={currentMedia.file.asset.url}
              className="w-full h-full object-contain bg-black"
              controls
              autoPlay={false}
              loop
            >
              <source src={currentMedia.file.asset.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "pdf":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <iframe
              src={currentMedia.file.asset.url}
              className="w-full h-full"
              title="PDF Document"
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Memoize the comment rendering to prevent unnecessary re-renders
  const renderComments = useMemo(() => {
    return comments.map((comment) => {
      const profilePicUrl =
        comment.author?.personalDetails?.profilePicture?.asset?.url;
      const username = comment.author?.personalDetails?.username || "Anonymous";
      const fullName = comment.author?.coreIdentity?.fullName || username;
      const authorId = comment.author?._id;
      const initial = fullName.charAt(0).toUpperCase();
      const isPostAuthor = authorId === post.author._id;

      // Remove the user ID prefix for comparison
      const cleanAuthorId = authorId?.replace("user-", "");
      const cleanUserId = user?.id?.replace("user-", "");
      const canModify = cleanUserId === cleanAuthorId;
      const isEditing = editingCommentKey === comment._key;
      const isReplying = replyingToKey === comment._key;
      const hasReplies = comment.replies && comment.replies.length > 0;
      const isExpanded = expandedReplies.includes(comment._key);
      const displayedReplies = isExpanded
        ? comment.replies
        : comment.replies?.slice(0, 1);

      const handleCommentProfileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = `/dashboard/${username}`;
      };

      return (
        <div key={comment._key} className="space-y-4">
          {/* Main comment */}
          <div className="flex gap-3">
            <Avatar
              className="h-9 w-9 shrink-0 bg-violet-500/10 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleCommentProfileClick}
            >
              {profilePicUrl ? (
                <AvatarImage src={profilePicUrl} alt={fullName} />
              ) : (
                <AvatarFallback className="bg-violet-500/10 text-violet-500">
                  {initial}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-medium text-sm cursor-pointer text-violet-400 hover:text-violet-300 transition-colors"
                      onClick={handleCommentProfileClick}
                    >
                      {fullName}
                    </span>
                    {isPostAuthor && (
                      <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
                        Author
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {formatPostTime(comment.createdAt)}
                    {comment.isEdited && (
                      <span className="ml-1 text-gray-500">(edited)</span>
                    )}
                  </span>
                </div>
                {canModify && (
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(comment._key)}
                          className="text-green-400 hover:text-green-300"
                          title="Save"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-gray-300"
                          title="Cancel"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditComment(comment._key)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._key)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              {isEditing ? (
                <div className="mt-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-white/5 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-200 mt-1">{comment.text}</p>
                  {!isReplying && (
                    <button
                      onClick={() => setReplyingToKey(comment._key)}
                      className="text-xs text-violet-300 hover:text-violet-400 mt-2"
                    >
                      Reply
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Reply form */}
          {isReplying && (
            <form
              onSubmit={(e) => handleAddReply(e, comment._key)}
              className="ml-11 mt-2 flex items-center gap-2"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-white/5 rounded-full px-3 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-16"
                  disabled={isSubmitting}
                  autoFocus
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingToKey(null);
                      setReplyText("");
                    }}
                    className="text-gray-400 hover:text-gray-300 p-1"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                  <Button
                    type="submit"
                    disabled={!replyText.trim() || isSubmitting}
                    className="rounded-full p-1"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Replies */}
          {hasReplies && (
            <div className="ml-11 space-y-4">
              {displayedReplies?.map((reply) => {
                const replyProfilePicUrl =
                  reply.author?.personalDetails?.profilePicture?.asset?.url;
                const replyUsername =
                  reply.author?.personalDetails?.username || "Anonymous";
                const replyFullName =
                  reply.author?.coreIdentity?.fullName || replyUsername;
                const replyAuthorId = reply.author?._id;
                const replyInitial = replyFullName.charAt(0).toUpperCase();
                const isReplyAuthor = replyAuthorId === post.author._id;

                const cleanReplyAuthorId = replyAuthorId?.replace("user-", "");
                const canModifyReply = cleanUserId === cleanReplyAuthorId;
                const isEditingReply = editingCommentKey === reply._key;

                const handleReplyProfileClick = (e: React.MouseEvent) => {
                  e.preventDefault();
                  window.location.href = `/dashboard/${replyUsername}`;
                };

                return (
                  <div key={reply._key} className="flex gap-3">
                    <Avatar
                      className="h-9 w-9 shrink-0 bg-violet-500/10 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={handleReplyProfileClick}
                    >
                      {replyProfilePicUrl ? (
                        <AvatarImage
                          src={replyProfilePicUrl}
                          alt={replyFullName}
                        />
                      ) : (
                        <AvatarFallback className="bg-violet-500/10 text-violet-500 text-xs">
                          {replyInitial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-medium text-sm cursor-pointer text-violet-400 hover:text-violet-300 transition-colors"
                              onClick={handleReplyProfileClick}
                            >
                              {replyFullName}
                            </span>
                            {isReplyAuthor && (
                              <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
                                Author
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {formatPostTime(reply.createdAt)}
                            {reply.isEdited && (
                              <span className="ml-1 text-gray-500">
                                (edited)
                              </span>
                            )}
                          </span>
                        </div>
                        {canModifyReply && (
                          <div className="flex items-center gap-2">
                            {isEditingReply ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleSaveReplyEdit(
                                      reply._key,
                                      comment._key
                                    )
                                  }
                                  className="text-green-400 hover:text-green-300"
                                  title="Save"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-gray-400 hover:text-gray-300"
                                  title="Cancel"
                                >
                                  <XIcon className="h-3 w-3" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleEditReply(reply._key, comment._key)
                                  }
                                  className="text-blue-400 hover:text-blue-300"
                                  title="Edit"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteReply(reply._key, comment._key)
                                  }
                                  className="text-red-400 hover:text-red-300"
                                  title="Delete"
                                >
                                  <Trash className="h-3 w-3" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {isEditingReply ? (
                        <div className="mt-1">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-white/5 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-200 mt-1">
                          {reply.text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Show more replies button */}
              {comment.replies && comment.replies.length > 1 && (
                <button
                  onClick={() => toggleReplies(comment._key)}
                  className="text-xs text-violet-300 hover:text-violet-400"
                >
                  {isExpanded
                    ? "Show less replies"
                    : `Show ${comment.replies.length - 1} more ${
                        comment.replies.length === 2 ? "reply" : "replies"
                      }`}
                </button>
              )}
            </div>
          )}
        </div>
      );
    });
  }, [
    comments,
    user?.id,
    editingCommentKey,
    editText,
    replyingToKey,
    replyText,
    expandedReplies,
    post.author._id,
    handleDeleteComment,
    handleSaveEdit,
    handleSaveReplyEdit,
    isSubmitting,
  ]);

  const handleAuthorProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `/dashboard/${post.author.username}`;
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title={`Post by ${post.author.name}`}
      padding="p-0"
    >
      <div className="flex flex-col lg:flex-row h-[75vh] lg:h-[85vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-white/80 hover:text-white bg-transparent rounded-full p-2"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left side - Media (Only visible on lg screens) */}
        <div className="hidden lg:flex relative flex-1 bg-transparent">
          {/* Media container */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {renderMedia()}
            {/* Navigation buttons */}
            {hasMultipleMedia && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 rounded-full p-2"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 rounded-full p-2"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right side - Post content and comments */}
        <div className="w-full lg:w-[400px] flex flex-col bg-transparent text-white h-full">
          {/* Fixed header */}
          <div className="p-6 ">
            <div className="flex items-start gap-3">
              <Avatar
                className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleAuthorProfileClick}
              >
                <AvatarImage src={post.author.profilePicture.asset.url} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold truncate cursor-pointer hover:text-violet-300 transition-colors"
                      onClick={handleAuthorProfileClick}
                    >
                      {post.author.name}
                    </span>
                    <ShieldCheck className="h-5 w-5 text-violet-400" />
                  </div>
                  <div className="flex gap-1">
                    {post.author.roles?.map((role) => (
                      <span
                        key={role}
                        className={cn(
                          "px-2 py-0.5 rounded-md text-xs font-semibold",
                          role === "agent"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                        )}
                      >
                        {role === "agent" ? "A" : "C"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatPostTime(post.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            {/* Post content */}
            <div className="p-6 border-b border-white/10">
              {post.title && (
                <h2 className="text-lg font-semibold mb-3 text-gray-100">
                  {post.title}
                </h2>
              )}
              <p className="whitespace-pre-wrap text-sm text-gray-200">
                {post.content}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={`tag-${index}`}
                      className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full cursor-pointer hover:bg-blue-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile media section */}
            <div className="lg:hidden">
              {currentMedia && (
                <div className="relative w-full">
                  <div className="relative w-full h-[290px] sm:h-[370px]">
                    {renderMedia()}
                  </div>
                  {hasMultipleMedia && (
                    <>
                      <button
                        onClick={handlePrevious}
                        className="absolute left-1 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/80 rounded-full p-2"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/80 rounded-full p-2"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Comments section */}
            <div className="p-6 space-y-6">
              <div className="text-lg font-semibold mb-3 text-gray-100">
                Comments
              </div>
              {comments.length > 0 ? (
                renderComments
              ) : (
                <div className="text-gray-400 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>

          {/* Fixed comment input at bottom */}
          <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm p-4 w-full">
            <form
              onSubmit={handleAddComment}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="rounded-full px-4 py-2 text-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </GlassModal>
  );
}
