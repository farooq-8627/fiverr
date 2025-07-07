import React from "react";
import { FileUpload } from "./file-upload";
import { Button } from "../../UI/button";

interface ImageUploadProps {
  type: "profile" | "banner" | "project";
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
  const isProfile = type === "profile";

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageChange(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImageChange(file);
    };
    fileInput.click();
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
        {image ? (
          <div className="relative w-full h-full group/image">
            <img
              src={URL.createObjectURL(image)}
              alt={isProfile ? "Profile" : "Banner"}
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
                <i className="fas fa-user text-2xl text-white/30" />
              </div>
            )}
            <FileUpload
              accept="image/*"
              onChange={onImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
