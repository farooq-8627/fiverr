import * as React from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  className?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, onChange, accept, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      if (onChange) {
        onChange(file);
      }
    };

    return (
      <div
        className={cn(
          "relative flex min-h-[100px] w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-white/20 bg-background/50 px-4 py-4 text-sm hover:bg-background/80",
          className
        )}
      >
        <input
          type="file"
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <div className="text-center space-y-2">
          <div className="text-white/60">Drag & drop or click to upload</div>
          <div className="text-xs text-white/40">
            Supported formats: JPG, PNG, GIF (max 5MB)
          </div>
        </div>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
