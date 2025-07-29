import {
  FaLinkedin,
  FaGithub,
  FaStackOverflow,
  FaDev,
  FaMedium,
  FaHashtag,
  FaDiscord,
  FaSlack,
  FaTelegram,
  FaBehance,
  FaDribbble,
  FaKaggle,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

export interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ElementType;
  placeholder: string;
  urlPrefix?: string;
  color: string;
}

// Social Platforms
export const socialPlatforms: SocialPlatform[] = [
  // Core Professional Platforms
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: FaLinkedin,
    placeholder: "https://linkedin.com/in/username",
    urlPrefix: "https://linkedin.com/in/",
    color: "#0077B5",
  },
  {
    id: "github",
    name: "GitHub",
    icon: FaGithub,
    placeholder: "https://github.com/username",
    urlPrefix: "https://github.com/",
    color: "#333",
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    icon: FaStackOverflow,
    placeholder: "https://stackoverflow.com/users/username",
    urlPrefix: "https://stackoverflow.com/",
    color: "#F48024",
  },

  // Tech Community Platforms
  {
    id: "dev",
    name: "Dev.to",
    icon: FaDev,
    placeholder: "https://dev.to/username",
    urlPrefix: "https://dev.to/",
    color: "#0A0A0A",
  },
  {
    id: "medium",
    name: "Medium",
    icon: FaMedium,
    placeholder: "https://medium.com/@username",
    urlPrefix: "https://medium.com/",
    color: "#12100E",
  },
  {
    id: "hashnode",
    name: "Hashnode",
    icon: FaHashtag,
    placeholder: "https://hashnode.com/@username",
    urlPrefix: "https://hashnode.com/",
    color: "#2962FF",
  },

  // Communication & Collaboration
  {
    id: "discord",
    name: "Discord",
    icon: FaDiscord,
    placeholder: "Discord Username",
    color: "#7289DA",
  },
  {
    id: "slack",
    name: "Slack",
    icon: FaSlack,
    placeholder: "Slack Workspace URL",
    color: "#4A154B",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: FaTelegram,
    placeholder: "https://t.me/username",
    urlPrefix: "https://t.me/",
    color: "#0088CC",
  },

  // Professional Networking & Showcase
  {
    id: "behance",
    name: "Behance",
    icon: FaBehance,
    placeholder: "https://behance.net/username",
    urlPrefix: "https://behance.net/",
    color: "#1769FF",
  },
  {
    id: "dribbble",
    name: "Dribbble",
    icon: FaDribbble,
    placeholder: "https://dribbble.com/username",
    urlPrefix: "https://dribbble.com/",
    color: "#EA4C89",
  },
  {
    id: "kaggle",
    name: "Kaggle",
    icon: FaKaggle,
    placeholder: "https://kaggle.com/username",
    urlPrefix: "https://kaggle.com/",
    color: "#20BEFF",
  },

  // Tech & Professional Platforms
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: FaTwitter,
    placeholder: "https://x.com/username",
    urlPrefix: "https://x.com/",
    color: "#000000",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: FaYoutube,
    placeholder: "https://youtube.com/@channel-name",
    urlPrefix: "https://youtube.com/@",
    color: "#FF0000",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    placeholder: "https://instagram.com/username",
    urlPrefix: "https://instagram.com/",
    color: "#E1306C",
  },
];
