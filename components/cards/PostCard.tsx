"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/UI/GlassCard";
import { Button } from "@/components/UI/button";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  ExternalLink,
  MoreHorizontal,
  FileText,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Video,
  File,
  Globe,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { PostModal } from "@/components/UI/PostModal";
import { formatDistanceToNow } from "date-fns";
import { formatPostTime } from "@/lib/formatPostTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/UI/badge";

export interface Media {
  type: "image" | "video" | "pdf";
  file: {
    asset: {
      url: string;
    };
  };
  caption?: string;
  altText?: string;
  aspectRatio?: number;
}

interface Post {
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
    profilePicture: {
      asset: {
        url: string;
      };
    };
    title?: string;
    verified?: boolean;
    roles?: string[]; // Add roles property
  };
}

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState<Media[]>(post.media || []);

  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Intersection observer for video autoplay
  useEffect(() => {
    if (!videoRef.current || !videoContainerRef.current) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7, // 70% of video must be visible
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(videoContainerRef.current);

    return () => observer.disconnect();
  }, []);

  // Handle video progress updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  };

  // Video control handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainerRef.current.requestFullscreen();
    }
  };

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * videoRef.current.duration;

    videoRef.current.currentTime = time;
    setProgress(percentage);
  };

  // Handle drag seeking
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleSeek(e);
  };

  const handleMediaClick = (index: number) => {
    setSelectedMediaIndex(index);
    setIsModalOpen(true);
  };

  const formattedTime = formatPostTime(post.createdAt);

  // Handle content expansion
  const shouldTruncate = post.content.length > 180;
  const displayContent = isExpanded ? post.content : post.content.slice(0, 180);

  // Calculate aspect ratio for images
  const calculateAspectRatio = (url: string): Promise<number> => {
    return new Promise<number>((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        resolve(img.width / img.height);
      };
      img.onerror = () => {
        resolve(1.33); // Default to 4:3 aspect ratio on error
      };
      img.src = url;
    });
  };

  // Update media with aspect ratios
  useEffect(() => {
    const media = post.media || [];
    if (media.length === 0) return;

    const updateAspectRatios = async () => {
      const updatedMedia = await Promise.all(
        media.map(async (media) => {
          if (media.type === "image") {
            const aspectRatio = await calculateAspectRatio(
              media.file.asset.url
            );
            return { ...media, aspectRatio };
          }
          return media;
        })
      );

      setMediaItems(updatedMedia);
    };

    updateAspectRatios();
  }, [post.media]);

  // Get media grid layout class and container classes based on number of items
  const getMediaLayout = (count: number, media: Media[], index: number) => {
    // Base height for all layouts
    const baseHeight = "h-[250px]";
    const halfHeight = "h-[200px]";

    switch (count) {
      case 1:
        return {
          gridClass: "grid-cols-1",
          containerClass: baseHeight,
        };
      case 2:
        // For 2 items, check aspect ratios to determine layout
        const firstAspectRatio = media[0].aspectRatio || 1.33;
        const secondAspectRatio = media[1].aspectRatio || 1.33;
        const totalAspectRatio = firstAspectRatio + secondAspectRatio;

        return {
          gridClass: totalAspectRatio > 3.2 ? "grid-cols-1" : "grid-cols-2",
          containerClass: baseHeight,
        };
      case 3:
        return {
          gridClass: "grid-cols-1",
          containerClass: index === 0 ? baseHeight : halfHeight,
          wrapperClass: index === 0 ? "" : "grid grid-cols-2 gap-2 mt-2",
        };
      case 4:
        return {
          gridClass: "grid-cols-2",
          containerClass: halfHeight,
        };
      default:
        return {
          gridClass: "grid-cols-2",
          containerClass: halfHeight,
        };
    }
  };

  // Render media item based on type
  const renderMediaItem = (media: Media, index: number, totalCount: number) => {
    const isLast = index === totalCount - 1 && totalCount > 4;
    const remainingCount = totalCount - 4;
    const layout = getMediaLayout(totalCount, mediaItems, index);
    const containerClasses = `relative ${layout.containerClass} rounded-lg overflow-hidden`;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = "/images/placeholder-media.jpg";
      e.currentTarget.onerror = null;
    };

    switch (media.type) {
      case "image":
        return (
          <div
            className={`${containerClasses} cursor-pointer group bg-gray-800`}
            onClick={() => handleMediaClick(index)}
          >
            <Image
              src={media.file.asset.url}
              alt={media.altText || media.caption || `Media ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
            />
            {isLast && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        );
      case "video":
        return (
          <div
            className={`${containerClasses} bg-gray-800 cursor-pointer`}
            onClick={() => handleMediaClick(index)}
          >
            {media.file.asset.url ? (
              renderVideo(media)
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Video className="w-12 h-12 text-gray-600" />
                <span className="text-gray-400 text-sm mt-2">
                  Video unavailable
                </span>
              </div>
            )}
          </div>
        );
      case "pdf":
        return (
          <div className={containerClasses}>
            <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center group hover:bg-gray-700 transition-colors">
              <FileText className="w-12 h-12 text-gray-400 group-hover:text-gray-300" />
              {media.caption && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm truncate">
                  {media.caption}
                </span>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div
            className={`${containerClasses} bg-gray-800 flex flex-col items-center justify-center`}
          >
            <File className="w-12 h-12 text-gray-600" />
            <span className="text-gray-400 text-sm mt-2">
              Unsupported media
            </span>
          </div>
        );
    }
  };

  // Update video rendering with enhanced controls
  const renderVideo = (media: Media) => (
    <div
      ref={videoContainerRef}
      className="absolute inset-0"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={media.file.asset.url}
        poster={media.file.asset.url}
        className="w-full h-full object-cover"
        controls={false}
        playsInline
        muted={isMuted}
        loop
        onTimeUpdate={handleTimeUpdate}
        onError={(e) => {
          console.error("Video loading error:", e);
          setIsPlaying(false);
        }}
      >
        <source src={media.file.asset.url} type="video/mp4" />
        <source src={media.file.asset.url} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Enhanced video controls overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2">
          {/* Progress bar */}
          <div
            ref={progressBarRef}
            className="flex-grow h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleSeek}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onMouseMove={handleDrag}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-100 group-hover:bg-blue-400"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>

            {/* Time display */}
            <div className="text-white text-sm flex-grow">
              {videoRef.current && (
                <>
                  {formatTime(videoRef.current.currentTime)} /{" "}
                  {formatTime(videoRef.current.duration)}
                </>
              )}
            </div>

            <button
              onClick={handleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper function to format time
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <GlassCard className={cn("overflow-hidden", className)}>
      <div className="">
        {/* Author Section */}
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.profilePicture.asset.url} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate">
                  {post.author.name}
                </span>
                {post.author.verified && (
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                )}
              </div>
              <div className="flex gap-1">
                {post.author.roles?.includes("agent") && (
                  <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-500 rounded text-xs font-medium">
                    A
                  </span>
                )}
                {post.author.roles?.includes("client") && (
                  <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded text-xs font-medium">
                    C
                  </span>
                )}
              </div>
            </div>
            {post.author.title && (
              <p className="text-xs text-gray-400 line-clamp-1">
                {post.author.title}
              </p>
            )}
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Globe className="h-3 w-3" /> {formattedTime}
            </span>
          </div>
        </div>

        {/* Title Section */}
        {post.title && (
          <h2 className="text-base font-semibold mt-3 text-gray-100">
            {post.title}
          </h2>
        )}

        {/* Content Section */}
        <div className="mt-2">
          <p className="whitespace-pre-wrap text-xs text-gray-200">
            {displayContent}
            {shouldTruncate && !isExpanded && "..."}
          </p>

          {/* Tags Section - Only show when expanded */}
          {isExpanded && post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs text-blue-300 hover:text-blue-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More Button */}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-400 hover:text-blue-300 mt-1"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Media Section */}
        {mediaItems.length > 0 && (
          <div className="mt-4 rounded-xl overflow-hidden">
            {mediaItems.length === 3 ? (
              // Special layout for 3 items
              <div className="space-y-2">
                {renderMediaItem(mediaItems[0], 0, 3)}
                <div className="grid grid-cols-2 gap-2">
                  {mediaItems.slice(1).map((media, idx) => (
                    <div key={idx + 1}>
                      {renderMediaItem(media, idx + 1, 3)}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Default grid layout for other counts
              <div
                className={`grid ${getMediaLayout(mediaItems.length, mediaItems, 0).gridClass} gap-2`}
              >
                {mediaItems
                  .slice(0, mediaItems.length > 4 ? 4 : mediaItems.length)
                  .map((media, index) => (
                    <div key={index}>
                      {renderMediaItem(media, index, mediaItems.length)}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Engagement Section */}
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

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <Button
            className={`flex items-center gap-2 ${
              isLiked ? "text-red-500" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className="h-5 w-5" />
            Like
          </Button>
          <Button className="flex items-center gap-2 text-gray-400 hover:text-white">
            <MessageCircle className="h-5 w-5" />
            Comment
          </Button>
          <Button className="flex items-center gap-2 text-gray-400 hover:text-white">
            <Repeat2 className="h-5 w-5" />
            Repost
          </Button>
          <Button className="flex items-center gap-2 text-gray-400 hover:text-white">
            <Send className="h-5 w-5" />
            Share
          </Button>
        </div>
      </div>

      {/* Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={post}
        selectedMediaIndex={selectedMediaIndex}
      />
    </GlassCard>
  );
}
