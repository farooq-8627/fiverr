import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Input } from "../../UI/input";
import { cn } from "@/lib/utils";

export type SocialPlatform = {
  id: string;
  name: string;
  icon: string;
  placeholder: string;
  urlPrefix?: string; // Optional URL prefix for standard formats
  color: string;
};

export const socialPlatforms: SocialPlatform[] = [
  // Core Professional Platforms
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    placeholder: "https://linkedin.com/in/username",
    urlPrefix: "https://linkedin.com/in/",
    color: "#0077B5",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "github",
    placeholder: "https://github.com/username",
    urlPrefix: "https://github.com/",
    color: "#333",
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    icon: "stack-overflow",
    placeholder: "https://stackoverflow.com/users/username",
    urlPrefix: "https://stackoverflow.com/",
    color: "#F48024",
  },

  // Tech Community Platforms
  {
    id: "dev",
    name: "Dev.to",
    icon: "dev",
    placeholder: "https://dev.to/username",
    urlPrefix: "https://dev.to/",
    color: "#0A0A0A",
  },
  {
    id: "medium",
    name: "Medium",
    icon: "medium",
    placeholder: "https://medium.com/@username",
    urlPrefix: "https://medium.com/",
    color: "#12100E",
  },
  {
    id: "hashnode",
    name: "Hashnode",
    icon: "hashnode",
    placeholder: "https://hashnode.com/@username",
    urlPrefix: "https://hashnode.com/",
    color: "#2962FF",
  },

  // Communication & Collaboration
  {
    id: "discord",
    name: "Discord",
    icon: "discord",
    placeholder: "Discord Username",
    color: "#7289DA",
  },
  {
    id: "slack",
    name: "Slack",
    icon: "slack",
    placeholder: "Slack Workspace URL",
    color: "#4A154B",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "telegram",
    placeholder: "https://t.me/username",
    urlPrefix: "https://t.me/",
    color: "#0088CC",
  },

  // Professional Networking & Showcase
  {
    id: "behance",
    name: "Behance",
    icon: "behance",
    placeholder: "https://behance.net/username",
    urlPrefix: "https://behance.net/",
    color: "#1769FF",
  },
  {
    id: "dribbble",
    name: "Dribbble",
    icon: "dribbble",
    placeholder: "https://dribbble.com/username",
    urlPrefix: "https://dribbble.com/",
    color: "#EA4C89",
  },
  {
    id: "kaggle",
    name: "Kaggle",
    icon: "kaggle",
    placeholder: "https://kaggle.com/username",
    urlPrefix: "https://kaggle.com/",
    color: "#20BEFF",
  },

  // Tech & Professional Platforms
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: "x-twitter",
    placeholder: "https://x.com/username",
    urlPrefix: "https://x.com/",
    color: "#000000",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "youtube",
    placeholder: "https://youtube.com/@channel-name",
    urlPrefix: "https://youtube.com/@",
    color: "#FF0000",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    placeholder: "https://instagram.com/username",
    urlPrefix: "https://instagram.com/",
    color: "#E1306C",
  },
];

interface SocialMediaIconsProps {
  onSocialLinksChange: (links: { platform: string; url: string }[]) => void;
  initialLinks?: { platform: string; url: string }[];
}

export function SocialMediaIcons({
  onSocialLinksChange,
  initialLinks = [],
}: SocialMediaIconsProps) {
  const [socialLinks, setSocialLinks] = useState<
    { platform: string; url: string }[]
  >([]);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  // Initialize with provided links if available
  useEffect(() => {
    if (initialLinks && initialLinks.length > 0) {
      setSocialLinks(initialLinks);
    }
  }, [initialLinks]);

  const handleIconClick = (platformId: string) => {
    if (activeIcon === platformId) {
      setActiveIcon(null);
    } else {
      setActiveIcon(platformId);
    }
  };

  // Extract username from a full URL based on platform's URL prefix
  const extractUsername = (platformId: string, fullUrl: string): string => {
    const platformObj = socialPlatforms.find((p) => p.id === platformId);
    if (platformObj?.urlPrefix && fullUrl.startsWith(platformObj.urlPrefix)) {
      return fullUrl.substring(platformObj.urlPrefix.length);
    }
    return fullUrl;
  };

  // Create full URL from username based on platform's URL prefix
  const createFullUrl = (platformId: string, usernameOrUrl: string): string => {
    const platformObj = socialPlatforms.find((p) => p.id === platformId);
    if (platformObj?.urlPrefix && !usernameOrUrl.includes("://")) {
      return `${platformObj.urlPrefix}${usernameOrUrl}`;
    }
    return usernameOrUrl;
  };

  const handleLinkSave = (platformId: string, usernameOrUrl: string) => {
    // Trim the input and only add if it's not an empty string
    const trimmedInput = usernameOrUrl.trim();
    if (trimmedInput === "") return;

    // Create the full URL if the platform has a standard format
    const fullUrl = createFullUrl(platformId, trimmedInput);

    const newLinks = [...socialLinks];
    const existingLinkIndex = newLinks.findIndex(
      (link) => link.platform === platformId
    );

    if (existingLinkIndex !== -1) {
      // If URL is empty, remove the link
      if (trimmedInput === "") {
        newLinks.splice(existingLinkIndex, 1);
      } else {
        newLinks[existingLinkIndex].url = fullUrl;
      }
    } else if (trimmedInput !== "") {
      // Only add new link if URL is not empty
      newLinks.push({ platform: platformId, url: fullUrl });
    }

    setSocialLinks(newLinks);
    onSocialLinksChange(newLinks);
    setActiveIcon(null);
  };

  const isLinkSaved = (platformId: string) => {
    return socialLinks.some(
      (link) => link.platform === platformId && link.url.trim() !== ""
    );
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="w-full space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="overflow-x-auto py-2 px-2"
        >
          <motion.div
            className="flex space-x-4 min-w-max"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {socialPlatforms.map((platform) => (
              <Tooltip.Root key={platform.id}>
                <Tooltip.Trigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <button
                      onClick={() => handleIconClick(platform.id)}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                        activeIcon === platform.id
                          ? "bg-white/20 ring-2 ring-white/50"
                          : isLinkSaved(platform.id)
                            ? "bg-green-500/20"
                            : "bg-white/10 hover:bg-white/20"
                      )}
                      style={{
                        boxShadow:
                          isLinkSaved(platform.id) || activeIcon === platform.id
                            ? `0 0 15px ${platform.color}40`
                            : "none",
                      }}
                    >
                      <i
                        className={`fab fa-${platform.icon} text-xl`}
                        style={{
                          color:
                            activeIcon === platform.id ||
                            isLinkSaved(platform.id)
                              ? "#fff"
                              : "rgba(255,255,255,0.5)",
                        }}
                      />
                    </button>
                    {isLinkSaved(platform.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <i className="fas fa-check text-[10px] text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="z-50 select-none rounded-md bg-black/80 px-3 py-1.5 text-xs text-white shadow-lg will-change-[transform,opacity] data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade"
                    sideOffset={5}
                  >
                    {platform.name}
                    <Tooltip.Arrow className="fill-black/80" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {activeIcon && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ width: 40 }}
                animate={{ width: "100%" }}
                className="relative flex items-center"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i
                    className={`fab fa-${
                      socialPlatforms.find((p) => p.id === activeIcon)?.icon ||
                      ""
                    } text-white/40`}
                  />
                </div>
                <Input
                  type="url"
                  defaultValue={
                    socialLinks.find((link) => link.platform === activeIcon)
                      ?.url || ""
                  }
                  placeholder={
                    socialPlatforms.find((p) => p.id === activeIcon)
                      ?.placeholder
                  }
                  className="bg-white/5 text-white pl-10 pr-16"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLinkSave(activeIcon, e.currentTarget.value);
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector(
                      "input"
                    ) as HTMLInputElement;
                    handleLinkSave(activeIcon, input.value);
                  }}
                  className="absolute right-0 px-3 py-1 bg-transparent hover:bg-white/10 text-white/60 hover:text-white"
                >
                  Save
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Tooltip.Provider>
  );
}
