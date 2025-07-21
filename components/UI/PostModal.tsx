"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Modal, ModalContent } from "./modal";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
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
} from "lucide-react";
import { formatPostTime } from "@/lib/formatPostTime";
import type { Media } from "../cards/PostCard";
import { GlassModal } from "./GlassModal";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    username: string;
    profilePicture: {
      asset: {
        url: string;
      };
    };
    verified?: boolean;
  };
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    likes: number;
    comments: number;
    reposts: number;
    media?: Media[];
    author: {
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
  comments?: Comment[];
}

export function PostModal({
  isOpen,
  onClose,
  post,
  selectedMediaIndex,
  comments = [],
}: PostModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] =
    useState(selectedMediaIndex);
  const formattedTime = formatPostTime(post.createdAt);

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
              className="w-full h-full object-contain"
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

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title={`Post by ${post.author.name}`}
      padding="p-6"
    >
      <div className="flex flex-col lg:flex-row h-[75vh]">
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
            {/* <div className="relative w-full h-[700px]"> */}
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
            {/* </div> */}

            {/* Media dots - Moved outside the media container */}
            {hasMultipleMedia && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
                {post.media?.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentMediaIndex
                        ? "bg-white w-4"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    onClick={() => setCurrentMediaIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Post content and comments */}
        <div className="w-full lg:w-[400px] flex flex-col bg-transparent text-white h-full">
          {/* Main scrollable container */}
          <div className="flex-1 overflow-y-auto">
            {/* Author info */}
            <div className="md:px-6 md:pt-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={post.author.profilePicture.asset.url} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="shrink-0 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">
                        {post.author.name}
                      </span>
                      <ShieldCheck className="h-5 w-5 text-violet-400" />
                    </div>
                    {/* Move Author Type Badge to the right */}
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
                  {/* Time */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formattedTime}
                    </span>
                  </div>
                  {post.author.portfolio && (
                    <a
                      href={post.author.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 line-clamp-1 flex items-center gap-1 mt-1"
                    >
                      Portfolio
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Post content */}
            <div className="py-6 md:p-6 border-b border-white/10 bg-transparent">
              {post.title && (
                <h2 className="text-base font-semibold mb-3 text-gray-100">
                  {post.title}
                </h2>
              )}
              <p className="whitespace-pre-wrap text-xs text-gray-200">
                {post.content}
              </p>

              {/* Tags Section */}
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

              <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <span>{post.likes}</span>
                  <span>likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{post.comments}</span>
                  <span>comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{post.reposts}</span>
                  <span>reposts</span>
                </div>
              </div>
            </div>

            {/* Media section for mobile and tablet */}
            {currentMedia && (
              <div className="lg:hidden relative w-full h-[320px] sm:h-[400px] bg-transparent">
                <div className="relative w-full h-full flex items-center justify-center">
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

                      {/* Mobile media dots */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-2">
                        {post.media?.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentMediaIndex
                                ? "bg-white w-4"
                                : "bg-white/50 hover:bg-white/70"
                            }`}
                            onClick={() => setCurrentMediaIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Comments section */}
            <div className="p-6 space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage
                      src={comment.author.profilePicture.asset.url}
                    />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.author.name}
                      </span>
                      <ShieldCheck className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-gray-400">
                        {formatPostTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 mt-1">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment input - Fixed at bottom */}
          <div className="sticky bottom-0 py-4 md:p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="rounded-full px-4 py-2 text-sm">Post</Button>
            </div>
          </div>
        </div>
      </div>
    </GlassModal>
  );
}
