import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../UI/avatar";
import { GlassCard } from "../UI/GlassCard";
import { socialPlatforms } from "@/lib/social-platforms";
import {
  processSocialLinks,
  SanityUserSocialLink,
  SocialLinkIcon,
} from "@/lib/social-media-helper";

interface ProfileBannerCardProps {
  bannerImage: string;
  profilePicture: string;
  fullName: string;
  username: string;
  website: string;
  tagline: string;
  socialLinks?: SanityUserSocialLink[];
}

export const ProfileBannerCard = ({
  bannerImage,
  profilePicture,
  fullName,
  username,
  website,
  tagline,
  socialLinks,
}: ProfileBannerCardProps) => {
  const processedLinks = processSocialLinks(socialLinks);

  return (
    <GlassCard className="relative overflow-hidden" padding="p-0">
      {/* Banner */}
      <div className="h-28 sm:h-48 relative">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 md:px-12 pb-6">
        <div className="flex flex-col items-start">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 -mt-12 md:-mt-16 border-4 border-black/50 shadow-xl">
            <AvatarImage src={profilePicture} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate text-xl">{fullName}</span>
              <ShieldCheck className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-base font-medium">{tagline}</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-gray-400 text-sm">{username}</p>
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="flex gap-4">
              {processedLinks.map(({ platform, url }) => (
                <SocialLinkIcon
                  key={platform.id}
                  platform={platform}
                  url={url}
                  className="text-gray-400 hover:text-gray-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
