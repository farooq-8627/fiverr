import React, { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { User } from "@/types/User";
import { FeedMedia, FeedPost } from "@/types/Posts";
import { GlassModal } from "@/components/UI/GlassModal";
import { createPost, CreatePostData } from "@/app/user-details/actions";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Label } from "@/components/UI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Switch } from "@/components/UI/switch";
import { Badge } from "@/components/UI/badge";
import { FileText, ImagePlus, Tag, UserIcon, X } from "lucide-react";
import { Award } from "lucide-react";
import { ACHIEVEMENT_TYPES } from "@/sanity/schemaTypes/constants";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    profileId: string;
    user?: User | null;
  };
  isCurrentUser: boolean;
  onPostUpdate: (data: FeedPost) => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  initialData,
  isCurrentUser,
  onPostUpdate,
}: CreatePostModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<FeedMedia[]>([]);

  // Determine the default author type based on available profiles
  const getDefaultAuthorType = () => {
    if (!initialData.user) return "agent"; // Default fallback

    const hasAgentProfile = initialData.user.agentProfiles?.length || 0 > 0;
    const hasClientProfile = initialData.user.clientProfiles?.length || 0 > 0;

    if (hasAgentProfile && hasClientProfile) {
      return ""; // Empty if both profiles exist - user must choose
    }
    return hasAgentProfile ? "agent" : "client";
  };

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    currentTag: "", // For tag input
    authorType: getDefaultAuthorType(),
    isAchievement: false,
    achievementType: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles?.length) return;

    // Store the actual files
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    const newPreviews: FeedMedia[] = newFiles.map((file) => ({
      _key: Math.random().toString(36).substr(2, 9),
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "pdf",
      file: {
        asset: {
          _ref: "placeholder",
          _type: "reference",
        },
        url: URL.createObjectURL(file),
      },
      caption: "",
      altText: file.name,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (key: string) => {
    setPreviews((prev) => prev.filter((p) => p._key !== key));
    setFiles((prev) => prev.filter((_, index) => prev[index].name !== key));
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(formData.currentTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, prev.currentTag.trim()],
          currentTag: "",
        }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!isCurrentUser) {
      toast({
        title: "Permission Denied",
        description: "You can only create posts as yourself.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    if (!initialData.user?._id) {
      toast({
        title: "Error",
        description: "User information is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const postData = {
        ...formData,
        authorId: initialData.user._id,
        media: files,
      };

      const response = await createPost(postData as CreatePostData);

      if (response.success) {
        // Cleanup preview URLs
        previews.forEach((preview) => {
          if (preview.file.url.startsWith("blob:")) {
            URL.revokeObjectURL(preview.file.url);
          }
        });

        onPostUpdate(response.data as unknown as FeedPost);
        toast({
          title: "Success",
          description: "Post created successfully.",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create post.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has both profile types
  const hasBothProfileTypes =
    (initialData.user?.agentProfiles?.length || 0) > 0 &&
    (initialData.user?.clientProfiles?.length || 0) > 0;

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Post"
      description="Share your thoughts, achievements, or updates"
    >
      <div className="flex flex-col h-[75vh]">
        <div className="flex-1 overflow-y-auto pr-4 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label
              className="text-violet-200 flex items-center gap-2"
              htmlFor="title"
            >
              <FileText className="h-4 w-4 text-violet-400" />
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Give your post a title"
            />
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <Label
              className="text-violet-200 flex items-center gap-2"
              htmlFor="content"
            >
              <FileText className="h-4 w-4 text-violet-400" />
              Content
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="What's on your mind?"
              className="min-h-[100px]"
            />
          </div>

          {/* Author Type Selection - Only show if user has both profile types */}
          {hasBothProfileTypes && (
            <div className="space-y-2">
              <Label className="text-violet-200 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-violet-400" />
                Post As
              </Label>
              <Select
                value={formData.authorType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, authorType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role for this post" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tags Input */}
          <div className="space-y-2">
            <Label
              className="text-violet-200 flex items-center gap-2"
              htmlFor="tags"
            >
              <Tag className="h-4 w-4 text-violet-400" />
              Tags
            </Label>
            <Input
              id="tags"
              value={formData.currentTag}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  currentTag: e.target.value.replace(/#/g, ""),
                }))
              }
              onKeyDown={handleTagAdd}
              placeholder="Add tags (press Enter to add)"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label
              className="text-violet-200 flex items-center gap-2"
              htmlFor="media"
            >
              <ImagePlus className="h-4 w-4 text-violet-400" />
              Media
            </Label>
            <Input
              id="media"
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*,application/pdf"
              multiple
              className="cursor-pointer"
            />
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {previews.map((media) => (
                  <div key={media._key} className="relative">
                    {media.type === "image" && (
                      <img
                        src={media.file.url}
                        alt={media.altText || "Uploaded content"}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    {media.type === "video" && (
                      <video
                        src={media.file.url}
                        className="w-full h-32 object-cover rounded-md"
                        controls
                      />
                    )}
                    {media.type === "pdf" && (
                      <div className="w-full h-32 bg-secondary flex items-center justify-center rounded-md">
                        PDF Document
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(media._key)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievement Toggle and Type */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-violet-200 flex items-center gap-2">
                <Award className="h-4 w-4 text-violet-400" />
                Is this an achievement post?
              </Label>
              <Switch
                id="achievement"
                checked={formData.isAchievement}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAchievement: checked,
                    achievementType: checked ? prev.achievementType : "",
                  }))
                }
              />
            </div>

            {formData.isAchievement && (
              <div className="space-y-2">
                <Label className="text-violet-200 flex items-center gap-2">
                  <Award className="h-4 w-4 text-violet-400" />
                  Achievement Type
                </Label>
                <Select
                  value={formData.achievementType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, achievementType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select achievement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-violet-800/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </GlassModal>
  );
}
