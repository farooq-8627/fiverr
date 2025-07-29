"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/mesaging/ui/popover";
import { SmileIcon } from "lucide-react";
import EmojiPickerReact, { EmojiClickData, Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { theme } = useTheme();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <EmojiPickerReact
          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={handleEmojiClick}
          width={320}
          height={400}
        />
      </PopoverContent>
    </Popover>
  );
};
