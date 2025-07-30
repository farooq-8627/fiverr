import React, { useState, useEffect } from "react";
import { FileUpload } from "./file-upload";
import { Button } from "../../UI/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Supported image formats
const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
  type: "profile" | "banner" | "project" | "logo";
  image: File | null;
  onImageChange: (file: File | null) => void;
  className?: string;
}

export function ImageUpload({
  type,
  image,
  onImageChange,
  className,
}: ImageUploadProps) {
  const isProfile = type === "profile" || type === "logo";
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create object URL when image changes
  useEffect(() => {
    // Clean up previous URL to avoid memory leaks
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }

    // Only create a URL if we have a valid File object
    if (image instanceof File) {
      setIsLoading(true);
      try {
        const url = URL.createObjectURL(image);
        setImageUrl(url);
        setIsLoading(false);
      } catch (err) {
        console.error("Error creating object URL:", err);
        setError("Failed to load image preview");
        setIsLoading(false);
      }
    }

    // Clean up function to revoke URL when component unmounts or image changes
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image]);

  const validateImage = (file: File | null): boolean => {
    if (!file) return true;

    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError(
        `Unsupported file type: ${file.type}. Please use JPG, PNG, GIF, WebP, or SVG.`
      );
      toast.error(
        `Unsupported file type. Please use JPG, PNG, GIF, WebP, or SVG.`
      );
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 5MB.`
      );
      toast.error(`File too large. Maximum size is 5MB.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clean up URL before removing the image
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }

    onImageChange(null);
    setError(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept =
      "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (validateImage(file)) {
          onImageChange(file);
        }
      }
    };
    fileInput.click();
  };

  const handleFileChange = (file: File | null) => {
    if (file && validateImage(file)) {
      onImageChange(file);
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative ${
          isProfile
            ? "w-20 h-20 rounded-full"
            : "h-24 rounded-lg bg-white/5 border border-white/20"
        } overflow-hidden`}
      >
        {imageUrl && image ? (
          <div className="relative w-full h-full group/image">
            <img
              src={imageUrl}
              alt={
                type === "profile"
                  ? "Profile"
                  : type === "logo"
                    ? "Logo"
                    : "Banner"
              }
              className={`w-full h-full object-cover ${isProfile ? "rounded-full" : ""}`}
            />
            {/* Overlay with edit/remove options */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                onClick={handleEdit}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <i className="fas fa-pencil-alt text-sm" />
              </Button>
              <Button
                onClick={handleRemove}
                className="bg-red-500/20 hover:bg-red-500/30 text-white rounded-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <i className="fas fa-trash text-sm" />
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white/50" />
          </div>
        ) : (
          <div
            className={`w-full h-full ${
              isProfile ? "rounded-full bg-white/5 border border-white/20" : ""
            }`}
          >
            {!isProfile && (
              <div className="flex items-center justify-center h-full gap-4">
                <i
                  className={`${
                    isProfile ? "fas fa-user text-2xl" : "fas fa-image text-2xl"
                  } text-white/30`}
                />
                <div className="flex flex-col">
                  <p className="text-white/30">Upload Banner Image</p>
                  <p className="text-white/30 text-xs">
                    Recommended: 1200 ×300
                  </p>
                </div>
              </div>
            )}
            {isProfile && (
              <div className="flex items-center justify-center h-full gap-4">
                <i
                  className={`${type === "logo" ? "fas fa-building" : "fas fa-user"} text-2xl text-white/30`}
                />
              </div>
            )}
            <FileUpload
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
