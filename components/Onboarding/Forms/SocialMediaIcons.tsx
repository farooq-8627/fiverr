import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Input } from "../../UI/input";
import { cn } from "@/lib/utils";
import { socialPlatforms } from "@/lib/social-platforms";

export type SocialPlatform = {
  id: string;
  name: string;
  icon: React.ElementType; // Changed from ReactNode to ElementType
  placeholder: string;
  urlPrefix?: string; // Optional URL prefix for standard formats
  color: string;
};

// Helper function to render social icons consistently
export function SocialIcon({
  platform,
  className = "w-6 h-6",
}: {
  platform: SocialPlatform | undefined;
  className?: string;
}) {
  if (!platform) return null;

  const Icon = platform.icon;
  return <Icon className={className} />;
}

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
                      <div
                        className="text-xl"
                        style={{
                          color:
                            activeIcon === platform.id ||
                            isLinkSaved(platform.id)
                              ? "#fff"
                              : "rgba(255,255,255,0.5)",
                        }}
                      >
                        <SocialIcon platform={platform} />
                      </div>
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
                  <div className="text-white/40">
                    <SocialIcon
                      platform={socialPlatforms.find(
                        (p) => p.id === activeIcon
                      )}
                    />
                  </div>
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
